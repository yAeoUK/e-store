<?php

namespace App\Http\Requests\Admin;

class StoreProductVariantRequest extends ProductVariantRequest
{
    /**
     * @return array<string, array<mixed>>
     */
    protected function skuRules(): array
    {
        return [
            'sku' => ['required', 'string', 'max:255', 'unique:product_variants,sku'],
        ];
    }
}
