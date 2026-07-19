<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name' => $this->faker->unique()->words(3, true),
            'slug' => $this->faker->unique()->slug(),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'short_description' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'is_active' => true,
            'stock' => $this->faker->numberBetween(0, 100),
            'metadata' => [
                'brand' => $this->faker->company(),
                'color' => $this->faker->colorName(),
            ],
        ];
    }
}
