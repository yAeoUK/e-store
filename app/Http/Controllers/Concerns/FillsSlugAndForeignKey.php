<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Concerns\GeneratesUniqueSlug;
use Illuminate\Database\Eloquent\Model;

trait FillsSlugAndForeignKey
{
    /**
     * Pull the foreign key and a generated slug out of validated create data.
     *
     * @param  array<string, mixed>  $data
     * @param  class-string<Model&GeneratesUniqueSlug>  $modelClass
     * @return array{0: mixed, 1: string}
     */
    protected function extractSlugAndForeignKey(array &$data, string $foreignKey, string $modelClass): array
    {
        $foreignKeyValue = $data[$foreignKey] ?? null;
        $slug = $modelClass::generateUniqueSlug((string) (($data['slug'] ?? '') ?: $data['name']));
        unset($data[$foreignKey], $data['slug']);

        return [$foreignKeyValue, $slug];
    }

    /**
     * Apply the foreign key and regenerate the slug (if present) on an existing model.
     *
     * @param  array<string, mixed>  $data
     */
    protected function applySlugAndForeignKey(Model&GeneratesUniqueSlug $model, array &$data, string $foreignKey): void
    {
        if (array_key_exists($foreignKey, $data)) {
            $model->setAttribute($foreignKey, $data[$foreignKey]);
            unset($data[$foreignKey]);
        }

        if (array_key_exists('slug', $data)) {
            $source = (string) ($data['slug'] ?: ($data['name'] ?? $model->getAttribute('name')));
            $model->setAttribute('slug', $model::generateUniqueSlug($source, $model->getKey()));
            unset($data['slug']);
        }
    }
}
