<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\SharedRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

abstract class ProductVariantRequest extends FormRequest
{
    use SharedRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->skuRules() + $this->commonRules();
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    abstract protected function skuRules(): array;

    /**
     * @return array<string, array<mixed>>
     */
    protected function commonRules(): array
    {
        return [
            'options' => ['nullable', 'array'],
            'price' => ['nullable', 'numeric', 'min:0'],
        ] + $this->activeAndStockRules();
    }
}
