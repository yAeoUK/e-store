<?php

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

test('admin can upload images for a product and the first one becomes primary', function () {
    Storage::fake('public');
    $admin = actingAsAdmin();
    $product = Product::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.images.store', $product), [
        'images' => [
            UploadedFile::fake()->image('one.jpg', 2000, 1500),
            UploadedFile::fake()->image('two.jpg', 800, 600),
        ],
    ]);

    $response->assertRedirect(route('admin.products.edit', $product));
    expect($product->images()->count())->toBe(2);

    $first = $product->images()->orderBy('sort_order')->first();
    $second = $product->images()->orderBy('sort_order')->skip(1)->first();

    expect($first->is_primary)->toBeTrue();
    expect($second->is_primary)->toBeFalse();

    $firstPath = Str::after(parse_url($first->url, PHP_URL_PATH), '/storage/');
    Storage::disk('public')->assertExists($firstPath);
});

test('uploading additional images does not disturb the existing primary image', function () {
    Storage::fake('public');
    $admin = actingAsAdmin();
    $product = Product::factory()->create();
    $existing = ProductImage::factory()->for($product)->create(['is_primary' => true, 'sort_order' => 0]);

    $this->actingAs($admin)->post(route('admin.products.images.store', $product), [
        'images' => [UploadedFile::fake()->image('three.jpg')],
    ]);

    expect($existing->fresh()->is_primary)->toBeTrue();
    expect($product->images()->where('is_primary', true)->count())->toBe(1);
});

test('admin can set a different image as primary', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();
    $primary = ProductImage::factory()->for($product)->create(['is_primary' => true]);
    $other = ProductImage::factory()->for($product)->create(['is_primary' => false]);

    $response = $this->actingAs($admin)->post(route('admin.products.images.setPrimary', [$product, $other]));

    $response->assertRedirect(route('admin.products.edit', $product));
    expect($primary->fresh()->is_primary)->toBeFalse();
    expect($other->fresh()->is_primary)->toBeTrue();
});

test('admin can delete an image, but the file is kept on disk so past order snapshots keep resolving', function () {
    Storage::fake('public');
    $admin = actingAsAdmin();
    $product = Product::factory()->create();
    $path = 'products/'.$product->id.'/'.Str::uuid().'.jpg';
    Storage::disk('public')->put($path, 'fake-contents');
    $image = ProductImage::factory()->for($product)->create([
        'url' => Storage::disk('public')->url($path),
        'is_primary' => true,
    ]);

    $response = $this->actingAs($admin)->delete(route('admin.products.images.destroy', [$product, $image]));

    $response->assertRedirect(route('admin.products.edit', $product));
    $this->assertSoftDeleted('product_images', ['id' => $image->id]);
    expect($product->images()->count())->toBe(0);
    Storage::disk('public')->assertExists($path);
});

test('deleting the primary image promotes the next image to primary', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();
    $primary = ProductImage::factory()->for($product)->create(['is_primary' => true, 'sort_order' => 0]);
    $next = ProductImage::factory()->for($product)->create(['is_primary' => false, 'sort_order' => 1]);

    $this->actingAs($admin)->delete(route('admin.products.images.destroy', [$product, $primary]));

    expect($next->fresh()->is_primary)->toBeTrue();
});

test('an image belonging to a different product cannot be managed via this product', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();
    $otherProduct = Product::factory()->create();
    $image = ProductImage::factory()->for($otherProduct)->create();

    $this->actingAs($admin)->post(route('admin.products.images.setPrimary', [$product, $image]))->assertNotFound();
    $this->actingAs($admin)->delete(route('admin.products.images.destroy', [$product, $image]))->assertNotFound();
});

test('oversized or non-image uploads are rejected', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();

    $this->actingAs($admin)->post(route('admin.products.images.store', $product), [
        'images' => [UploadedFile::fake()->create('document.pdf', 100, 'application/pdf')],
    ])->assertSessionHasErrors('images.0');

    $this->actingAs($admin)->post(route('admin.products.images.store', $product), [
        'images' => [UploadedFile::fake()->image('huge.jpg')->size(6000)],
    ])->assertSessionHasErrors('images.0');
});

test('non-admin cannot manage product images', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();
    $image = ProductImage::factory()->for($product)->create();

    $this->actingAs($user)->post(route('admin.products.images.store', $product), [])->assertForbidden();
    $this->actingAs($user)->post(route('admin.products.images.setPrimary', [$product, $image]))->assertForbidden();
    $this->actingAs($user)->delete(route('admin.products.images.destroy', [$product, $image]))->assertForbidden();
});
