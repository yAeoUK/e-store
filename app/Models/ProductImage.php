<?php

namespace App\Models;

use App\Models\Concerns\HasExclusiveFlag;
use Database\Factories\ProductImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductImage extends Model
{
    /** @use HasFactory<ProductImageFactory> */
    use HasExclusiveFlag, HasFactory, SoftDeletes;

    protected $fillable = [
        'url',
        'alt_text',
        'sort_order',
        'is_primary',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_primary' => 'boolean',
    ];

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Make this the product's one and only primary image.
     */
    public function makePrimary(): void
    {
        $this->makeExclusive('is_primary', 'product_id');
    }
}
