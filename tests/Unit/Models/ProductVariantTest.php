<?php

use App\Models\Product;
use App\Models\ProductVariant;

test('product relationship returns the correct product', function () {
    assertBelongsToResolvesCorrectOwner(Product::class, ProductVariant::class, 'product_id', 'product');
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

test('findOptional returns the matching variant for a numeric id, string or int', function () {
    $variant = ProductVariant::factory()->create();

    expect(ProductVariant::findOptional($variant->id)?->id)->toBe($variant->id)
        ->and(ProductVariant::findOptional((string) $variant->id)?->id)->toBe($variant->id);
});

test('findOptional returns null for empty or missing ids', function () {
    expect(ProductVariant::findOptional(null))->toBeNull()
        ->and(ProductVariant::findOptional(''))->toBeNull()
        ->and(ProductVariant::findOptional(0))->toBeNull()
        ->and(ProductVariant::findOptional('9999999'))->toBeNull();
});
