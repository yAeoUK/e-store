<?php

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Address;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\Stripe\CheckoutSessionCreator;
use Inertia\Testing\AssertableInertia;
use Stripe\Checkout\Session;

function createCartWithItem(User $user, int $quantity = 2): Order
{
    $product = Product::factory()->create(['price' => 20, 'stock' => 10]);
    $cart = $user->cart();
    OrderItem::factory()->create([
        'order_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => $quantity,
    ]);

    return $cart;
}

// index

test('checkout index renders the Checkout/Index page with the user\'s cart and addresses', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    createCartWithItem($user);

    $response = $this->actingAs($user)->get(route('checkout.index'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Checkout/Index')
        ->has('cart.order_items', 1)
        ->has('addresses', 1)
        ->where('addresses.0.id', $address->id)
    );
});

test('checkout index only includes the authenticated user\'s addresses', function () {
    $user = User::factory()->create();
    Address::factory()->create(['user_id' => $user->id]);
    createCartWithItem($user);

    $otherUser = User::factory()->create();
    Address::factory()->count(3)->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get(route('checkout.index'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Checkout/Index')
        ->has('addresses', 1)
    );
});

test('guests cannot view the checkout page', function () {
    $response = $this->get(route('checkout.index'));

    $response->assertRedirect(route('login'));
});

// store

test('checking out with cash on delivery creates an unpaid pending order', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    createCartWithItem($user);

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    $order = $user->orders()->where('status', '!=', 'cart')->firstOrFail();

    $response->assertRedirect(route('account.orders.show', $order));
    expect($order->payment_method)->toBe(PaymentMethod::Cod);
    expect($order->payment_status)->toBe(PaymentStatus::Unpaid);
    expect($order->total)->toEqual('40.00');
});

test('checking out captures the shipping address snapshot from the selected address', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    createCartWithItem($user);

    $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    $order = $user->orders()->where('status', '!=', 'cart')->firstOrFail();

    expect($order->shipping_address_snapshot['name'])->toBe($address->name);
    expect($order->shipping_address_snapshot['line1'])->toBe($address->line1);
    expect($order->shipping_address_snapshot['city'])->toBe($address->city);
});

test('checking out decrements the product stock by the ordered quantity', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 20, 'stock' => 10]);
    OrderItem::factory()->create([
        'order_id' => $user->cart()->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    expect($product->fresh()->stock)->toBe(7);
});

test('checking out with a product variant decrements the variant stock and snapshots its sku and options', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 20, 'stock' => 10]);
    $variant = ProductVariant::factory()->create([
        'product_id' => $product->id,
        'price' => 30,
        'stock' => 5,
        'sku' => 'SKU-123',
        'options' => ['color' => 'red'],
    ]);
    $item = OrderItem::factory()->create([
        'order_id' => $user->cart()->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 2,
    ]);

    $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    $order = $user->orders()->where('status', '!=', 'cart')->firstOrFail();

    expect($variant->fresh()->stock)->toBe(3);
    expect($product->fresh()->stock)->toBe(10);
    expect($order->total)->toEqual('60.00');
    expect($item->fresh()->unit_price)->toEqual('30.00');
    expect($item->fresh()->product_snapshot['variant'])->toBe([
        'sku' => 'SKU-123',
        'options' => ['color' => 'red'],
    ]);
});

test('checking out snapshots the product\'s category', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $category = Category::factory()->create();
    $product = Product::factory()->create(['price' => 20, 'stock' => 10, 'category_id' => $category->id]);
    $item = OrderItem::factory()->create([
        'order_id' => $user->cart()->id,
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    expect($item->fresh()->product_snapshot['category'])->toBe([
        'name' => $category->name,
        'slug' => $category->slug,
    ]);
});

test('checking out sums the total across multiple cart items', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $cart = $user->cart();
    OrderItem::factory()->create([
        'order_id' => $cart->id,
        'product_id' => Product::factory()->create(['price' => 20, 'stock' => 10]),
        'quantity' => 2,
    ]);
    OrderItem::factory()->create([
        'order_id' => $cart->id,
        'product_id' => Product::factory()->create(['price' => 15, 'stock' => 10]),
        'quantity' => 3,
    ]);

    $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    $order = $user->orders()->where('status', '!=', 'cart')->firstOrFail();

    expect($order->total)->toEqual('85.00');
});

test('checkout fails when the cart is empty', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $user->cart();

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    $response->assertStatus(422);
});

