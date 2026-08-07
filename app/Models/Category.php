<?php

namespace App\Models;

use App\Models\Concerns\GeneratesUniqueSlug;
use App\Models\Concerns\HasUniqueSlug;
use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model implements GeneratesUniqueSlug
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory, HasUniqueSlug;

    // `parent_id` and `slug` are deliberately excluded: parent_id is a
    // foreign key that must be set only after the FormRequest's `exists`
    // check has run, and slug must be set only via generateUniqueSlug() -
    // neither should ever be settable by passing a raw request array
    // straight into create()/update(), even by future accident.
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * @return BelongsTo<Category, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * @return HasMany<Category, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    /**
     * @return HasMany<Product, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
