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

test('makePrimary marks the image as primary', function () {
    $image = ProductImage::factory()->create(['is_primary' => false]);

    $image->makePrimary();

    expect($image->fresh()->is_primary)->toBeTrue();
});

test('makePrimary unsets the previous primary among the same product\'s images', function () {
    $product = Product::factory()->create();
    $current = ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => true]);
    $other = ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => false]);

    $other->makePrimary();

    expect($other->fresh()->is_primary)->toBeTrue()
        ->and($current->fresh()->is_primary)->toBeFalse();
});

test('makePrimary does not affect other products\' images', function () {
    $product = Product::factory()->create();
    $image = ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => false]);

    $otherProduct = Product::factory()->create();
    $otherImage = ProductImage::factory()->create(['product_id' => $otherProduct->id, 'is_primary' => true]);

    $image->makePrimary();

    expect($image->fresh()->is_primary)->toBeTrue()
        ->and($otherImage->fresh()->is_primary)->toBeTrue();
});
