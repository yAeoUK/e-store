<?php

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

test('admin can list products including inactive and out-of-stock ones', function () {
    $admin = actingAsAdmin();
    Product::factory()->create(['name' => 'Active Widget', 'is_active' => true]);
    Product::factory()->create(['name' => 'Inactive Widget', 'is_active' => false]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.products.index'));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Products/Index');
    $response->assertJsonCount(2, 'props.products.data');
});

test('admin products index paginates results instead of loading them all at once', function () {
    $admin = actingAsAdmin();
    Product::factory()->count(20)->create();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.products.index'));

    $response->assertOk();
    $response->assertJsonCount(15, 'props.products.data');
    $response->assertJsonPath('props.products.total', 20);
    $response->assertJsonPath('props.products.per_page', 15);
});

test('non-admin cannot list products', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.products.index'))->assertForbidden();
});

test('admin can filter products by stock_status', function () {
    $admin = actingAsAdmin();
    Product::factory()->create(['name' => 'Low Stock Item', 'stock' => 3]);
    Product::factory()->create(['name' => 'Out Of Stock Item', 'stock' => 0]);
    Product::factory()->create(['name' => 'Plenty In Stock', 'stock' => 50]);

    $lowResponse = $this->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route('admin.products.index', ['stock_status' => 'low']));
    $lowResponse->assertOk();
    $lowResponse->assertJsonCount(1, 'props.products.data');
    $lowResponse->assertJsonPath('props.products.data.0.name', 'Low Stock Item');

    $outResponse = $this->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route('admin.products.index', ['stock_status' => 'out']));
    $outResponse->assertOk();
    $outResponse->assertJsonCount(1, 'props.products.data');
    $outResponse->assertJsonPath('props.products.data.0.name', 'Out Of Stock Item');
});

test('admin can filter products by search', function () {
    $admin = actingAsAdmin();
    Product::factory()->create(['name' => 'Wireless Keyboard']);
    Product::factory()->create(['name' => 'Desk Lamp']);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route('admin.products.index', ['search' => 'Keyboard']));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.products.data');
    $response->assertJsonPath('props.products.data.0.name', 'Wireless Keyboard');
});

test('admin can filter products by category_id', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create();
    $otherCategory = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);
    Product::factory()->create(['category_id' => $otherCategory->id]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route('admin.products.index', ['category_id' => $category->id]));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.products.data');
    $response->assertJsonPath('props.products.data.0.category_id', $category->id);
});

test('admin can render the create product page', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.products.create'));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Products/Create');
    $response->assertJsonCount(1, 'props.categories');
    $response->assertJsonPath('props.categories.0.id', $category->id);
});

test('admin can render the edit product page', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.products.edit', $product));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Products/Edit');
    $response->assertJsonPath('props.product.id', $product->id);
});

test('non-admin cannot view the product create or edit pages', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)->get(route('admin.products.create'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.products.edit', $product))->assertForbidden();
});

test('admin can create a product', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'category_id' => $category->id,
        'name' => 'New Gadget',
        'slug' => 'new-gadget',
        'price' => 49.99,
        'stock' => 10,
        'is_active' => true,
    ]);

    $product = Product::where('slug', 'new-gadget')->firstOrFail();
    $response->assertRedirect(route('admin.products.edit', $product));
    $this->assertDatabaseHas('products', [
        'slug' => 'new-gadget',
        'name' => 'New Gadget',
        'category_id' => $category->id,
    ]);
});

test('admin can change a products category on update', function () {
    $admin = actingAsAdmin();
    $originalCategory = Category::factory()->create();
    $newCategory = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $originalCategory->id]);

    $response = $this->actingAs($admin)->patch(route('admin.products.update', $product), [
        'category_id' => $newCategory->id,
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', ['id' => $product->id, 'category_id' => $newCategory->id]);
});

test('admin can clear a products category on update', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($admin)->patch(route('admin.products.update', $product), [
        'category_id' => '',
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', ['id' => $product->id, 'category_id' => null]);
});

test('admin can create a product without providing a slug and one is generated from the name', function () {
    $admin = actingAsAdmin();

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Wireless Mouse Pro',
        'price' => 19.99,
    ]);

    $product = Product::where('slug', 'wireless-mouse-pro')->firstOrFail();
    $response->assertRedirect(route('admin.products.edit', $product));
    $this->assertDatabaseHas('products', ['name' => 'Wireless Mouse Pro', 'slug' => 'wireless-mouse-pro']);
});

test('admin creating a product with a name that collides gets a suffixed slug', function () {
    $admin = actingAsAdmin();
    Product::factory()->create(['slug' => 'wireless-mouse-pro']);

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Wireless Mouse Pro',
        'price' => 19.99,
    ]);

    $product = Product::where('slug', 'wireless-mouse-pro-1')->firstOrFail();
    $response->assertRedirect(route('admin.products.edit', $product));
    $this->assertDatabaseHas('products', ['name' => 'Wireless Mouse Pro', 'slug' => 'wireless-mouse-pro-1']);
});

