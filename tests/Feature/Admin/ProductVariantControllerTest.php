<?php

use App\Models\Product;
use App\Models\ProductVariant;

test('admin can create a variant for a product', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.variants.store', $product), [
        'sku' => 'SKU-RED-M',
        'options' => ['color' => 'Red', 'size' => 'M'],
        'price' => 24.99,
        'stock' => 5,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.products.edit', $product));
    $this->assertDatabaseHas('product_variants', [
        'product_id' => $product->id,
        'sku' => 'SKU-RED-M',
        'stock' => 5,
    ]);
});

test('creating a variant with a blank stock field defaults it to zero', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();

    $this->actingAs($admin)->post(route('admin.products.variants.store', $product), [
        'sku' => 'SKU-NO-STOCK',
        'stock' => '',
    ]);

    $this->assertDatabaseHas('product_variants', ['sku' => 'SKU-NO-STOCK', 'stock' => 0]);
});

test('variant sku must be unique across all products', function () {
    $admin = actingAsAdmin();
    $existingProduct = Product::factory()->create();
    ProductVariant::factory()->for($existingProduct)->create(['sku' => 'DUPLICATE-SKU']);
    $product = Product::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.variants.store', $product), [
        'sku' => 'DUPLICATE-SKU',
    ]);

    $response->assertSessionHasErrors('sku');
});

test('admin can update a variant keeping its own sku', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->for($product)->create(['sku' => 'KEEP-ME']);

    $response = $this->actingAs($admin)->patch(route('admin.products.variants.update', [$product, $variant]), [
        'sku' => 'KEEP-ME',
        'stock' => 42,
    ]);

    $response->assertRedirect(route('admin.products.edit', $product));
    $this->assertDatabaseHas('product_variants', ['id' => $variant->id, 'sku' => 'KEEP-ME', 'stock' => 42]);
});

test('updating a variant sku to one used by another product is rejected', function () {
    $admin = actingAsAdmin();
    $otherProduct = Product::factory()->create();
    ProductVariant::factory()->for($otherProduct)->create(['sku' => 'TAKEN-SKU']);
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->for($product)->create();

    $response = $this->actingAs($admin)->patch(route('admin.products.variants.update', [$product, $variant]), [
        'sku' => 'TAKEN-SKU',
    ]);

    $response->assertSessionHasErrors('sku');
});

test('updating a variant with a null price clears it', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->for($product)->create(['price' => 19.99]);

    $this->actingAs($admin)->patch(route('admin.products.variants.update', [$product, $variant]), [
        'sku' => $variant->sku,
        'price' => '',
    ]);

    $this->assertDatabaseHas('product_variants', ['id' => $variant->id, 'price' => null]);
});

test('admin can delete a variant', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->for($product)->create();

    $response = $this->actingAs($admin)->delete(route('admin.products.variants.destroy', [$product, $variant]));

    $response->assertRedirect(route('admin.products.edit', $product));
    $this->assertDatabaseMissing('product_variants', ['id' => $variant->id]);
});

test('a variant belonging to a different product cannot be managed via this product', function () {
    $product = Product::factory()->create();
    $otherProduct = Product::factory()->create();
    $variant = ProductVariant::factory()->for($otherProduct)->create();

    assertScopedChildNotFoundForWrongParent($product, $variant, [
        ['patch', 'admin.products.variants.update', ['sku' => $variant->sku]],
        ['delete', 'admin.products.variants.destroy', []],
    ]);
});

test('non-admin cannot manage product variants', function () {
    $product = Product::factory()->create();
    $variant = ProductVariant::factory()->for($product)->create();

    assertNonAdminForbidden('post', route('admin.products.variants.store', $product), ['sku' => 'X']);
    assertNonAdminForbidden('patch', route('admin.products.variants.update', [$product, $variant]), ['sku' => 'X']);
    assertNonAdminForbidden('delete', route('admin.products.variants.destroy', [$product, $variant]));
});
