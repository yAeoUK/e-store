<?php

use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Hash;

test('password is hashed when set', function () {
    $user = User::factory()->create(['password' => 'plain-text-password']);

    expect($user->password)->not->toBe('plain-text-password')
        ->and(Hash::check('plain-text-password', $user->password))->toBeTrue();
});

test('email_verified_at is cast to a datetime', function () {
    $user = User::factory()->create();

    expect($user->email_verified_at)->toBeInstanceOf(CarbonInterface::class);
});

test('addresses relationship returns only the owning user addresses', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $address = Address::factory()->create(['user_id' => $user->id]);
    Address::factory()->create(['user_id' => $otherUser->id]);

    expect($user->addresses)->toHaveCount(1)
        ->and($user->addresses->first()->id)->toBe($address->id);
});

test('orders relationship returns only the owning user orders', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $order = Order::factory()->create(['user_id' => $user->id]);
    Order::factory()->create(['user_id' => $otherUser->id]);

    expect($user->orders)->toHaveCount(1)
        ->and($user->orders->first()->id)->toBe($order->id);
});
