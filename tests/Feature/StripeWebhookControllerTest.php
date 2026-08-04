<?php

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

function signedStripeRequest(array $payload, string $secret): array
{
    $body = json_encode($payload);
    $timestamp = time();
    $signature = hash_hmac('sha256', "{$timestamp}.{$body}", $secret);

    return [$body, "t={$timestamp},v1={$signature}"];
}

function unpaidStripeOrder(): Order
{
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 20]);
    $order = $user->cart();
    OrderItem::factory()->create(['order_id' => $order->id, 'product_id' => $product->id, 'quantity' => 1]);
    $order->forceFill([
        'status' => 'pending',
        'total' => 20,
        'payment_method' => PaymentMethod::Stripe,
        'payment_status' => PaymentStatus::Unpaid,
        'stripe_checkout_session_id' => 'cs_test_webhook',
    ])->save();

    return $order;
}

test('checkout.session.completed marks the matching order as paid', function () {
    config(['services.stripe.webhook_secret' => 'whsec_test']);
    $order = unpaidStripeOrder();

    [$body, $signature] = signedStripeRequest([
        'id' => 'evt_1',
        'type' => 'checkout.session.completed',
        'data' => ['object' => ['id' => 'cs_test_webhook', 'payment_intent' => 'pi_123']],
    ], 'whsec_test');

    $response = $this->call('POST', route('stripe.webhook'), [], [], [], [
        'HTTP_Stripe-Signature' => $signature,
        'CONTENT_TYPE' => 'application/json',
    ], $body);

    $response->assertOk();

    $order->refresh();
    expect($order->payment_status)->toBe(PaymentStatus::Paid);
    expect($order->status->value)->toBe('processing');
    expect($order->stripe_payment_intent_id)->toBe('pi_123');
    expect($order->paid_at)->not->toBeNull();
});

test('checkout.session.completed is idempotent when redelivered', function () {
    config(['services.stripe.webhook_secret' => 'whsec_test']);
    $order = unpaidStripeOrder();

    [$body, $signature] = signedStripeRequest([
        'id' => 'evt_1',
        'type' => 'checkout.session.completed',
        'data' => ['object' => ['id' => 'cs_test_webhook', 'payment_intent' => 'pi_123']],
    ], 'whsec_test');

    $headers = ['HTTP_Stripe-Signature' => $signature, 'CONTENT_TYPE' => 'application/json'];

    $this->call('POST', route('stripe.webhook'), [], [], [], $headers, $body)->assertOk();
    $paidAt = $order->refresh()->paid_at;

    $this->call('POST', route('stripe.webhook'), [], [], [], $headers, $body)->assertOk();
    expect($order->refresh()->paid_at->equalTo($paidAt))->toBeTrue();
});

test('checkout.session.expired marks a still-unpaid order as failed', function () {
    config(['services.stripe.webhook_secret' => 'whsec_test']);
    $order = unpaidStripeOrder();

    [$body, $signature] = signedStripeRequest([
        'id' => 'evt_2',
        'type' => 'checkout.session.expired',
        'data' => ['object' => ['id' => 'cs_test_webhook']],
    ], 'whsec_test');

    $response = $this->call('POST', route('stripe.webhook'), [], [], [], [
        'HTTP_Stripe-Signature' => $signature,
        'CONTENT_TYPE' => 'application/json',
    ], $body);

    $response->assertOk();
    expect($order->refresh()->payment_status)->toBe(PaymentStatus::Failed);
});

test('a request with an invalid signature is rejected', function () {
    config(['services.stripe.webhook_secret' => 'whsec_test']);
    unpaidStripeOrder();

    $body = json_encode([
        'id' => 'evt_3',
        'type' => 'checkout.session.completed',
        'data' => ['object' => ['id' => 'cs_test_webhook']],
    ]);

    $response = $this->call('POST', route('stripe.webhook'), [], [], [], [
        'HTTP_Stripe-Signature' => 't='.time().',v1=deadbeef',
        'CONTENT_TYPE' => 'application/json',
    ], $body);

    $response->assertStatus(400);
});
