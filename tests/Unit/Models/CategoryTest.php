<?php

use App\Models\Category;
use App\Models\Product;

test('parent relationship returns the correct parent category', function () {
    $parent = Category::factory()->create(['name' => 'Electronics']);
    $child = Category::factory()->create(['name' => 'Phones', 'parent_id' => $parent->id]);

    // Unrelated data: another parent/child pair and a standalone category that
    // should never be confused with $child's actual parent.
    $otherParent = Category::factory()->create(['name' => 'Home Appliances']);
    Category::factory()->create(['name' => 'Blenders', 'parent_id' => $otherParent->id]);
    Category::factory()->create(['name' => 'Books']);

    expect($child->parent)->not->toBeNull()
        ->and($child->parent->id)->toBe($parent->id)
        ->and($child->parent->id)->not->toBe($otherParent->id);
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
    $parent = Category::factory()->create(['name' => 'Electronics']);
    $child = Category::factory()->create(['name' => 'Phones', 'parent_id' => $parent->id]);

    // Unrelated data: a standalone category, plus another parent with its own
    // child, so the relationship must filter by parent_id and not just return
    // every category or every category that has a parent_id set.
    Category::factory()->create(['name' => 'Books']);
    $otherParent = Category::factory()->create(['name' => 'Home Appliances']);
    $otherChild = Category::factory()->create(['name' => 'Blenders', 'parent_id' => $otherParent->id]);

    expect($parent->children)->toHaveCount(1)
        ->and($parent->children->first()->id)->toBe($child->id)
        ->and($parent->children->pluck('id'))->not->toContain($otherChild->id);
});

test('products relationship returns the related products', function () {
    $category = Category::factory()->create(['name' => 'Electronics']);
    $product = Product::factory()->create(['category_id' => $category->id, 'name' => 'Smartphone']);

    // Unrelated data: another category with its own products, so the
    // relationship must filter by category_id and not just return every product.
    $otherCategory = Category::factory()->create(['name' => 'Home Appliances']);
    Product::factory()->create(['category_id' => $otherCategory->id, 'name' => 'Blender']);
    Product::factory()->create(['category_id' => $otherCategory->id, 'name' => 'Toaster']);

    expect($category->products)->toHaveCount(1)
        ->and($category->products->first()->id)->toBe($product->id)
        ->and($category->products->pluck('name'))->not->toContain('Blender')
        ->and($category->products->pluck('name'))->not->toContain('Toaster');
});
