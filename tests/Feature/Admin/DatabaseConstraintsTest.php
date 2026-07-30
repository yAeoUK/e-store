<?php

use App\Models\Address;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\QueryException;

// These bypass the FormRequest/controller entirely and hit the model
// directly, proving the database schema itself enforces these rules -
// not just the app-level `unique`/`exists` validation rules and the
// app-level children/products delete guard.

test('the database rejects two products with the same slug', function () {
    Product::factory()->create(['slug' => 'duplicate-slug']);

    expect(fn () => Product::factory()->create(['slug' => 'duplicate-slug']))
        ->toThrow(QueryException::class);
});

test('the database rejects a product referencing a non-existent category', function () {
    expect(fn () => Product::factory()->create(['category_id' => 999999]))
        ->toThrow(QueryException::class);
});

test('the database rejects two categories with the same slug', function () {
    Category::factory()->create(['slug' => 'duplicate-slug']);

    expect(fn () => Category::factory()->create(['slug' => 'duplicate-slug']))
        ->toThrow(QueryException::class);
});

test('the database rejects a category referencing a non-existent parent', function () {
    expect(fn () => Category::factory()->create(['parent_id' => 999999]))
        ->toThrow(QueryException::class);
});

test('the database rejects deleting a category that still has child categories', function () {
    $parent = Category::factory()->create();
    Category::factory()->create(['parent_id' => $parent->id]);

    expect(fn () => $parent->delete())->toThrow(QueryException::class);
});

test('the database rejects deleting a category that still has products', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    expect(fn () => $category->delete())->toThrow(QueryException::class);
});

test('the database allows deleting a category with no children or products', function () {
    $category = Category::factory()->create();

    $category->delete();

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});

test('the database rejects two users with the same email', function () {
    User::factory()->create(['email' => 'duplicate@example.com']);

    expect(fn () => User::factory()->create(['email' => 'duplicate@example.com']))
        ->toThrow(QueryException::class);
});

test('the database rejects an address referencing a non-existent user', function () {
    expect(fn () => Address::factory()->create(['user_id' => 999999]))
        ->toThrow(QueryException::class);
});

test('the database deletes a user\'s addresses when the user is deleted', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);

    $user->delete();

    $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
});

test('the database rejects an order referencing a non-existent user', function () {
    expect(fn () => Order::factory()->create(['user_id' => 999999]))
        ->toThrow(QueryException::class);
});

test('the database deletes a user\'s orders when the user is deleted', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $user->delete();

    $this->assertDatabaseMissing('orders', ['id' => $order->id]);
});

test('the database rejects an order item referencing a non-existent order', function () {
    expect(fn () => OrderItem::factory()->create(['order_id' => 999999]))
        ->toThrow(QueryException::class);
});

test('the database rejects an order item referencing a non-existent product', function () {
    expect(fn () => OrderItem::factory()->create(['product_id' => 999999]))
        ->toThrow(QueryException::class);
});

test('the database deletes an order\'s items when the order is deleted', function () {
    $order = Order::factory()->create();
    $item = OrderItem::factory()->create(['order_id' => $order->id]);

    $order->delete();

    $this->assertDatabaseMissing('order_items', ['id' => $item->id]);
});

test('the database rejects deleting a product that still has order items', function () {
    $product = Product::factory()->create();
    OrderItem::factory()->create(['product_id' => $product->id]);

    expect(fn () => $product->delete())->toThrow(QueryException::class);
});

test('the database rejects a product image referencing a non-existent product', function () {
    expect(fn () => ProductImage::factory()->create(['product_id' => 999999]))
        ->toThrow(QueryException::class);
});

test('the database deletes a product\'s images when the product is deleted', function () {
    $product = Product::factory()->create();
    $image = ProductImage::factory()->create(['product_id' => $product->id]);

    $product->delete();

    $this->assertDatabaseMissing('product_images', ['id' => $image->id]);
});

test('the database rejects two product variants with the same sku', function () {
    ProductVariant::factory()->create(['sku' => 'DUPLICATE-SKU']);

    expect(fn () => ProductVariant::factory()->create(['sku' => 'DUPLICATE-SKU']))
        ->toThrow(QueryException::class);
});

test('the database rejects a product variant referencing a non-existent product', function () {
    expect(fn () => ProductVariant::factory()->create(['product_id' => 999999]))
        ->toThrow(QueryException::class);
});

test('the database deletes a product\'s variants when the product is deleted', function () {
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->create(['product_id' => $product->id]);

    $product->delete();

    $this->assertDatabaseMissing('product_variants', ['id' => $variant->id]);
});
