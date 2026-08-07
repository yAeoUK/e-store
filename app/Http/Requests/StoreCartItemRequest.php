<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SharedRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreCartItemRequest extends FormRequest
{
    use SharedRules;

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'product_variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'quantity' => $this->quantityRule(),
        ];
    }
}
