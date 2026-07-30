<?php

test('defaults to system appearance when no cookie is present', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertDontSee('class="dark"', false);
    $response->assertSee("const appearance = 'system';", false);
});

test('a request with the dark appearance cookie renders the dark html class', function () {
    $response = $this->withUnencryptedCookie('appearance', 'dark')->get(route('home'));

    $response->assertOk();
    $response->assertSee('class="dark"', false);
    $response->assertSee("const appearance = 'dark';", false);
});

test('a request with the light appearance cookie does not render the dark html class', function () {
    $response = $this->withUnencryptedCookie('appearance', 'light')->get(route('home'));

    $response->assertOk();
    $response->assertDontSee('class="dark"', false);
    $response->assertSee("const appearance = 'light';", false);
});
