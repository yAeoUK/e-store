<?php

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

// index

test('cart index renders the Cart/Index page with the user\'s cart items', function () {
    $user = User::factory()->create();
    $cart = createCartWithItems($user, 2);

    $response = $this->actingAs($user)->get(route('cart.index'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Cart/Index')
        ->has('cart.order_items', 2)
        ->where('cart.id', $cart->id)
    );
});

test('cart index only includes the authenticated user\'s cart items', function () {
    $user = User::factory()->create();
    createCartWithItems($user, 1);

    $otherUser = User::factory()->create();
    createCartWithItems($otherUser, 3);

    $response = $this->actingAs($user)->get(route('cart.index'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Cart/Index')
        ->has('cart.order_items', 1)
    );
});

test('guests cannot view the cart', function () {
    assertGuestCannotAccessResource('get', route('cart.index'));
});

// store

test('a user can add a product to their cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 15, 'stock' => 10]);

    $response = $this->actingAs($user)->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response->assertRedirect(route('cart.index'));
    $this->assertDatabaseHas('order_items', [
        'order_id' => $user->cart()->id,
        'product_id' => $product->id,
        'product_variant_id' => null,
        'quantity' => 2,
        'unit_price' => 15,
    ]);
});

test('adding a product variant uses the variant price', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 15, 'stock' => 10]);
    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => 25,
        'stock' => 10,
    ]);

    $response = $this->actingAs($user)->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 1,
    ]);

    $response->assertRedirect(route('cart.index'));
    $this->assertDatabaseHas('order_items', [
        'order_id' => $user->cart()->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'unit_price' => 25,
    ]);
});

test('adding a variant without its own price falls back to the product price', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 15, 'stock' => 10]);
    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => null,
        'stock' => 10,
    ]);

    $response = $this->actingAs($user)->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 1,
    ]);

    $response->assertRedirect(route('cart.index'));
    $this->assertDatabaseHas('order_items', [
        'order_id' => $user->cart()->id,
        'product_variant_id' => $variant->id,
        'unit_price' => 15,
    ]);
});

test('adding the same product twice increments the existing cart item instead of duplicating it', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 15, 'stock' => 10]);

    $this->actingAs($user)->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $response->assertRedirect(route('cart.index'));
    expect($user->cart()->orderItems()->count())->toBe(1);
    $this->assertDatabaseHas('order_items', [
        'order_id' => $user->cart()->id,
        'product_id' => $product->id,
        'quantity' => 5,
    ]);
});

test('adding the same product with a different variant creates a separate cart item', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 15, 'stock' => 10]);
    $variant = ProductVariant::factory()->create(['product_id' => $product->id, 'price' => 20, 'stock' => 10]);

    $this->actingAs($user)->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $this->actingAs($user)->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 1,
    ]);

    expect($user->cart()->orderItems()->count())->toBe(2);
});

test('adding an item to the cart does not affect another user\'s cart', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherCart = createCartWithItems($otherUser, 1);
    $product = Product::factory()->create(['price' => 15, 'stock' => 10]);

    $this->actingAs($user)->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    expect($otherCart->orderItems()->count())->toBe(1);
    expect($otherCart->orderItems()->where('product_id', $product->id)->exists())->toBeFalse();
});

test('adding an item requires a valid product_id and quantity', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('cart.items.store'), [
        'quantity' => 0,
    ]);

    $response->assertSessionHasErrors(['product_id', 'quantity']);
});

test('adding an item rejects a product_id that does not exist', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('cart.items.store'), [
        'product_id' => 999999,
        'quantity' => 1,
    ]);

    $response->assertSessionHasErrors('product_id');
});

test('guests cannot add an item to the cart', function () {
    $product = Product::factory()->create();

    assertGuestCannotAccessResource('post', route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ], fn () => $this->assertDatabaseMissing('order_items', ['product_id' => $product->id]));
});

// update

