<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SharedRules;
use Illuminate\Foundation\Http\FormRequest;

abstract class NameSlugRequest extends FormRequest
{
    use SharedRules;

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return $this->commonRules() + $this->nameAndSlugRules(sometimes: $this->isPartialUpdate());
    }

    /**
     * @return array<string, array<mixed>>
     */
    abstract protected function commonRules(): array;

    /**
     * @return array<string, array<mixed>>
     */
    private function nameAndSlugRules(bool $sometimes): array
    {
        return [
            'name' => $this->withSometimes(['required', 'string', 'max:255'], $sometimes),
            'slug' => $this->withSometimes(['nullable', 'string', 'max:255'], $sometimes),
        ];
    }
}
