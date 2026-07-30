<?php

use App\Models\User;

test('admin can list and search users', function () {
    $admin = actingAsAdmin();
    User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
    User::factory()->create(['name' => 'John Roe', 'email' => 'john@example.com']);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.users.index', ['search' => 'Jane']));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Users/Index');
    $response->assertJsonCount(1, 'props.users.data');
    $response->assertJsonPath('props.users.data.0.name', 'Jane Doe');
});

test('admin users index paginates results instead of loading them all at once', function () {
    $admin = actingAsAdmin();
    User::factory()->count(20)->create();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.users.index'));

    $response->assertOk();
    $response->assertJsonCount(15, 'props.users.data');
    $response->assertJsonPath('props.users.total', 21);
    $response->assertJsonPath('props.users.per_page', 15);
});

test('admin can search users by email', function () {
    $admin = actingAsAdmin();
    User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
    User::factory()->create(['name' => 'John Roe', 'email' => 'john@example.com']);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.users.index', ['search' => 'jane@']));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.users.data');
    $response->assertJsonPath('props.users.data.0.name', 'Jane Doe');
});

test('non-admin cannot view the users list', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.users.index'))->assertForbidden();
});
