<?php

use App\Enums\OrderStatus;
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
    assertHasManyResolvesCorrectOwner(User::class, Address::class, 'user_id', 'addresses');
});

test('orders relationship returns only the owning user orders', function () {
    assertHasManyResolvesCorrectOwner(User::class, Order::class, 'user_id', 'orders');
});

test('cart creates a new cart order when none exists', function () {
    $user = User::factory()->create();

    expect(Order::where('user_id', $user->id)->where('status', OrderStatus::Cart)->count())->toBe(0);

    $cart = $user->cart();

    expect($cart)->toBeInstanceOf(Order::class)
        ->and($cart->user_id)->toBe($user->id)
        ->and($cart->status)->toBe(OrderStatus::Cart);
});

test('cart returns the existing cart order instead of creating a duplicate', function () {
    $user = User::factory()->create();
    $existingCart = Order::factory()->create(['user_id' => $user->id, 'status' => OrderStatus::Cart]);

    $cart = $user->cart();

    expect($cart->id)->toBe($existingCart->id)
        ->and(Order::where('user_id', $user->id)->where('status', OrderStatus::Cart)->count())->toBe(1);
});

test('cart only considers the owning users orders', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherCart = Order::factory()->create(['user_id' => $otherUser->id, 'status' => OrderStatus::Cart]);

    $cart = $user->cart();

    expect($cart->id)->not->toBe($otherCart->id)
        ->and($cart->user_id)->toBe($user->id);
});

test('cart ignores non-cart orders belonging to the user', function () {
    $user = User::factory()->create();
    $completedOrder = Order::factory()->create(['user_id' => $user->id, 'status' => OrderStatus::Completed]);

    $cart = $user->cart();

    expect($cart->id)->not->toBe($completedOrder->id)
        ->and($cart->status)->toBe(OrderStatus::Cart);
});
