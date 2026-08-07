<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Requests\StoreCheckoutRequest;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\Stripe\CheckoutSessionCreator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CheckoutController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $request->user()->cart()->loadCartItemsForDisplay();

        $addresses = $request->user()->addresses()->get(Address::DISPLAY_COLUMNS);

        return Inertia::render('Checkout/Index', [
            'cart' => $cart,
            'addresses' => $addresses,
        ]);
    }

    public function store(StoreCheckoutRequest $request): SymfonyResponse
    {
        $paymentMethod = PaymentMethod::from($request->validated('payment_method'));

        $order = DB::transaction(function () use ($request, $paymentMethod) {
            $cart = $request->user()->cart();
            $cart->load('orderItems');

            abort_if($cart->orderItems->isEmpty(), 422, 'Cart is empty.');

            $address = $request->user()->addresses()->findOrFail((int) $request->validated('address_id'));

            $total = '0';

            foreach ($cart->orderItems as $item) {
                if ($item->product_variant_id) {
                    $variant = ProductVariant::query()
                        ->whereKey($item->product_variant_id)
                        ->lockForUpdate()
                        ->firstOrFail();

                    abort_if($item->quantity > $variant->stock, 422, "Insufficient stock for {$variant->sku}.");

                    $variant->decrement('stock', $item->quantity);
                    $product = $variant->product;
                    $unitPrice = OrderItem::resolveUnitPrice($product, $variant);
                } else {
                    $product = Product::query()
                        ->whereKey($item->product_id)
                        ->lockForUpdate()
                        ->firstOrFail();

                    abort_if($item->quantity > $product->stock, 422, "Insufficient stock for {$product->name}.");

                    $product->decrement('stock', $item->quantity);
                    $variant = null;
                    $unitPrice = OrderItem::resolveUnitPrice($product, $variant);
                }

                $item->update([
                    'unit_price' => $unitPrice,
                    'product_snapshot' => OrderItem::buildProductSnapshot($product, $variant),
                ]);

                $total = bcadd($total, bcmul((string) $item->quantity, (string) $unitPrice, 2), 2);
            }

            $cart->forceFill([
                'status' => OrderStatus::Pending,
                'total' => $total,
                'payment_method' => $paymentMethod,
                'payment_status' => PaymentStatus::Unpaid,
                'customer_note' => $request->validated('customer_note'),
                'shipping_address_snapshot' => [
                    'label' => $address->label,
                    'name' => $address->name,
                    'line1' => $address->line1,
                    'line2' => $address->line2,
                    'city' => $address->city,
                    'state' => $address->state,
                    'postal_code' => $address->postal_code,
                    'country' => $address->country,
                    'phone' => $address->phone,
                ],
            ])->save();

            return $cart;
        });

        if ($paymentMethod === PaymentMethod::Stripe) {
            $session = app(CheckoutSessionCreator::class)->createForOrder($order);

            $order->update(['stripe_checkout_session_id' => $session->id]);

            return Inertia::location($session->url);
        }

        return redirect()->route('account.orders.show', $order);
    }

    public function stripeReturn(Request $request, CheckoutSessionCreator $checkoutSessionCreator, Order $order): RedirectResponse
    {
        $this->authorize('view', $order);

        $sessionId = $request->string('session_id')->value();

        if ($sessionId !== '' && $sessionId === $order->stripe_checkout_session_id
            && $order->payment_status !== PaymentStatus::Paid) {
            $session = $checkoutSessionCreator->retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                $order->markAsPaid($session->payment_intent);
            }
        }

        return redirect()->route('account.orders.show', $order);
    }
}
