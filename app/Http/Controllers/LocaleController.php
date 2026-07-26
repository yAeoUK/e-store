<?php

namespace App\Http\Controllers;

use Illuminate\Cookie\CookieJar;
use Illuminate\Http\RedirectResponse;

class LocaleController extends Controller
{
    /**
     * Persist the visitor's chosen locale in a cookie and redirect back.
     */
    public function __invoke(string $locale, CookieJar $cookies): RedirectResponse
    {
        abort_unless(in_array($locale, config('app.available_locales'), true), 404);

        $cookies->queue('locale', $locale, 60 * 24 * 365);

        return back();
    }
}
