<?php

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;

test('user can list their own orders', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id, 'status' => OrderStatus::Completed]);

    $response = $this->actingAs($user)->withHeaders(inertiaHeaders())->get(route('account.orders'));

    $response->assertOk();
    $response->assertJsonPath('component', 'Account/Orders');
    $response->assertJsonCount(1, 'props.orders.data');
    $response->assertJsonPath('props.orders.data.0.id', $order->id);
});

test('account orders index only shows the authenticated users orders', function () {
    $user = User::factory()->create();
    Order::factory()->create(['user_id' => $user->id, 'status' => OrderStatus::Completed]);

    $otherUser = User::factory()->create();
    Order::factory()->create(['user_id' => $otherUser->id, 'status' => OrderStatus::Completed]);

    $response = $this->actingAs($user)->withHeaders(inertiaHeaders())->get(route('account.orders'));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.orders.data');
});

test('account orders index excludes the users cart', function () {
    $user = User::factory()->create();
    $user->cart();
    Order::factory()->create(['user_id' => $user->id, 'status' => OrderStatus::Completed]);

    $response = $this->actingAs($user)->withHeaders(inertiaHeaders())->get(route('account.orders'));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.orders.data');
});

test('account orders index paginates results instead of loading them all at once', function () {
    $user = User::factory()->create();

    assertIndexPaginates(
        'account.orders',
        'orders',
        fn () => Order::factory()->count(15)->create(['user_id' => $user->id, 'status' => OrderStatus::Completed]),
        expectedTotal: 15,
        actingAs: fn () => $user,
        perPage: 10,
    );
});

test('account orders index orders results by most recent first', function () {
    $user = User::factory()->create();
    $older = Order::factory()->create(['user_id' => $user->id, 'status' => OrderStatus::Completed, 'created_at' => now()->subDay()]);
    $newer = Order::factory()->create(['user_id' => $user->id, 'status' => OrderStatus::Completed, 'created_at' => now()]);

    $response = $this->actingAs($user)->withHeaders(inertiaHeaders())->get(route('account.orders'));

    $response->assertOk();
    $response->assertJsonPath('props.orders.data.0.id', $newer->id);
    $response->assertJsonPath('props.orders.data.1.id', $older->id);
});

test('guests cannot list account orders', function () {
    assertGuestCannotAccessResource('get', route('account.orders'));
});

test('user can view their own order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id, 'status' => OrderStatus::Completed]);

    $response = $this->actingAs($user)->withHeaders(inertiaHeaders())->get(route('account.orders.show', $order));

    $response->assertOk();
    $response->assertJsonPath('component', 'Account/Orders/Show');
    $response->assertJsonPath('props.order.id', $order->id);
});

test('viewing another users order is forbidden', function () {
    $owner = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $owner->id, 'status' => OrderStatus::Completed]);

    assertForeignUserCannotAccessResource('get', route('account.orders.show', $order), $order);
});

test('viewing a cart as an order is not found', function () {
    $user = User::factory()->create();
    $cart = $user->cart();

    $this->actingAs($user)->get(route('account.orders.show', $cart))->assertNotFound();
});

test('guests cannot view an account order', function () {
    $order = Order::factory()->create(['status' => OrderStatus::Completed]);

    assertGuestCannotAccessResource('get', route('account.orders.show', $order));
});
