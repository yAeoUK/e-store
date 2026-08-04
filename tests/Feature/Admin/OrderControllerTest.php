<?php

use App\Models\Order;
use App\Models\User;

test('admin can list orders with the customer eager-loaded', function () {
    $admin = actingAsAdmin();
    $customer = User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
    Order::factory()->create(['user_id' => $customer->id]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.orders.index'));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Orders/Index');
    $response->assertJsonCount(1, 'props.orders.data');
    $response->assertJsonPath('props.orders.data.0.user.name', 'Jane Doe');
});

test('admin orders index paginates results instead of loading them all at once', function () {
    $admin = actingAsAdmin();
    Order::factory()->count(20)->create();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.orders.index'));

    $response->assertOk();
    $response->assertJsonCount(15, 'props.orders.data');
    $response->assertJsonPath('props.orders.total', 20);
    $response->assertJsonPath('props.orders.per_page', 15);
});

test('admin can filter orders by user_id', function () {
    $admin = actingAsAdmin();
    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();
    Order::factory()->create(['user_id' => $customer->id]);
    Order::factory()->create(['user_id' => $otherCustomer->id]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route('admin.orders.index', ['user_id' => $customer->id]));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.orders.data');
    $response->assertJsonPath('props.orders.data.0.user_id', $customer->id);
});

test('admin can search orders by customer name or email', function () {
    $admin = actingAsAdmin();
    $customer = User::factory()->create(['name' => 'Searchable Customer']);
    Order::factory()->create(['user_id' => $customer->id]);
    Order::factory()->create(['user_id' => User::factory()->create(['name' => 'Someone Else'])->id]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route('admin.orders.index', ['search' => 'Searchable']));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.orders.data');
});

test('admin can search orders by customer email', function () {
    $admin = actingAsAdmin();
    $customer = User::factory()->create(['email' => 'searchable@example.com']);
    Order::factory()->create(['user_id' => $customer->id]);
    Order::factory()->create(['user_id' => User::factory()->create(['email' => 'someoneelse@example.com'])->id]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route('admin.orders.index', ['search' => 'searchable@']));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.orders.data');
    $response->assertJsonPath('props.orders.data.0.user_id', $customer->id);
});

test('non-admin cannot list orders', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.orders.index'))->assertForbidden();
});

test('guests cannot list orders', function () {
    $this->get(route('admin.orders.index'))->assertRedirect(route('login'));
});

test('admin orders index excludes carts', function () {
    $admin = actingAsAdmin();
    $customer = User::factory()->create();
    $customer->cart();
    Order::factory()->create(['user_id' => $customer->id]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.orders.index'));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.orders.data');
});
