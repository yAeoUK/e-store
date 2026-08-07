<?php

namespace App\Http\Requests;

class UpdateCategoryRequest extends CategoryRequest
{
    protected function isPartialUpdate(): bool
    {
        return true;
    }
}