test('checkout fails when the requested quantity exceeds the product stock', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 20, 'stock' => 2]);
    OrderItem::factory()->create([
        'order_id' => $user->cart()->id,
        'product_id' => $product->id,
        'quantity' => 5,
    ]);

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    $response->assertStatus(422);
    expect($product->fresh()->stock)->toBe(2);
    expect($user->orders()->where('status', '!=', 'cart')->exists())->toBeFalse();
});

test('checkout fails when the requested quantity exceeds the variant stock', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $product = Product::factory()->create(['price' => 20, 'stock' => 10]);
    $variant = ProductVariant::factory()->create(['product_id' => $product->id, 'price' => 25, 'stock' => 1]);
    OrderItem::factory()->create([
        'order_id' => $user->cart()->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 3,
    ]);

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    $response->assertStatus(422);
    expect($variant->fresh()->stock)->toBe(1);
    expect($user->orders()->where('status', '!=', 'cart')->exists())->toBeFalse();
});

test('checking out with stripe creates a checkout session and redirects to it', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    createCartWithItem($user);

    $fakeSession = Session::constructFrom([
        'id' => 'cs_test_123',
        'url' => 'https://checkout.stripe.com/pay/cs_test_123',
    ]);

    $this->mock(CheckoutSessionCreator::class, function ($mock) use ($fakeSession) {
        $mock->shouldReceive('createForOrder')->once()->andReturn($fakeSession);
    });

    $response = $this->actingAs($user)->withHeaders(inertiaHeaders())->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'stripe',
    ]);

    $order = $user->orders()->where('status', '!=', 'cart')->firstOrFail();

    $response->assertStatus(409);
    $response->assertHeader('X-Inertia-Location', $fakeSession->url);
    expect($order->payment_method)->toBe(PaymentMethod::Stripe);
    expect($order->payment_status)->toBe(PaymentStatus::Unpaid);
    expect($order->stripe_checkout_session_id)->toBe('cs_test_123');
});

test('checkout requires a payment method', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    createCartWithItem($user);

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
    ]);

    $response->assertSessionHasErrors('payment_method');
});

test('checkout rejects an invalid payment method', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    createCartWithItem($user);

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'bitcoin',
    ]);

    $response->assertSessionHasErrors('payment_method');
});

test('checkout requires an address_id', function () {
    $user = User::factory()->create();
    createCartWithItem($user);

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'payment_method' => 'cod',
    ]);

    $response->assertForbidden();
});

test('checkout rejects an address that belongs to another user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherAddress = Address::factory()->create(['user_id' => $otherUser->id]);
    createCartWithItem($user);

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $otherAddress->id,
        'payment_method' => 'cod',
    ]);

    $response->assertForbidden();
    expect($user->orders()->where('status', '!=', 'cart')->exists())->toBeFalse();
});

test('checking out never touches another user\'s cart', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);

    $otherUser = User::factory()->create();
    $otherProduct = Product::factory()->create(['price' => 20, 'stock' => 10]);
    $otherCart = $otherUser->cart();
    OrderItem::factory()->create([
        'order_id' => $otherCart->id,
        'product_id' => $otherProduct->id,
        'quantity' => 2,
    ]);

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    $response->assertStatus(422);
    expect($otherCart->fresh()->status)->toBe(\App\Enums\OrderStatus::Cart);
    expect($otherProduct->fresh()->stock)->toBe(10);
    expect($otherUser->orders()->where('status', '!=', 'cart')->exists())->toBeFalse();
});

test('guests cannot check out', function () {
    $address = Address::factory()->create();

    $response = $this->post(route('checkout.store'), [
        'address_id' => $address->id,
        'payment_method' => 'cod',
    ]);

    $response->assertRedirect(route('login'));
});

// stripeReturn

test('stripe return marks the order paid when the session is paid', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);
    $order = createCartWithItem($user);
    $order->forceFill([
        'status' => 'pending',
        'payment_method' => PaymentMethod::Stripe,
        'payment_status' => PaymentStatus::Unpaid,
        'stripe_checkout_session_id' => 'cs_test_123',
        'shipping_address_snapshot' => ['name' => $address->name],
    ])->save();

    $fakeSession = Session::constructFrom([
        'id' => 'cs_test_123',
        'payment_status' => 'paid',
    ]);

    $this->mock(CheckoutSessionCreator::class, function ($mock) use ($fakeSession) {
        $mock->shouldReceive('retrieve')->once()->with('cs_test_123')->andReturn($fakeSession);
    });

    $response = $this->actingAs($user)->get(route('checkout.stripe.return', [
        'order' => $order,
        'session_id' => 'cs_test_123',
    ]));

    $response->assertRedirect(route('account.orders.show', $order));

    $order->refresh();
    expect($order->payment_status)->toBe(PaymentStatus::Paid);
    expect($order->status->value)->toBe('processing');
    expect($order->paid_at)->not->toBeNull();
});

