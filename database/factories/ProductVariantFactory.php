<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'sku' => $this->faker->unique()->bothify('SKU-###'),
            'options' => [
                'color' => $this->faker->colorName(),
                'size' => $this->faker->randomElement(['S', 'M', 'L', 'XL']),
            ],
            'price' => $this->faker->optional()->randomFloat(2, 10, 200),
            'stock' => $this->faker->numberBetween(0, 50),
            'is_active' => true,
        ];
    }
}
