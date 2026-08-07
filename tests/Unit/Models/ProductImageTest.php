<?php

use App\Models\Product;
use App\Models\ProductImage;

test('product relationship returns the correct product', function () {
    assertBelongsToResolvesCorrectOwner(Product::class, ProductImage::class, 'product_id', 'product');
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
    assertExclusiveFlagMarksSelf(ProductImage::class, 'makePrimary', 'is_primary', 'product_id', Product::class);
});

test('makePrimary unsets the previous primary among the same product\'s images', function () {
    assertExclusiveFlagUnsetsPreviousHolder(ProductImage::class, 'makePrimary', 'is_primary', 'product_id', Product::class);
});

test('makePrimary does not affect other products\' images', function () {
    assertExclusiveFlagScopedToOwner(ProductImage::class, 'makePrimary', 'is_primary', 'product_id', Product::class);
});
