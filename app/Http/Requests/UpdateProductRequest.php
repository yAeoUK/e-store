<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($this->route('product'))],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
