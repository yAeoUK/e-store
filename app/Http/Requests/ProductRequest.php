<?php

namespace App\Http\Requests;

abstract class ProductRequest extends NameSlugRequest
{
    /**
     * @return array<string, array<mixed>>
     */
    protected function commonRules(): array
    {
        $sometimes = $this->isPartialUpdate();

        return [
            'category_id' => ['nullable', 'exists:categories,id'],
            'price' => $this->withSometimes(['required', 'numeric', 'min:0'], $sometimes),
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => $this->descriptionRule(),
            'metadata' => ['nullable', 'array'],
        ] + $this->activeAndStockRules();
    }
}