test('admin creating a product with a name that collides twice gets a doubly-suffixed slug', function () {
    $admin = actingAsAdmin();
    Product::factory()->create(['slug' => 'wireless-mouse-pro']);
    Product::factory()->create(['slug' => 'wireless-mouse-pro-1']);

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Wireless Mouse Pro',
        'price' => 19.99,
    ]);

    $product = Product::where('slug', 'wireless-mouse-pro-2')->firstOrFail();
    $response->assertRedirect(route('admin.products.edit', $product));
    $this->assertDatabaseHas('products', ['name' => 'Wireless Mouse Pro', 'slug' => 'wireless-mouse-pro-2']);
});

test('submitting the same product name twice auto-suffixes the second slug instead of rejecting it', function () {
    $admin = actingAsAdmin();

    // Mirrors the real create form: the slug field is always auto-filled
    // from the name before submission, so it's never actually blank here -
    // this reproduces the exact payload shape that used to hit the
    // `unique:products,slug` rule and get rejected with a 422 instead of
    // being auto-suffixed.
    $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Product One',
        'slug' => 'product-one',
        'price' => 9.99,
    ])->assertRedirect(route('admin.products.edit', Product::where('slug', 'product-one')->firstOrFail()));

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Product One',
        'slug' => 'product-one',
        'price' => 9.99,
    ]);

    $response->assertRedirect(route('admin.products.edit', Product::where('slug', 'product-one-1')->firstOrFail()));
    $response->assertSessionDoesntHaveErrors();
    $this->assertDatabaseHas('products', ['name' => 'Product One', 'slug' => 'product-one']);
    $this->assertDatabaseHas('products', ['name' => 'Product One', 'slug' => 'product-one-1']);
});

test('admin updating a product without changing the slug keeps the existing one', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create(['name' => 'Old Name', 'slug' => 'old-name']);

    $response = $this->actingAs($admin)->patch(route('admin.products.update', $product), [
        'name' => 'New Name',
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'New Name', 'slug' => 'old-name']);
});

test('admin clearing the slug on update regenerates it from the name', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create(['name' => 'Old Name', 'slug' => 'old-name']);

    $response = $this->actingAs($admin)->patch(route('admin.products.update', $product), [
        'name' => 'Brand New Name',
        'slug' => '',
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', ['id' => $product->id, 'slug' => 'brand-new-name']);
});

test('admin clearing only the slug regenerates it from the products current name', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create(['name' => 'Keyboard', 'slug' => 'old-slug']);

    $response = $this->actingAs($admin)->patch(route('admin.products.update', $product), [
        'slug' => '',
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Keyboard', 'slug' => 'keyboard']);
});

test('admin can create a product with a blank stock field and it defaults to zero', function () {
    $admin = actingAsAdmin();

    // The admin form always submits `stock` (as an empty string when left
    // blank), which Laravel's ConvertEmptyStringsToNull middleware turns into
    // null before validation - this reproduces that exact payload shape,
    // rather than omitting the key entirely as a raw API test might.
    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'No Stock Yet',
        'price' => 9.99,
        'stock' => '',
    ]);

    $product = Product::where('name', 'No Stock Yet')->firstOrFail();
    $response->assertRedirect(route('admin.products.edit', $product));
    $this->assertDatabaseHas('products', ['name' => 'No Stock Yet', 'stock' => 0]);
});

test('admin clearing stock on update defaults it back to zero', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create(['stock' => 25]);

    $response = $this->actingAs($admin)->patch(route('admin.products.update', $product), [
        'stock' => '',
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', ['id' => $product->id, 'stock' => 0]);
});

test('admin can update a product', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs($admin)->patch(route('admin.products.update', $product), [
        'name' => 'New Name',
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'New Name']);
});

test('admin can delete a product', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.products.destroy', $product));

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseMissing('products', ['id' => $product->id]);
});

test('admin cannot delete a product that has existing orders', function () {
    $admin = actingAsAdmin();
    $product = Product::factory()->create();
    OrderItem::factory()->create(['product_id' => $product->id]);

    $response = $this->actingAs($admin)->delete(route('admin.products.destroy', $product));

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHasErrors('product');
    $this->assertDatabaseHas('products', ['id' => $product->id]);
});

test('non-admin cannot create update or delete products', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)->post(route('admin.products.store'), ['name' => 'x'])->assertForbidden();
    $this->actingAs($user)->patch(route('admin.products.update', $product), ['name' => 'x'])->assertForbidden();
    $this->actingAs($user)->delete(route('admin.products.destroy', $product))->assertForbidden();

    $this->assertDatabaseHas('products', ['id' => $product->id]);
});
