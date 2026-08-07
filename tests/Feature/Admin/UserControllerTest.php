<?php

use App\Models\User;

test('admin can list and search users', function () {
    User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
    User::factory()->create(['name' => 'John Roe', 'email' => 'john@example.com']);

    $response = assertAdminIndexRenders('admin.users.index', 'Admin/Users/Index', 'users', 1, ['search' => 'Jane']);

    $response->assertJsonPath('props.users.data.0.name', 'Jane Doe');
});

test('admin users index paginates results instead of loading them all at once', function () {
    assertIndexPaginates('admin.users.index', 'users', fn () => User::factory()->count(20)->create(), expectedTotal: 21);
});

test('admin can search users by email', function () {
    User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
    User::factory()->create(['name' => 'John Roe', 'email' => 'john@example.com']);

    assertAdminIndexFiltersBy('admin.users.index', 'users', ['search' => 'jane@'], 'name', 'Jane Doe');
});

test('non-admin cannot view the users list', function () {
    assertNonAdminCannotView('admin.users.index');
});
