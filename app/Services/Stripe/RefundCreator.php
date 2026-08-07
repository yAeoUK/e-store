<?php

namespace App\Services\Stripe;

use App\Models\Order;
use Stripe\Refund;
use Stripe\StripeClient;

class RefundCreator
{
    public function __construct(private readonly StripeClient $client) {}

    public function createForOrder(Order $order): Refund
    {
        return $this->client->refunds->create([
            'payment_intent' => $order->stripe_payment_intent_id,
        ]);
    }
}
