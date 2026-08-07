<?php

use App\Models\Category;
use App\Models\Product;

test('parent relationship returns the correct parent category', function () {
    assertBelongsToResolvesCorrectOwner(Category::class, Category::class, 'parent_id', 'parent');
});

test('a root category has no parent', function () {
    $category = Category::factory()->create(['parent_id' => null]);

    // Unrelated data: categories that do have a parent, to make sure the
    // assertion isn't trivially true just because the table is otherwise empty.
    $otherParent = Category::factory()->create();
    Category::factory()->create(['parent_id' => $otherParent->id]);

    expect($category->parent)->toBeNull();
});

test('children relationship returns the child categories', function () {
    assertHasManyResolvesCorrectOwner(Category::class, Category::class, 'parent_id', 'children');
});

test('products relationship returns the related products', function () {
    assertHasManyResolvesCorrectOwner(Category::class, Product::class, 'category_id', 'products');
});
