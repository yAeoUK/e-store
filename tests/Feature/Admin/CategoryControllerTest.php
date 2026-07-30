<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;

test('admin can list categories', function () {
    $admin = actingAsAdmin();
    Category::factory()->create(['name' => 'Electronics']);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.categories.index'));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Categories/Index');
    $response->assertJsonCount(1, 'props.categories.data');
});

test('admin categories index paginates results instead of loading them all at once', function () {
    $admin = actingAsAdmin();
    Category::factory()->count(20)->create();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.categories.index'));

    $response->assertOk();
    $response->assertJsonCount(15, 'props.categories.data');
    $response->assertJsonPath('props.categories.total', 20);
    $response->assertJsonPath('props.categories.per_page', 15);
});

test('admin can filter categories by parent_id', function () {
    $admin = actingAsAdmin();
    $parent = Category::factory()->create();
    $otherParent = Category::factory()->create();
    Category::factory()->create(['parent_id' => $parent->id]);
    Category::factory()->create(['parent_id' => $otherParent->id]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route('admin.categories.index', ['parent_id' => $parent->id]));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.categories.data');
    $response->assertJsonPath('props.categories.data.0.parent_id', $parent->id);
});

test('admin can filter categories by search', function () {
    $admin = actingAsAdmin();
    Category::factory()->create(['name' => 'Electronics']);
    Category::factory()->create(['name' => 'Furniture']);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route('admin.categories.index', ['search' => 'Electro']));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.categories.data');
    $response->assertJsonPath('props.categories.data.0.name', 'Electronics');
});

test('non-admin cannot list categories', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.categories.index'))->assertForbidden();
});

test('admin can render the create category page', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.categories.create'));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Categories/Create');
    $response->assertJsonCount(1, 'props.categories');
    $response->assertJsonPath('props.categories.0.id', $category->id);
});

test('admin can render the edit category page', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.categories.edit', $category));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Categories/Edit');
    $response->assertJsonPath('props.category.id', $category->id);
});

test('non-admin cannot view the category create or edit pages', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($user)->get(route('admin.categories.create'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.categories.edit', $category))->assertForbidden();
});

test('admin can create a category', function () {
    $admin = actingAsAdmin();
    $parent = Category::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.categories.store'), [
        'parent_id' => $parent->id,
        'name' => 'New Category',
        'slug' => 'new-category',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $this->assertDatabaseHas('categories', ['slug' => 'new-category', 'parent_id' => $parent->id]);
});

test('admin can change a categorys parent on update', function () {
    $admin = actingAsAdmin();
    $originalParent = Category::factory()->create();
    $newParent = Category::factory()->create();
    $category = Category::factory()->create(['parent_id' => $originalParent->id]);

    $response = $this->actingAs($admin)->patch(route('admin.categories.update', $category), [
        'parent_id' => $newParent->id,
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $this->assertDatabaseHas('categories', ['id' => $category->id, 'parent_id' => $newParent->id]);
});

test('admin can clear a categorys parent on update', function () {
    $admin = actingAsAdmin();
    $parent = Category::factory()->create();
    $category = Category::factory()->create(['parent_id' => $parent->id]);

    $response = $this->actingAs($admin)->patch(route('admin.categories.update', $category), [
        'parent_id' => '',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $this->assertDatabaseHas('categories', ['id' => $category->id, 'parent_id' => null]);
});

test('admin can create a category without providing a slug and one is generated from the name', function () {
    $admin = actingAsAdmin();

    $response = $this->actingAs($admin)->post(route('admin.categories.store'), [
        'name' => 'Home Appliances',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $this->assertDatabaseHas('categories', ['name' => 'Home Appliances', 'slug' => 'home-appliances']);
});

test('admin creating a category with a name that collides gets a suffixed slug', function () {
    $admin = actingAsAdmin();
    Category::factory()->create(['slug' => 'home-appliances']);

    $response = $this->actingAs($admin)->post(route('admin.categories.store'), [
        'name' => 'Home Appliances',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $this->assertDatabaseHas('categories', ['name' => 'Home Appliances', 'slug' => 'home-appliances-1']);
});

test('submitting the same category name twice auto-suffixes the second slug instead of rejecting it', function () {
    $admin = actingAsAdmin();

    $this->actingAs($admin)->post(route('admin.categories.store'), [
        'name' => 'Category One',
        'slug' => 'category-one',
    ])->assertRedirect(route('admin.categories.index'));

    $response = $this->actingAs($admin)->post(route('admin.categories.store'), [
        'name' => 'Category One',
        'slug' => 'category-one',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionDoesntHaveErrors();
    $this->assertDatabaseHas('categories', ['name' => 'Category One', 'slug' => 'category-one']);
    $this->assertDatabaseHas('categories', ['name' => 'Category One', 'slug' => 'category-one-1']);
});

test('admin updating a category without changing the slug keeps the existing one', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create(['name' => 'Old Name', 'slug' => 'old-name']);

    $response = $this->actingAs($admin)->patch(route('admin.categories.update', $category), [
        'name' => 'New Name',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'New Name', 'slug' => 'old-name']);
});

test('admin can update a category', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs($admin)->patch(route('admin.categories.update', $category), [
        'name' => 'New Name',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'New Name']);
});

test('admin can delete an empty category', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.categories.destroy', $category));

    $response->assertRedirect(route('admin.categories.index'));
    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});

test('admin cannot delete a category that still has products', function () {
    $admin = actingAsAdmin();
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($admin)->delete(route('admin.categories.destroy', $category));

    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHasErrors('category');
    $this->assertDatabaseHas('categories', ['id' => $category->id]);
});

test('admin cannot delete a category that still has child categories', function () {
    $admin = actingAsAdmin();
    $parent = Category::factory()->create();
    Category::factory()->create(['parent_id' => $parent->id]);

    $response = $this->actingAs($admin)->delete(route('admin.categories.destroy', $parent));

    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHasErrors('category');
    $this->assertDatabaseHas('categories', ['id' => $parent->id]);
});

test('non-admin cannot create update or delete categories', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($user)->post(route('admin.categories.store'), ['name' => 'x'])->assertForbidden();
    $this->actingAs($user)->patch(route('admin.categories.update', $category), ['name' => 'x'])->assertForbidden();
    $this->actingAs($user)->delete(route('admin.categories.destroy', $category))->assertForbidden();

    $this->assertDatabaseHas('categories', ['id' => $category->id]);
});
