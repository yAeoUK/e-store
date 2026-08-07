<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $request->user()->cart()->loadCartItemsForDisplay();

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
        ]);
    }

    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $cart = $request->user()->cart();

        $item = $cart->orderItems()
            ->where('product_id', $data['product_id'])
            ->where('product_variant_id', $data['product_variant_id'] ?? null)
            ->first();

        if ($item) {
            $item->increment('quantity', $data['quantity']);
        } else {
            $variant = ProductVariant::findOptional($data['product_variant_id'] ?? null);
            $product = Product::query()->findOrFail((int) $data['product_id']);

            $cart->orderItems()->create([
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'quantity' => $data['quantity'],
                'unit_price' => OrderItem::resolveUnitPrice($product, $variant),
            ]);
        }

        return redirect()->route('cart.index');
    }

    public function update(UpdateCartItemRequest $request, OrderItem $orderItem): RedirectResponse
    {
        $variant = $orderItem->productVariant;
        $product = $orderItem->product;

        $orderItem->update([
            'quantity' => $request->validated('quantity'),
            'unit_price' => OrderItem::resolveUnitPrice($product, $variant),
        ]);

        return redirect()->route('cart.index');
    }

    public function destroy(OrderItem $orderItem): RedirectResponse
    {
        $this->authorize('delete', $orderItem);

        $orderItem->delete();

        return redirect()->route('cart.index');
    }

    public function clear(Request $request): RedirectResponse
    {
        $request->user()->cart()->orderItems()->delete();

        return redirect()->route('cart.index');
    }
}
