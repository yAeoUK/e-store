<?php

namespace App\Http\Controllers\Concerns;

trait DefaultsNullableFieldsToZero
{
    /**
     * On create, a blank field arrives as null - default it to 0.
     *
     * @param  array<string, mixed>  $data
     */
    protected function defaultToZeroOnStore(array &$data, string $key): void
    {
        $data[$key] = $data[$key] ?? 0;
    }

    /**
     * On update, only default to 0 if the field was submitted and explicitly cleared,
     * as opposed to omitted from the request entirely.
     *
     * @param  array<string, mixed>  $data
     */
    protected function defaultToZeroOnUpdate(array &$data, string $key): void
    {
        if (array_key_exists($key, $data) && $data[$key] === null) {
            $data[$key] = 0;
        }
    }
}
