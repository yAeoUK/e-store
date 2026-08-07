<?php

namespace App\Models;

use Database\Factories\OrderItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    /** @use HasFactory<OrderItemFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_variant_id',
        'product_snapshot',
        'quantity',
        'unit_price',
    ];

    protected $casts = [
        'product_snapshot' => 'array',
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo<ProductVariant, $this>
     */
    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    /**
     * @return numeric-string
     */
    public static function resolveUnitPrice(Product $product, ?ProductVariant $variant): string
    {
        return $variant->price ?? $product->price;
    }

    /**
     * @return array<string, mixed>
     */
    public static function buildProductSnapshot(Product $product, ?ProductVariant $variant): array
    {
        return [
            'name' => $product->name,
            'slug' => $product->slug,
            'image_url' => $product->images()->where('is_primary', true)->first()?->url,
            'category' => $product->category ? [
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ] : null,
            'variant' => $variant ? [
                'sku' => $variant->sku,
                'options' => $variant->options,
            ] : null,
        ];
    }
}