test('stripe return does not mark the order paid when the session is not paid', function () {
    $user = User::factory()->create();
    $order = createCartWithItem($user);
    $order->forceFill([
        'status' => 'pending',
        'payment_method' => PaymentMethod::Stripe,
        'payment_status' => PaymentStatus::Unpaid,
        'stripe_checkout_session_id' => 'cs_test_123',
    ])->save();

    $fakeSession = Session::constructFrom([
        'id' => 'cs_test_123',
        'payment_status' => 'unpaid',
    ]);

    $this->mock(CheckoutSessionCreator::class, function ($mock) use ($fakeSession) {
        $mock->shouldReceive('retrieve')->once()->with('cs_test_123')->andReturn($fakeSession);
    });

    $response = $this->actingAs($user)->get(route('checkout.stripe.return', [
        'order' => $order,
        'session_id' => 'cs_test_123',
    ]));

    $response->assertRedirect(route('account.orders.show', $order));

    $order->refresh();
    expect($order->payment_status)->toBe(PaymentStatus::Unpaid);
    expect($order->status->value)->toBe('pending');
    expect($order->paid_at)->toBeNull();
});

test('stripe return does not confirm payment when the session_id does not match the order\'s stored session', function () {
    $user = User::factory()->create();
    $order = createCartWithItem($user);
    $order->forceFill([
        'status' => 'pending',
        'payment_method' => PaymentMethod::Stripe,
        'payment_status' => PaymentStatus::Unpaid,
        'stripe_checkout_session_id' => 'cs_test_123',
    ])->save();

    $this->mock(CheckoutSessionCreator::class, function ($mock) {
        $mock->shouldReceive('retrieve')->never();
    });

    $response = $this->actingAs($user)->get(route('checkout.stripe.return', [
        'order' => $order,
        'session_id' => 'cs_test_different',
    ]));

    $response->assertRedirect(route('account.orders.show', $order));

    $order->refresh();
    expect($order->payment_status)->toBe(PaymentStatus::Unpaid);
});

test('stripe return does not re-confirm an already paid order', function () {
    $user = User::factory()->create();
    $order = createCartWithItem($user);
    $paidAt = now()->subDay();
    $order->forceFill([
        'status' => 'processing',
        'payment_method' => PaymentMethod::Stripe,
        'payment_status' => PaymentStatus::Paid,
        'stripe_checkout_session_id' => 'cs_test_123',
        'paid_at' => $paidAt,
    ])->save();

    $this->mock(CheckoutSessionCreator::class, function ($mock) {
        $mock->shouldReceive('retrieve')->never();
    });

    $response = $this->actingAs($user)->get(route('checkout.stripe.return', [
        'order' => $order,
        'session_id' => 'cs_test_123',
    ]));

    $response->assertRedirect(route('account.orders.show', $order));

    $order->refresh();
    expect($order->paid_at->format('Y-m-d H:i:s'))->toBe($paidAt->format('Y-m-d H:i:s'));
});

test('stripe return does not let a user confirm another user\'s order', function () {
    $user = User::factory()->create();
    $owner = User::factory()->create();
    $order = createCartWithItem($owner);
    $order->forceFill([
        'status' => 'pending',
        'payment_method' => PaymentMethod::Stripe,
        'payment_status' => PaymentStatus::Unpaid,
        'stripe_checkout_session_id' => 'cs_test_123',
    ])->save();

    $this->actingAs($user)
        ->get(route('checkout.stripe.return', ['order' => $order, 'session_id' => 'cs_test_123']))
        ->assertForbidden();
});

test('guests cannot access the stripe return endpoint', function () {
    $owner = User::factory()->create();
    $order = createCartWithItem($owner);
    $order->forceFill([
        'status' => 'pending',
        'payment_method' => PaymentMethod::Stripe,
        'payment_status' => PaymentStatus::Unpaid,
        'stripe_checkout_session_id' => 'cs_test_123',
    ])->save();

    $response = $this->get(route('checkout.stripe.return', ['order' => $order, 'session_id' => 'cs_test_123']));

    $response->assertRedirect(route('login'));
});
