<?php

namespace App\Http\Requests\Admin;

class UpdateProductVariantRequest extends ProductVariantRequest
{
    /**
     * @return array<string, array<mixed>>
     */
    protected function skuRules(): array
    {
        return [
            'sku' => $this->withSometimes(['required', 'string', 'max:255', $this->uniqueIgnoring('product_variants', $this->route('variant'), 'sku')], sometimes: true),
        ];
    }
}
