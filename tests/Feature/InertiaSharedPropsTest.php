<?php

use App\Models\User;

test('guests are shared a null auth user', function () {
    $response = $this->withHeaders(inertiaHeaders())->get(route('home'));

    $response->assertOk();
    $response->assertJsonPath('props.auth.user', null);
});

test('authenticated non-admins are shared is_admin as false', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->withHeaders(inertiaHeaders())->get(route('home'));

    $response->assertOk();
    $response->assertJsonPath('props.auth.user.is_admin', false);
});

test('authenticated admins are shared is_admin as true', function () {
    $admin = actingAsAdmin();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('home'));

    $response->assertOk();
    $response->assertJsonPath('props.auth.user.is_admin', true);
});

test('the app name is shared as a prop', function () {
    $response = $this->withHeaders(inertiaHeaders())->get(route('home'));

    $response->assertOk();
    $response->assertJsonPath('props.name', config('app.name'));
});

test('the sidebar defaults to open when no cookie is present', function () {
    $response = $this->withHeaders(inertiaHeaders())->get(route('home'));

    $response->assertOk();
    $response->assertJsonPath('props.sidebarOpen', true);
});

test('the sidebar is closed when the sidebar_state cookie is false', function () {
    $response = $this->withUnencryptedCookie('sidebar_state', 'false')->withHeaders(inertiaHeaders())->get(route('home'));

    $response->assertOk();
    $response->assertJsonPath('props.sidebarOpen', false);
});

test('the sidebar is open when the sidebar_state cookie is true', function () {
    $response = $this->withUnencryptedCookie('sidebar_state', 'true')->withHeaders(inertiaHeaders())->get(route('home'));

    $response->assertOk();
    $response->assertJsonPath('props.sidebarOpen', true);
});
