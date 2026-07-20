<?php

use App\Models\Category;
use App\Models\Product;

test('category controller show returns the category page', function () {
    $category = Category::factory()->create(['name' => 'Home Appliances']);
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Coffee Maker',
        'is_active' => true,
    ]);
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Inactive Blender',
        'is_active' => false,
    ]);

    $response = $this->withHeaders(inertiaHeaders())->get(route('categories.show', ['category' => $category]));

    $response->assertOk();
    $response->assertJsonPath('component', 'Categories/Show');
    $response->assertJsonPath('props.category.name', 'Home Appliances');
    $response->assertJsonCount(1, 'props.products.data');
    $response->assertJsonPath('props.products.data.0.name', 'Coffee Maker');
});

test('category controller show filters products by search term', function () {
    $category = Category::factory()->create();
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Ergonomic Chair',
        'is_active' => true,
    ]);
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Standing Desk',
        'is_active' => true,
    ]);

    $response = $this->withHeaders(inertiaHeaders())->get(route('categories.show', ['category' => $category, 'search' => 'chair']));

    $response->assertOk();
    $response->assertJsonPath('props.filters.search', 'chair');
    $response->assertJsonCount(1, 'props.products.data');
    $response->assertJsonPath('props.products.data.0.name', 'Ergonomic Chair');
});

test('category controller show filters products by price range', function () {
    $category = Category::factory()->create();
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Budget Lamp',
        'price' => 25.00,
        'is_active' => true,
    ]);
    Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Premium Lamp',
        'price' => 60.00,
        'is_active' => true,
    ]);

    $response = $this->withHeaders(inertiaHeaders())->get(route('categories.show', ['category' => $category, 'min_price' => 20, 'max_price' => 30]));

    $response->assertOk();
    $response->assertJsonPath('props.filters.min_price', 20);
    $response->assertJsonPath('props.filters.max_price', 30);
    $response->assertJsonCount(1, 'props.products.data');
    $response->assertJsonPath('props.products.data.0.name', 'Budget Lamp');
});

test('category controller show includes top-level categories for navigation', function () {
    $parent = Category::factory()->create(['name' => 'Electronics']);
    $child = Category::factory()->create(['name' => 'Phones', 'parent_id' => $parent->id]);
    Category::factory()->create(['name' => 'Home Decor']);

    $response = $this->withHeaders(inertiaHeaders())->get(route('categories.show', ['category' => $child]));

    $response->assertOk();
    $response->assertJsonFragment(['name' => 'Electronics']);
    $response->assertJsonFragment(['name' => 'Home Decor']);
});
