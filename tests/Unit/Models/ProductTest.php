<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;

test('category relationship returns the correct category', function () {
    $category = Category::factory()->create(['name' => 'Electronics']);
    $product = Product::factory()->create(['category_id' => $category->id, 'name' => 'Smartphone']);

    // Unrelated data: another category with its own product, so the relation
    // must resolve via category_id and not just grab any category row.
    $otherCategory = Category::factory()->create(['name' => 'Home Appliances']);
    Product::factory()->create(['category_id' => $otherCategory->id, 'name' => 'Blender']);

    expect($product->category->id)->toBe($category->id)
        ->and($product->category->id)->not->toBe($otherCategory->id);
});

test('images relationship returns images ordered by sort_order', function () {
    $product = Product::factory()->create();
    $second = ProductImage::factory()->create(['product_id' => $product->id, 'sort_order' => 2]);
    $first = ProductImage::factory()->create(['product_id' => $product->id, 'sort_order' => 1]);

    // Unrelated data: another product with its own images, so the relation
    // must filter by product_id and not just return every image in the table.
    $otherProduct = Product::factory()->create();
    $otherImage = ProductImage::factory()->create(['product_id' => $otherProduct->id, 'sort_order' => 0]);

    expect($product->images->pluck('id')->all())->toBe([$first->id, $second->id])
        ->and($product->images->pluck('id'))->not->toContain($otherImage->id);
});

test('variants relationship returns the related variants', function () {
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->create(['product_id' => $product->id]);

    // Unrelated data: another product with its own variant, so the relation
    // must filter by product_id and not just return every variant.
    $otherProduct = Product::factory()->create();
    $otherVariant = ProductVariant::factory()->create(['product_id' => $otherProduct->id]);

    expect($product->variants)->toHaveCount(1)
        ->and($product->variants->first()->id)->toBe($variant->id)
        ->and($product->variants->pluck('id'))->not->toContain($otherVariant->id);
});

test('primaryImage is a hasMany relation and returns every primary-flagged image', function () {
    // Despite the singular name, primaryImage() is intentionally a hasMany (not hasOne) —
    // it does not enforce a single primary image, so all is_primary=true rows are returned.
    $product = Product::factory()->create();
    $firstPrimary = ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => true]);
    $secondPrimary = ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => true]);
    ProductImage::factory()->create(['product_id' => $product->id, 'is_primary' => false]);

    // Unrelated data: another product with its own primary-flagged image, so the
    // relation must filter by product_id too, not just is_primary across the table.
    $otherProduct = Product::factory()->create();
    $otherPrimary = ProductImage::factory()->create(['product_id' => $otherProduct->id, 'is_primary' => true]);

    $primaryImages = $product->primaryImage()->get();

    expect($primaryImages)->toHaveCount(2)
        ->and($primaryImages->pluck('id')->all())->toEqualCanonicalizing([$firstPrimary->id, $secondPrimary->id])
        ->and($primaryImages->pluck('id'))->not->toContain($otherPrimary->id);
});

test('product attributes are cast correctly', function () {
    $product = Product::factory()->create([
        'price' => 19.5,
        'is_active' => 1,
        'stock' => '42',
        'metadata' => ['brand' => 'Acme'],
    ]);

    $fresh = Product::find($product->id);

    expect($fresh->price)->toBe('19.50')
        ->and($fresh->is_active)->toBeTrue()
        ->and($fresh->stock)->toBeInt()->toBe(42)
        ->and($fresh->metadata)->toBe(['brand' => 'Acme']);
});
