<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Carbon\CarbonInterface;

test('user relationship returns the owning user', function () {
    assertBelongsToResolvesCorrectOwner(User::class, Order::class, 'user_id', 'user');
});

test('orderItems relationship returns the related order items', function () {
    assertHasManyResolvesCorrectOwner(Order::class, OrderItem::class, 'order_id', 'orderItems');
});

test('order attributes are cast correctly', function () {
    $order = Order::factory()->create([
        'status' => 'completed',
        'total' => 49.5,
        'payment_method' => 'stripe',
        'payment_status' => 'paid',
        'paid_at' => '2026-01-15 10:00:00',
    ]);

    $fresh = Order::find($order->id);

    expect($fresh->status)->toBe(OrderStatus::Completed)
        ->and($fresh->total)->toBe('49.50')
        ->and($fresh->payment_method)->toBe(PaymentMethod::Stripe)
        ->and($fresh->payment_status)->toBe(PaymentStatus::Paid)
        ->and($fresh->paid_at)->toBeInstanceOf(CarbonInterface::class);
});

test('shipping_address_snapshot is cast to an array', function () {
    $order = Order::factory()->create();
    $order->forceFill([
        'shipping_address_snapshot' => ['city' => 'Cairo', 'country' => 'EG'],
    ])->save();

    $fresh = Order::find($order->id);

    expect($fresh->shipping_address_snapshot)->toBe(['city' => 'Cairo', 'country' => 'EG']);
});

test('admin_note and customer_note are fillable', function () {
    $order = Order::factory()->create([
        'admin_note' => 'Called customer to confirm address',
        'customer_note' => 'Please leave at the front door',
    ]);

    $fresh = Order::find($order->id);

    expect($fresh->admin_note)->toBe('Called customer to confirm address')
        ->and($fresh->customer_note)->toBe('Please leave at the front door');
});

test('markAsPaid marks the order paid and processing', function () {
    $order = Order::factory()->create([
        'status' => OrderStatus::Pending,
        'payment_status' => PaymentStatus::Unpaid,
        'stripe_payment_intent_id' => null,
    ]);

    $order->markAsPaid('pi_123');

    expect($order->payment_status)->toBe(PaymentStatus::Paid)
        ->and($order->status)->toBe(OrderStatus::Processing)
        ->and($order->stripe_payment_intent_id)->toBe('pi_123')
        ->and($order->paid_at)->toBeInstanceOf(CarbonInterface::class);
});

test('markAsPaid keeps the existing payment intent when none is given', function () {
    $order = Order::factory()->create([
        'status' => OrderStatus::Pending,
        'payment_status' => PaymentStatus::Unpaid,
        'stripe_payment_intent_id' => 'pi_existing',
    ]);

    $order->markAsPaid();

    expect($order->stripe_payment_intent_id)->toBe('pi_existing');
});

test('markAsPaid is a no-op when the order is already paid', function () {
    $paidAt = now()->subDay()->startOfSecond();
    $order = Order::factory()->create([
        'status' => OrderStatus::Completed,
        'payment_status' => PaymentStatus::Paid,
        'stripe_payment_intent_id' => 'pi_original',
        'paid_at' => $paidAt,
    ]);

    $order->markAsPaid('pi_new');

    expect($order->status)->toBe(OrderStatus::Completed)
        ->and($order->stripe_payment_intent_id)->toBe('pi_original')
        ->and($order->paid_at->equalTo($paidAt))->toBeTrue();
});

test('loadCartItemsForDisplay eager loads order items with product and variant details', function () {
    $order = Order::factory()->create();
    OrderItem::factory()->create(['order_id' => $order->id]);

    $order->loadCartItemsForDisplay();

    expect($order->relationLoaded('orderItems'))->toBeTrue()
        ->and($order->orderItems->first()->relationLoaded('product'))->toBeTrue()
        ->and($order->orderItems->first()->relationLoaded('productVariant'))->toBeTrue();
});
