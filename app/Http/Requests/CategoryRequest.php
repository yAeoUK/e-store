<?php

namespace App\Http\Requests;

abstract class CategoryRequest extends NameSlugRequest
{
    /**
     * @return array<string, array<mixed>>
     */
    protected function commonRules(): array
    {
        return [
            'parent_id' => ['nullable', 'exists:categories,id'],
            'description' => $this->descriptionRule(),
        ];
    }
}
