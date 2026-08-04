<?php

use App\Models\Category;
use App\Models\OrderItem;
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

test('orderItems relationship returns the related order items', function () {
    $product = Product::factory()->create();
    $orderItem = OrderItem::factory()->create(['product_id' => $product->id]);

    // Unrelated data: another product with its own order item, so the
    // relation must filter by product_id and not just return every order item.
    $otherProduct = Product::factory()->create();
    $otherOrderItem = OrderItem::factory()->create(['product_id' => $otherProduct->id]);

    expect($product->orderItems)->toHaveCount(1)
        ->and($product->orderItems->first()->id)->toBe($orderItem->id)
        ->and($product->orderItems->pluck('id'))->not->toContain($otherOrderItem->id);
});

test('lowStock scope returns only products at or below the threshold but above zero', function () {
    $lowStock = Product::factory()->create(['stock' => Product::LOW_STOCK_THRESHOLD]);

    // Unrelated data: out-of-stock and well-stocked products, so the scope
    // must filter on both bounds and not just an upper or lower one.
    $outOfStock = Product::factory()->create(['stock' => 0]);
    $wellStocked = Product::factory()->create(['stock' => Product::LOW_STOCK_THRESHOLD + 1]);

    $result = Product::lowStock()->get();

    expect($result->pluck('id')->all())->toBe([$lowStock->id])
        ->and($result->pluck('id'))->not->toContain($outOfStock->id)
        ->and($result->pluck('id'))->not->toContain($wellStocked->id);
});

test('outOfStock scope returns only products with zero stock', function () {
    $outOfStock = Product::factory()->create(['stock' => 0]);

    // Unrelated data: a low-stock product, so the scope must require stock
    // to be exactly zero and not just below the low-stock threshold.
    $lowStock = Product::factory()->create(['stock' => 1]);

    $result = Product::outOfStock()->get();

    expect($result->pluck('id')->all())->toBe([$outOfStock->id])
        ->and($result->pluck('id'))->not->toContain($lowStock->id);
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
