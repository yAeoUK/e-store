<?php

use App\Models\Product;
use App\Models\ProductVariant;

test('product relationship returns the correct product', function () {
    $product = Product::factory()->create(['name' => 'Smartphone']);
    $variant = ProductVariant::factory()->create(['product_id' => $product->id]);

    // Unrelated data: another product with its own variant, so the relation
    // must resolve via product_id and not just grab any product row.
    $otherProduct = Product::factory()->create(['name' => 'Blender']);
    ProductVariant::factory()->create(['product_id' => $otherProduct->id]);

    expect($variant->product->id)->toBe($product->id)
        ->and($variant->product->id)->not->toBe($otherProduct->id);
});

test('variant attributes are cast correctly', function () {
    $variant = ProductVariant::factory()->create([
        'options' => ['color' => 'red', 'size' => 'M'],
        'price' => 12.5,
        'stock' => '7',
        'is_active' => 0,
    ]);

    $fresh = ProductVariant::find($variant->id);

    expect($fresh->options)->toBe(['color' => 'red', 'size' => 'M'])
        ->and($fresh->price)->toBe('12.50')
        ->and($fresh->stock)->toBeInt()->toBe(7)
        ->and($fresh->is_active)->toBeFalse();
});
