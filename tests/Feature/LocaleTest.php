<?php

test('defaults to english ltr when no locale cookie is present', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertSee('lang="en"', false);
    $response->assertSee('dir="ltr"', false);
});

test('switching to arabic sets the locale cookie and redirects back', function () {
    $response = $this->from(route('home'))->get(route('locale.update', 'ar'));

    $response->assertRedirect(route('home'));
    $response->assertCookie('locale', 'ar', encrypted: false);
});

test('a request with the arabic locale cookie renders arabic rtl', function () {
    $response = $this->withUnencryptedCookie('locale', 'ar')->get(route('home'));

    $response->assertOk();
    $response->assertSee('lang="ar"', false);
    $response->assertSee('dir="rtl"', false);
});

test('an unsupported locale is rejected', function () {
    $response = $this->get(route('locale.update', 'fr'));

    $response->assertNotFound();
});

test('validation errors are in english by default', function () {
    $response = $this->post('/register', []);

    $response->assertSessionHasErrors(['name']);
    expect(session('errors')->get('name')[0])->toBe('The name field is required.');
});

test('validation errors are localized to arabic with the locale cookie', function () {
    $response = $this->withUnencryptedCookie('locale', 'ar')->post('/register', []);

    $response->assertSessionHasErrors(['name']);
    expect(session('errors')->get('name')[0])->toBe('حقل الاسم مطلوب.');
});
