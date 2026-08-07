<?php

namespace App\Http\Requests\Concerns;

use App\Support\Validation\PasswordRules;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

trait SharedRules
{
    /**
     * @return array<string, array<mixed>>
     */
    protected function nameEmailPasswordRules(bool $includePassword = true, Unique|string|null $emailUnique = null): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', $emailUnique ?? 'unique:users,email'],
        ];

        if ($includePassword) {
            $rules['password'] = PasswordRules::defaults();
        }

        return $rules;
    }

    /**
     * @param  array<mixed>  $rules
     * @return array<mixed>
     */
    protected function withSometimes(array $rules, bool $sometimes): array
    {
        return $sometimes ? ['sometimes', ...$rules] : $rules;
    }

    /**
     * @return array<string, array<mixed>>
     */
    protected function activeAndStockRules(): array
    {
        return [
            'is_active' => ['boolean'],
            'stock' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<mixed>
     */
    protected function quantityRule(): array
    {
        return ['required', 'integer', 'min:1'];
    }

    /**
     * @return array<mixed>
     */
    protected function descriptionRule(): array
    {
        return ['nullable', 'string'];
    }

    protected function isPartialUpdate(): bool
    {
        return false;
    }

    protected function uniqueIgnoring(string $table, mixed $ignore, string $column = 'NULL'): Unique
    {
        return Rule::unique($table, $column)->ignore($ignore);
    }
}
