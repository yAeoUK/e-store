<?php

namespace App\Http\Requests;

class UpdateProductRequest extends ProductRequest
{
    protected function isPartialUpdate(): bool
    {
        return true;
    }
}
