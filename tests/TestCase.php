<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Fortify\Features;

abstract class TestCase extends BaseTestCase
{
    protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }

    protected function skipUnlessPublicAuthEnabled(?string $message = null): void
    {
        if (! config('fortify.public_auth.enabled', true)) {
            $this->markTestSkipped($message ?? 'Public auth views are disabled.');
        }
    }
}
