<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;

test('order relationship returns the correct order', function () {
    assertBelongsToResolvesCorrectOwner(Order::class, OrderItem::class, 'order_id', 'order');
});

test('product relationship returns the correct product', function () {
    assertBelongsToResolvesCorrectOwner(Product::class, OrderItem::class, 'product_id', 'product');
});

test('productVariant relationship returns the correct variant', function () {
    assertBelongsToResolvesCorrectOwner(ProductVariant::class, OrderItem::class, 'product_variant_id', 'productVariant');
});

test('product_variant_id is nullable for order items with no variant', function () {
    $item = OrderItem::factory()->create(['product_variant_id' => null]);

    expect($item->product_variant_id)->toBeNull()
        ->and($item->productVariant)->toBeNull();
});

test('order item attributes are cast correctly', function () {
    $item = OrderItem::factory()->create([
        'quantity' => '3',
        'unit_price' => 19.5,
        'product_snapshot' => ['name' => 'Smartphone'],
    ]);

    $fresh = OrderItem::find($item->id);

    expect($fresh->quantity)->toBeInt()->toBe(3)
        ->and($fresh->unit_price)->toBe('19.50')
        ->and($fresh->product_snapshot)->toBeArray();
});

test('product_snapshot preserves the product as it was at order time, even after the product changes', function () {
    $product = Product::factory()->create(['name' => 'Smartphone']);
    $item = OrderItem::factory()->create([
        'product_id' => $product->id,
        'product_snapshot' => ['name' => 'Smartphone', 'slug' => $product->slug, 'image_url' => null],
    ]);

    $product->update(['name' => 'Smartphone Pro Max']);

    $fresh = $item->fresh();

    expect($fresh->product_snapshot)->toBeArray()
        ->and($fresh->product_snapshot['name'])->toBe('Smartphone')
        ->and($fresh->product->name)->toBe('Smartphone Pro Max');
});

test('product_snapshot preserves the category as it was at order time, even after the category changes', function () {
    $category = Category::factory()->create(['name' => 'Phones']);
    $product = Product::factory()->create(['category_id' => $category->id]);
    $item = OrderItem::factory()->create(['product_id' => $product->id]);

    $category->update(['name' => 'Smartphones & Accessories']);

    $fresh = $item->fresh();

    expect($fresh->product_snapshot['category']['name'])->toBe('Phones')
        ->and($fresh->product_snapshot['category']['slug'])->toBe($category->slug)
        ->and($fresh->product->category->name)->toBe('Smartphones & Accessories');
});

test('product_snapshot has a null category when the product has no category', function () {
    $product = Product::factory()->create(['category_id' => null]);
    $item = OrderItem::factory()->create(['product_id' => $product->id]);

    expect($item->product_snapshot['category'])->toBeNull();
});

test('product_snapshot preserves the variant as it was at order time, even after the variant changes', function () {
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'sku' => 'SKU-RED-M',
        'options' => ['color' => 'Red', 'size' => 'M'],
    ]);
    $item = OrderItem::factory()->create([
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
    ]);

    $variant->update(['sku' => 'SKU-RED-M-V2', 'options' => ['color' => 'Crimson', 'size' => 'M']]);

    $fresh = $item->fresh();

    expect($fresh->product_snapshot['variant']['sku'])->toBe('SKU-RED-M')
        ->and($fresh->product_snapshot['variant']['options'])->toBe(['color' => 'Red', 'size' => 'M'])
        ->and($fresh->productVariant->sku)->toBe('SKU-RED-M-V2');
});

test('product_snapshot has a null variant when the order item has no variant', function () {
    $product = Product::factory()->create();
    $item = OrderItem::factory()->create(['product_id' => $product->id, 'product_variant_id' => null]);

    expect($item->product_snapshot['variant'])->toBeNull();
});

test('resolveUnitPrice uses the variant price when a variant is given', function () {
    $product = Product::factory()->create(['price' => 100]);
    $variant = ProductVariant::factory()->create(['product_id' => $product->id, 'price' => 120]);

    expect(OrderItem::resolveUnitPrice($product, $variant))->toBe('120.00');
});

test('resolveUnitPrice falls back to the product price when the variant has no price override', function () {
    $product = Product::factory()->create(['price' => 100]);
    $variant = ProductVariant::factory()->create(['product_id' => $product->id, 'price' => null]);

    expect(OrderItem::resolveUnitPrice($product, $variant))->toBe('100.00');
});

test('resolveUnitPrice uses the product price when there is no variant', function () {
    $product = Product::factory()->create(['price' => 100]);

    expect(OrderItem::resolveUnitPrice($product, null))->toBe('100.00');
});

test('buildProductSnapshot captures the product, category and primary image', function () {
    $category = Category::factory()->create(['name' => 'Phones']);
    $product = Product::factory()->create(['name' => 'Smartphone', 'category_id' => $category->id]);
    ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => false, 'url' => 'secondary.jpg']);
    $primaryImage = ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => true, 'url' => 'primary.jpg']);

    $snapshot = OrderItem::buildProductSnapshot($product, null);

    expect($snapshot['name'])->toBe('Smartphone')
        ->and($snapshot['slug'])->toBe($product->slug)
        ->and($snapshot['image_url'])->toBe($primaryImage->url)
        ->and($snapshot['category'])->toBe(['name' => 'Phones', 'slug' => $category->slug])
        ->and($snapshot['variant'])->toBeNull();
});

test('buildProductSnapshot has a null category and image when the product has neither', function () {
    $product = Product::factory()->create(['category_id' => null]);

    $snapshot = OrderItem::buildProductSnapshot($product, null);

    expect($snapshot['category'])->toBeNull()
        ->and($snapshot['image_url'])->toBeNull();
});

test('buildProductSnapshot captures the variant sku and options when given', function () {
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'sku' => 'SKU-RED-M',
        'options' => ['color' => 'Red', 'size' => 'M'],
    ]);

    $snapshot = OrderItem::buildProductSnapshot($product, $variant);

    expect($snapshot['variant'])->toBe(['sku' => 'SKU-RED-M', 'options' => ['color' => 'Red', 'size' => 'M']]);
});
