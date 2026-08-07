<?php

namespace App\Http\Controllers\Concerns;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait FiltersIndexRequests
{
    /**
     * Apply a "search" filter if present, trimming it before handing it to the callback.
     *
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  Builder<TModel>  $query
     */
    protected function applySearchFilter(Builder $query, Request $request, Closure $callback): void
    {
        if (! $request->filled('search')) {
            return;
        }

        $search = $request->string('search')->trim();

        $query->where(fn ($q) => $callback($q, $search));
    }

    /**
     * Build a "filters" array echoing back the given request keys, or null when absent.
     *
     * @param  array<string, 'string'|'integer'>  $keys
     * @return array<string, string|int|null>
     */
    protected function requestFilters(Request $request, array $keys): array
    {
        $filters = [];

        foreach ($keys as $key => $type) {
            $filters[$key] = match ($type) {
                'integer' => $request->integer($key) ?: null,
                default => $request->string($key)->value() ?: null,
            };
        }

        return $filters;
    }
}
