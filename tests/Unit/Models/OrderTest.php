<?php

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;

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

test('order attributes are cast correctly', function () {
    $order = Order::factory()->create([
        'status' => 'completed',
        'total' => 49.5,
    ]);

    $fresh = Order::find($order->id);

    expect($fresh->status)->toBe(OrderStatus::Completed)
        ->and($fresh->total)->toBe('49.50');
});
