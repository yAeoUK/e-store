<?php

use App\Http\Controllers\Admin\AdminController;
use App\Models\User;
use Illuminate\Http\Request;

test('admin can list current admins', function () {
    User::factory()->create(); // a non-admin, should not appear

    assertAdminIndexRenders('admin.admins.index', 'Admin/Admins/Index', 'admins', 1);
});

test('admin admins index paginates results instead of loading them all at once', function () {
    assertIndexPaginates(
        'admin.admins.index',
        'admins',
        fn () => User::factory()->count(19)->create()->each(fn (User $user) => $user->assignRole('admin'))
    );
});

test('non-admin cannot list admins', function () {
    assertNonAdminCannotView('admin.admins.index');
});

test('admin can render the create admin page', function () {
    $admin = actingAsAdmin();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.admins.create'));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Admins/Create');
});

test('non-admin cannot view the create admin page', function () {
    assertNonAdminForbidden('get', route('admin.admins.create'));
});

test('admin can promote an existing user to admin by email', function () {
    $admin = actingAsAdmin();
    $target = User::factory()->create(['email' => 'promote-me@example.com']);

    $response = $this->actingAs($admin)->post(route('admin.admins.promote'), [
        'email' => 'promote-me@example.com',
    ]);

    $response->assertRedirect(route('admin.admins.index'));
    expect($target->fresh()->hasRole('admin'))->toBeTrue();
});

test('promoting a nonexistent email fails validation', function () {
    $admin = actingAsAdmin();

    $response = $this->actingAs($admin)->post(route('admin.admins.promote'), [
        'email' => 'nobody@example.com',
    ]);

    $response->assertSessionHasErrors('email');
});

test('admin can create a brand-new admin account', function () {
    $admin = actingAsAdmin();

    $response = $this->actingAs($admin)->post(route('admin.admins.store'), [
        'name' => 'Brand New Admin',
        'email' => 'brand-new-admin@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertRedirect(route('admin.admins.index'));

    $newAdmin = User::where('email', 'brand-new-admin@example.com')->first();
    expect($newAdmin)->not->toBeNull();
    expect($newAdmin->hasRole('admin'))->toBeTrue();
});

test('admin can revoke another admins access', function () {
    $admin = actingAsAdmin();
    $otherAdmin = makeAdmin();

    $response = $this->actingAs($admin)->delete(route('admin.admins.revoke', $otherAdmin));

    $response->assertRedirect(route('admin.admins.index'));
    $response->assertSessionDoesntHaveErrors();
    expect($otherAdmin->fresh()->hasRole('admin'))->toBeFalse();
});

test('admin cannot revoke their own access', function () {
    $admin = actingAsAdmin();
    makeAdmin();

    $response = $this->actingAs($admin)->delete(route('admin.admins.revoke', $admin));

    $response->assertRedirect(route('admin.admins.index'));
    $response->assertSessionHasErrors('admin');
    expect($admin->fresh()->hasRole('admin'))->toBeTrue();
});

// The self-revoke guard above already makes it impossible to bring the admin
// count to zero via the real HTTP route: the `admin` middleware requires the
// caller to be an admin themselves, so if only one admin exists, that admin
// IS the caller, and the self-revoke check catches it first. The count<=1
// guard is defense-in-depth for that same "don't reach zero admins" goal
// (e.g. protects against a future change to the self-revoke rule), so it's
// verified directly against the controller here rather than through routing.
test('the last remaining admin cannot be revoked, even by a caller other than themselves', function () {
    $onlyAdmin = actingAsAdmin();
    $caller = User::factory()->create();

    $request = Request::create('/');
    $request->setUserResolver(fn () => $caller);

    $response = (new AdminController)->revoke($request, $onlyAdmin);

    expect($response->getTargetUrl())->toBe(route('admin.admins.index'));
    expect(session('errors')->get('admin'))->not->toBeEmpty();
    expect($onlyAdmin->fresh()->hasRole('admin'))->toBeTrue();
});

test('non-admin cannot revoke admins', function () {
    $admin = actingAsAdmin();

    assertNonAdminForbidden('delete', route('admin.admins.revoke', $admin));

    expect($admin->fresh()->hasRole('admin'))->toBeTrue();
});

test('non-admin cannot promote or create admins', function () {
    $target = User::factory()->create(['email' => 'target@example.com']);

    assertNonAdminForbidden('post', route('admin.admins.promote'), ['email' => 'target@example.com']);
    assertNonAdminForbidden('post', route('admin.admins.store'), [
        'name' => 'X',
        'email' => 'x@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    expect($target->fresh()->hasRole('admin'))->toBeFalse();
    $this->assertDatabaseMissing('users', ['email' => 'x@example.com']);
});
