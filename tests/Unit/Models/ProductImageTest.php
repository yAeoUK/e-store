<?php

use App\Models\Product;
use App\Models\ProductImage;

test('product relationship returns the correct product', function () {
    $product = Product::factory()->create(['name' => 'Smartphone']);
    $image = ProductImage::factory()->create(['product_id' => $product->id]);

    // Unrelated data: another product with its own image, so the relation
    // must resolve via product_id and not just grab any product row.
    $otherProduct = Product::factory()->create(['name' => 'Blender']);
    ProductImage::factory()->create(['product_id' => $otherProduct->id]);

    expect($image->product->id)->toBe($product->id)
        ->and($image->product->id)->not->toBe($otherProduct->id);
});

test('image attributes are cast correctly', function () {
    $image = ProductImage::factory()->create([
        'sort_order' => '3',
        'is_primary' => 1,
    ]);

    $fresh = ProductImage::find($image->id);

    expect($fresh->sort_order)->toBeInt()->toBe(3)
        ->and($fresh->is_primary)->toBeTrue();
});
