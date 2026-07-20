<?php

use App\Models\Category;
use App\Models\Product;

test('product controller index returns the product listing page', function () {
    $product = Product::factory()->create(['name' => 'Wireless Mouse', 'is_active' => true]);

    $response = $this->withHeaders(inertiaHeaders())->get(route('home'));

    $response->assertOk();
    $response->assertJsonPath('component', 'Products/Index');
    $response->assertJsonCount(1, 'props.products.data');
    $response->assertJsonPath('props.products.data.0.name', 'Wireless Mouse');
});

test('product controller index filters products by search term', function () {
    Product::factory()->create(['name' => 'Ergonomic Keyboard', 'is_active' => true]);
    Product::factory()->create(['name' => 'Mechanical Mouse', 'is_active' => true]);

    $response = $this->withHeaders(inertiaHeaders())->get(route('home', ['search' => 'keyboard']));

    $response->assertOk();
    $response->assertJsonPath('props.filters.search', 'keyboard');
    $response->assertJsonCount(1, 'props.products.data');
    $response->assertJsonPath('props.products.data.0.name', 'Ergonomic Keyboard');
});

test('product controller index filters products by category', function () {
    $category = Category::factory()->create(['name' => 'Accessories']);
    $otherCategory = Category::factory()->create(['name' => 'Gaming']);
    Product::factory()->create(['category_id' => $category->id, 'name' => 'USB Cable', 'is_active' => true]);
    Product::factory()->create(['category_id' => $otherCategory->id, 'name' => 'Headset', 'is_active' => true]);

    $response = $this->withHeaders(inertiaHeaders())->get(route('home', ['category_id' => $category->id]));

    $response->assertOk();
    $response->assertJsonPath('props.filters.category_id', $category->id);
    $response->assertJsonCount(1, 'props.products.data');
    $response->assertJsonPath('props.products.data.0.name', 'USB Cable');
});

test('product controller index filters products by price range', function () {
    Product::factory()->create(['name' => 'Basic Speaker', 'price' => 20.00, 'is_active' => true]);
    Product::factory()->create(['name' => 'Premium Speaker', 'price' => 80.00, 'is_active' => true]);

    $response = $this->withHeaders(inertiaHeaders())->get(route('home', ['min_price' => 15, 'max_price' => 30]));

    $response->assertOk();
    $response->assertJsonPath('props.filters.min_price', 15);
    $response->assertJsonPath('props.filters.max_price', 30);
    $response->assertJsonCount(1, 'props.products.data');
    $response->assertJsonPath('props.products.data.0.name', 'Basic Speaker');
});

test('product controller show returns the product detail page', function () {
    $product = Product::factory()->create(['name' => 'Smart Watch', 'is_active' => true]);

    $response = $this->withHeaders(inertiaHeaders())->get(route('products.show', ['product' => $product]));

    $response->assertOk();
    $response->assertJsonPath('component', 'Products/Show');
    $response->assertJsonPath('props.product.name', 'Smart Watch');
});
