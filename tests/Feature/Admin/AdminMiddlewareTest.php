<?php

use App\Models\User;

dataset('admin_routes', [
    'admin.dashboard',
    'admin.products.index',
    'admin.products.create',
    'admin.categories.index',
    'admin.categories.create',
    'admin.users.index',
    'admin.orders.index',
    'admin.admins.index',
    'admin.admins.create',
]);

test('guests are redirected to login from admin routes', function (string $routeName) {
    $response = $this->get(route($routeName));

    $response->assertRedirect(route('login'));
})->with('admin_routes');

test('non-admin users are forbidden from admin routes', function (string $routeName) {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route($routeName));

    $response->assertForbidden();
})->with('admin_routes');

test('admins can access admin routes', function (string $routeName) {
    $admin = actingAsAdmin();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route($routeName));

    $response->assertOk();
})->with('admin_routes');

test('admin routes render as a full page load, not just an Inertia JSON response', function (string $routeName) {
    $admin = actingAsAdmin();

    $response = $this->actingAs($admin)->get(route($routeName));

    $response->assertOk();
    $response->assertSee('id="app"', false);
})->with('admin_routes');
