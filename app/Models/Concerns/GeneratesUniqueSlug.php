<?php

namespace App\Models\Concerns;

interface GeneratesUniqueSlug
{
    public static function generateUniqueSlug(string $source, ?int $ignoreId = null): string;
}
