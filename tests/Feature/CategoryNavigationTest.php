<?php

use App\Models\Category;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('products index shares categories for navigation', function () {
    $parentCategory = Category::factory()->create(['name' => 'Parent Category']);
    $childCategory = Category::factory()->create([
        'name' => 'Child Category',
        'parent_id' => $parentCategory->id,
    ]);

    Product::factory()->create(['category_id' => $parentCategory->id]);

    $response = $this->get(route('products.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Products/Index')
        ->has('categories', 1)
        ->where('categories.0.name', $parentCategory->name)
        ->where('categories.0.children.0.name', $childCategory->name)
    );
});

test('category show page shares categories for navigation', function () {
    $parentCategory = Category::factory()->create(['name' => 'Parent Category']);
    $childCategory = Category::factory()->create([
        'name' => 'Child Category',
        'parent_id' => $parentCategory->id,
    ]);

    $response = $this->get(route('categories.show', $parentCategory));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Categories/Show')
        ->has('categories', 1)
        ->where('categories.0.name', $parentCategory->name)
        ->where('categories.0.children.0.name', $childCategory->name)
    );
});
