<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_variant_id' => null,
            'quantity' => $this->faker->numberBetween(1, 5),
            'unit_price' => function (array $attributes) {
                $variant = ! empty($attributes['product_variant_id'])
                    ? ProductVariant::query()->find((int) $attributes['product_variant_id'])
                    : null;
                $product = Product::query()->find((int) $attributes['product_id']);

                return $variant?->price ?? $product?->price ?? $this->faker->randomFloat(2, 10, 500);
            },
            'product_snapshot' => function (array $attributes) {
                $product = Product::query()->find((int) $attributes['product_id']);

                if (! $product) {
                    return null;
                }

                $variant = ! empty($attributes['product_variant_id'])
                    ? ProductVariant::query()->find((int) $attributes['product_variant_id'])
                    : null;

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
            },
        ];
    }
}
