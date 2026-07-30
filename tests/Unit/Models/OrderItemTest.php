<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;

test('order relationship returns the correct order', function () {
    $order = Order::factory()->create();
    $item = OrderItem::factory()->create(['order_id' => $order->id]);

    // Unrelated data: another order with its own item, so the relation
    // must resolve via order_id and not just grab any order row.
    $otherOrder = Order::factory()->create();
    OrderItem::factory()->create(['order_id' => $otherOrder->id]);

    expect($item->order->id)->toBe($order->id)
        ->and($item->order->id)->not->toBe($otherOrder->id);
});

test('product relationship returns the correct product', function () {
    $product = Product::factory()->create(['name' => 'Smartphone']);
    $item = OrderItem::factory()->create(['product_id' => $product->id]);

    // Unrelated data: another product with its own order item, so the
    // relation must resolve via product_id and not just grab any product row.
    $otherProduct = Product::factory()->create(['name' => 'Blender']);
    OrderItem::factory()->create(['product_id' => $otherProduct->id]);

    expect($item->product->id)->toBe($product->id)
        ->and($item->product->id)->not->toBe($otherProduct->id);
});

test('productVariant relationship returns the correct variant', function () {
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->create(['product_id' => $product->id, 'sku' => 'SKU-RED-M']);
    $item = OrderItem::factory()->create([
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
    ]);

    // Unrelated data: another variant with its own order item, so the
    // relation must resolve via product_variant_id and not just grab any variant row.
    $otherVariant = ProductVariant::factory()->create(['product_id' => $product->id, 'sku' => 'SKU-BLUE-L']);
    OrderItem::factory()->create(['product_id' => $product->id, 'product_variant_id' => $otherVariant->id]);

    expect($item->productVariant->id)->toBe($variant->id)
        ->and($item->productVariant->id)->not->toBe($otherVariant->id);
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
