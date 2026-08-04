<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Carbon\CarbonInterface;

test('user relationship returns the owning user', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    // Unrelated data: another user with their own order, so the relation
    // must resolve via user_id and not just grab any user row.
    $otherUser = User::factory()->create();
    Order::factory()->create(['user_id' => $otherUser->id]);

    expect($order->user->id)->toBe($user->id)
        ->and($order->user->id)->not->toBe($otherUser->id);
});

test('orderItems relationship returns the related order items', function () {
    $order = Order::factory()->create();
    $item = OrderItem::factory()->create(['order_id' => $order->id]);

    // Unrelated data: another order with its own item, so the relation
    // must filter by order_id and not just return every order item.
    $otherOrder = Order::factory()->create();
    $otherItem = OrderItem::factory()->create(['order_id' => $otherOrder->id]);

    expect($order->orderItems)->toHaveCount(1)
        ->and($order->orderItems->first()->id)->toBe($item->id)
        ->and($order->orderItems->pluck('id'))->not->toContain($otherItem->id);
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
