<?php

namespace App\Services\Stripe;

use App\Models\Order;
use Stripe\Checkout\Session;
use Stripe\StripeClient;

class CheckoutSessionCreator
{
    public function __construct(private readonly StripeClient $client) {}

    public function createForOrder(Order $order): Session
    {
        $order->loadMissing('orderItems');

        $lineItems = $order->orderItems->map(fn ($item) => [
            'quantity' => $item->quantity,
            'price_data' => [
                'currency' => 'usd',
                'unit_amount' => (int) round(((float) $item->unit_price) * 100),
                'product_data' => [
                    'name' => $item->product_snapshot['name'] ?? 'Product',
                ],
            ],
        ])->all();

        return $this->client->checkout->sessions->create([
            'mode' => 'payment',
            'line_items' => $lineItems,
            'success_url' => route('checkout.stripe.return', ['order' => $order]).'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.index'),
            'customer_email' => $order->user->email,
            'metadata' => [
                'order_id' => (string) $order->id,
            ],
        ]);
    }

    public function retrieve(string $sessionId): Session
    {
        return $this->client->checkout->sessions->retrieve($sessionId);
    }
}
