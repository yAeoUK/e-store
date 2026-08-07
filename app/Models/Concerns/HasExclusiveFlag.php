<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\DB;

trait HasExclusiveFlag
{
    /**
     * Make this the sole holder of $column among siblings sharing $scopeColumn.
     */
    protected function makeExclusive(string $column, string $scopeColumn): void
    {
        DB::transaction(function () use ($column, $scopeColumn): void {
            static::where($scopeColumn, $this->{$scopeColumn})
                ->where('id', '!=', $this->id)
                ->update([$column => false]);

            $this->update([$column => true]);
        });
    }
}
