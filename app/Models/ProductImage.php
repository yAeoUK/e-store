<?php

namespace App\Models;

use Database\Factories\ProductImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class ProductImage extends Model
{
    /** @use HasFactory<ProductImageFactory> */
    use HasFactory, SoftDeletes;

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
        DB::transaction(function (): void {
            static::where('product_id', $this->product_id)
                ->where('id', '!=', $this->id)
                ->update(['is_primary' => false]);

            $this->update(['is_primary' => true]);
        });
    }
}
