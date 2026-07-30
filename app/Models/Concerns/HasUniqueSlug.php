<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasUniqueSlug
{
    /**
     * Generate a slug from $source, appending a numeric suffix until it's unique.
     */
    public static function generateUniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source);
        $slug = $base;
        $attempt = 1;

        while (
            static::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$attempt}";
            $attempt++;
        }

        return $slug;
    }
}
