<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Exception\UnexpectedValueException;
use Stripe\StripeObject;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request): Response
    {
        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature', ''),
                config('services.stripe.webhook_secret'),
            );
        } catch (SignatureVerificationException|UnexpectedValueException) {
            return response('Invalid signature', 400);
        }

        match ($event->type) {
            'checkout.session.completed' => $this->markPaid($event->data->object),
            'checkout.session.expired' => $this->markFailed($event->data->object),
            default => null,
        };

        return response('', 200);
    }

    private function markPaid(StripeObject $session): void
    {
        $order = Order::query()->where('stripe_checkout_session_id', $session['id'])->first();

        if (! $order || $order->payment_status === PaymentStatus::Paid) {
            return;
        }

        $order->update([
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Processing,
            'stripe_payment_intent_id' => $session['payment_intent'],
            'paid_at' => now(),
        ]);
    }

    private function markFailed(StripeObject $session): void
    {
        $order = Order::query()->where('stripe_checkout_session_id', $session['id'])->first();

        if (! $order || $order->payment_status !== PaymentStatus::Unpaid) {
            return;
        }

        $order->update(['payment_status' => PaymentStatus::Failed]);
    }
}
