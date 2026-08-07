<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;

trait GuardsRelatedDeletes
{
    /**
     * Block deletion and redirect back with an error if any of the given relations exist.
     *
     * @param  array<int, string>  $relations
     */
    protected function preventDeleteIfRelated(Model $model, array $relations, string $indexRoute, string $errorField, string $errorMessageKey): ?RedirectResponse
    {
        foreach ($relations as $relation) {
            if ($model->{$relation}()->exists()) {
                return redirect()->route($indexRoute)->withErrors([
                    $errorField => __($errorMessageKey),
                ]);
            }
        }

        return null;
    }
}
