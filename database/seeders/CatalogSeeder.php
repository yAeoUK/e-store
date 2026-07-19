<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::factory()
            ->count(6)
            ->create()
            ->each(function (Category $category): void {
                Category::factory()->count(2)->create([
                    'parent_id' => $category->id,
                ]);
            });

        $products = Product::factory()
            ->count(15)
            ->create();

        foreach ($products as $product) {
            ProductImage::factory()->count(3)->create([
                'product_id' => $product->id,
            ]);

            ProductVariant::factory()->count(2)->create([
                'product_id' => $product->id,
            ]);
        }
    }
}
