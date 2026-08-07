<?php

namespace App\Support\Validation;

use Illuminate\Validation\Rules\Password;

class PasswordRules
{
    /**
     * @return array<mixed>
     */
    public static function defaults(): array
    {
        return ['required', 'confirmed', Password::defaults()];
    }
}