test('a user can update the quantity of their own cart item', function () {
    $user = User::factory()->create();
    $item = createCartItem($user, ['quantity' => 1, 'unit_price' => 20]);

    $response = $this->actingAs($user)->patch(route('cart.items.update', $item), [
        'quantity' => 4,
    ]);

    $response->assertRedirect(route('cart.index'));
    $this->assertDatabaseHas('order_items', [
        'id' => $item->id,
        'quantity' => 4,
        'unit_price' => 20,
    ]);
});

test('updating a cart item recalculates the unit price from its variant', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 20, 'stock' => 10]);
    $variant = ProductVariant::factory()->create(['product_id' => $product->id, 'price' => 30, 'stock' => 10]);
    $item = createCartItem($user, [
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 1,
        'unit_price' => 30,
    ]);

    $response = $this->actingAs($user)->patch(route('cart.items.update', $item), [
        'quantity' => 2,
    ]);

    $response->assertRedirect(route('cart.index'));
    $this->assertDatabaseHas('order_items', [
        'id' => $item->id,
        'quantity' => 2,
        'unit_price' => 30,
    ]);
});

test('updating a cart item requires a quantity of at least 1', function () {
    $user = User::factory()->create();
    $item = createCartItem($user, ['quantity' => 1]);

    $response = $this->actingAs($user)->patch(route('cart.items.update', $item), [
        'quantity' => 0,
    ]);

    $response->assertSessionHasErrors('quantity');
    $this->assertDatabaseHas('order_items', ['id' => $item->id, 'quantity' => 1]);
});

test('a user cannot update another user\'s cart item', function () {
    $owner = User::factory()->create();
    $item = createCartItem($owner, ['quantity' => 1, 'unit_price' => 20]);

    assertForeignUserCannotAccessResource('patch', route('cart.items.update', $item), $item, [
        'quantity' => 9,
    ], ['id' => $item->id, 'quantity' => 1]);
});

test('guests cannot update a cart item', function () {
    $owner = User::factory()->create();
    $item = createCartItem($owner, ['quantity' => 1]);

    assertGuestCannotAccessResource('patch', route('cart.items.update', $item), [
        'quantity' => 9,
    ], fn () => $this->assertDatabaseHas('order_items', ['id' => $item->id, 'quantity' => 1]));
});

// destroy

test('a user can delete their own cart item', function () {
    $user = User::factory()->create();
    $item = createCartItem($user);

    $response = $this->actingAs($user)->delete(route('cart.items.destroy', $item));

    $response->assertRedirect(route('cart.index'));
    $this->assertDatabaseMissing('order_items', ['id' => $item->id]);
});

test('a user cannot delete another user\'s cart item', function () {
    $owner = User::factory()->create();
    $item = createCartItem($owner);

    assertForeignUserCannotAccessResource('delete', route('cart.items.destroy', $item), $item);
});

test('guests cannot delete a cart item', function () {
    $owner = User::factory()->create();
    $item = createCartItem($owner);

    assertGuestCannotAccessResource('delete', route('cart.items.destroy', $item), [], fn () => $this->assertDatabaseHas('order_items', ['id' => $item->id]));
});

// clear

test('clearing the cart removes all of the user\'s cart items', function () {
    $user = User::factory()->create();
    $cart = createCartWithItems($user, 3);

    $response = $this->actingAs($user)->delete(route('cart.clear'));

    $response->assertRedirect(route('cart.index'));
    expect($cart->orderItems()->count())->toBe(0);
});

test('clearing an empty cart succeeds without error', function () {
    $user = User::factory()->create();
    $user->cart();

    $response = $this->actingAs($user)->delete(route('cart.clear'));

    $response->assertRedirect(route('cart.index'));
    expect($user->cart()->orderItems()->count())->toBe(0);
});

test('clearing the cart does not affect other users\' carts', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    createCartWithItems($user, 2);
    $otherCart = createCartWithItems($otherUser, 2);

    $this->actingAs($user)->delete(route('cart.clear'));

    expect($otherCart->orderItems()->count())->toBe(2);
});

test('guests cannot clear a cart', function () {
    assertGuestCannotAccessResource('delete', route('cart.clear'));
});
