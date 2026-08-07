<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use App\Services\Stripe\RefundCreator;
use Stripe\Refund;

test('admin can list orders with the customer eager-loaded', function () {
    $customer = User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
    Order::factory()->create(['user_id' => $customer->id]);

    $response = assertAdminIndexRenders('admin.orders.index', 'Admin/Orders/Index', 'orders', 1);

    $response->assertJsonPath('props.orders.data.0.user.name', 'Jane Doe');
});

test('admin orders index paginates results instead of loading them all at once', function () {
    assertIndexPaginates('admin.orders.index', 'orders', fn () => Order::factory()->count(20)->create());
});

test('admin can filter orders by user_id', function () {
    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();
    Order::factory()->create(['user_id' => $customer->id]);
    Order::factory()->create(['user_id' => $otherCustomer->id]);

    assertAdminIndexFiltersBy('admin.orders.index', 'orders', ['user_id' => $customer->id], 'user_id', $customer->id);
});

test('admin can search orders by customer name or email', function () {
    $customer = User::factory()->create(['name' => 'Searchable Customer']);
    Order::factory()->create(['user_id' => $customer->id]);
    Order::factory()->create(['user_id' => User::factory()->create(['name' => 'Someone Else'])->id]);

    assertAdminIndexFiltersBy('admin.orders.index', 'orders', ['search' => 'Searchable']);
});

test('admin can search orders by customer email', function () {
    $customer = User::factory()->create(['email' => 'searchable@example.com']);
    Order::factory()->create(['user_id' => $customer->id]);
    Order::factory()->create(['user_id' => User::factory()->create(['email' => 'someoneelse@example.com'])->id]);

    assertAdminIndexFiltersBy('admin.orders.index', 'orders', ['search' => 'searchable@'], 'user_id', $customer->id);
});

test('non-admin cannot list orders', function () {
    assertNonAdminCannotView('admin.orders.index');
});

test('guests cannot list orders', function () {
    assertGuestCannotAccessResource('get', route('admin.orders.index'));
});

test('admin orders index excludes carts', function () {
    $admin = actingAsAdmin();
    $customer = User::factory()->create();
    $customer->cart();
    Order::factory()->create(['user_id' => $customer->id]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.orders.index'));

    $response->assertOk();
    $response->assertJsonCount(1, 'props.orders.data');
});

test('admin can search orders by admin note', function () {
    Order::factory()->create(['admin_note' => 'Gift wrap requested']);
    Order::factory()->create(['admin_note' => 'Nothing special']);

    assertAdminIndexFiltersBy('admin.orders.index', 'orders', ['search' => 'Gift wrap']);
});

test('admin can search orders by customer note', function () {
    Order::factory()->create(['customer_note' => 'Leave at the back door']);
    Order::factory()->create(['customer_note' => 'Nothing special']);

    assertAdminIndexFiltersBy('admin.orders.index', 'orders', ['search' => 'back door']);
});

test('admin order detail page includes the customer note', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create(['customer_note' => 'Ring the doorbell twice']);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.orders.show', $order));

    $response->assertOk();
    $response->assertJsonPath('props.order.customer_note', 'Ring the doorbell twice');
});

test('admin cannot modify the customer note through the update endpoint', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create([
        'status' => OrderStatus::Pending,
        'customer_note' => 'Original customer note',
    ]);

    $this->actingAs($admin)->patch(route('admin.orders.update', $order), [
        'admin_note' => 'Internal note',
        'customer_note' => 'Tampered note',
    ]);

    expect($order->fresh())
        ->customer_note->toBe('Original customer note')
        ->admin_note->toBe('Internal note');
});

test('admin can filter orders by status', function () {
    Order::factory()->create(['status' => OrderStatus::Pending]);
    Order::factory()->create(['status' => OrderStatus::Completed]);

    assertAdminIndexFiltersBy('admin.orders.index', 'orders', ['status' => 'pending'], 'status', 'pending');
});

test('admin can filter orders by date range', function () {
    $order = Order::factory()->create();
    $order->forceFill(['created_at' => '2026-01-01'])->save();
    $other = Order::factory()->create();
    $other->forceFill(['created_at' => '2026-06-01'])->save();

    assertAdminIndexFiltersBy('admin.orders.index', 'orders', ['date_from' => '2026-05-01', 'date_to' => '2026-07-01'], 'id', $other->id);
});

test('admin can view an order detail page', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create(['status' => OrderStatus::Pending]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.orders.show', $order));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Orders/Show');
    $response->assertJsonPath('props.order.id', $order->id);
    $response->assertJsonPath('props.allowed_transitions', ['processing', 'cancelled']);
});

test('order detail page 404s for a cart', function () {
    $admin = actingAsAdmin();
    $customer = User::factory()->create();
    $cart = $customer->cart();

    $this->actingAs($admin)->get(route('admin.orders.show', $cart))->assertNotFound();
});

test('non-admin cannot view order detail page', function () {
    $order = Order::factory()->create();

    assertNonAdminForbidden('get', route('admin.orders.show', $order));
});

test('guests cannot view order detail page', function () {
    $order = Order::factory()->create();

    assertGuestCannotAccessResource('get', route('admin.orders.show', $order));
});

test('admin can transition an order to an allowed status', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create(['status' => OrderStatus::Pending]);

    $response = $this->actingAs($admin)->patch(route('admin.orders.update', $order), ['status' => 'processing']);

    $response->assertRedirect(route('admin.orders.show', $order));
    expect($order->fresh()->status)->toBe(OrderStatus::Processing);
});

test('admin cannot transition an order to a disallowed status', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create(['status' => OrderStatus::Pending]);

    $response = $this->actingAs($admin)->patch(route('admin.orders.update', $order), ['status' => 'completed']);

    $response->assertStatus(422);
    expect($order->fresh()->status)->toBe(OrderStatus::Pending);
});

test('admin cannot set an order status to cart', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create(['status' => OrderStatus::Pending]);

    $response = $this->actingAs($admin)->patch(route('admin.orders.update', $order), ['status' => 'cart']);

    $response->assertInvalid('status');
});

test('admin can set an admin note without changing status', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create(['status' => OrderStatus::Pending]);

    $response = $this->actingAs($admin)->patch(route('admin.orders.update', $order), [
        'admin_note' => 'Called customer to confirm address',
    ]);

    $response->assertRedirect(route('admin.orders.show', $order));
    expect($order->fresh())
        ->status->toBe(OrderStatus::Pending)
        ->admin_note->toBe('Called customer to confirm address');
});

test('admin can update status and admin note together', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create(['status' => OrderStatus::Pending]);

    $this->actingAs($admin)->patch(route('admin.orders.update', $order), [
        'status' => 'cancelled',
        'admin_note' => 'Customer requested cancellation',
    ]);

    expect($order->fresh())
        ->status->toBe(OrderStatus::Cancelled)
        ->admin_note->toBe('Customer requested cancellation');
});

test('non-admin cannot update an order', function () {
    $order = Order::factory()->create(['status' => OrderStatus::Pending]);

    assertNonAdminForbidden('patch', route('admin.orders.update', $order), ['status' => 'processing']);
});

test('guests cannot update an order', function () {
    $order = Order::factory()->create(['status' => OrderStatus::Pending]);

    assertGuestCannotAccessResource('patch', route('admin.orders.update', $order), ['status' => 'processing']);
});

test('refunding a paid cod order flips payment status without calling stripe', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create([
        'payment_method' => PaymentMethod::Cod,
        'payment_status' => PaymentStatus::Paid,
    ]);

    $this->mock(RefundCreator::class, function ($mock) {
        $mock->shouldReceive('createForOrder')->never();
    });

    $response = $this->actingAs($admin)->post(route('admin.orders.refund', $order));

    $response->assertRedirect(route('admin.orders.show', $order));
    expect($order->fresh()->payment_status)->toBe(PaymentStatus::Refunded);
});

test('refunding a paid stripe order calls the Stripe refund API', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create([
        'payment_method' => PaymentMethod::Stripe,
        'payment_status' => PaymentStatus::Paid,
        'stripe_payment_intent_id' => 'pi_123',
    ]);

    $this->mock(RefundCreator::class, function ($mock) use ($order) {
        $mock->shouldReceive('createForOrder')->once()
            ->with(Mockery::on(fn (Order $o) => $o->is($order)))
            ->andReturn(Refund::constructFrom(['id' => 're_123']));
    });

    $response = $this->actingAs($admin)->post(route('admin.orders.refund', $order));

    $response->assertRedirect(route('admin.orders.show', $order));
    expect($order->fresh()->payment_status)->toBe(PaymentStatus::Refunded);
});

test('refunding an order that is not paid is rejected', function () {
    $admin = actingAsAdmin();
    $order = Order::factory()->create([
        'payment_method' => PaymentMethod::Cod,
        'payment_status' => PaymentStatus::Unpaid,
    ]);

    $this->actingAs($admin)->post(route('admin.orders.refund', $order))->assertStatus(422);
    expect($order->fresh()->payment_status)->toBe(PaymentStatus::Unpaid);
});

test('non-admin cannot refund an order', function () {
    $order = Order::factory()->create([
        'payment_method' => PaymentMethod::Cod,
        'payment_status' => PaymentStatus::Paid,
    ]);

    assertNonAdminForbidden('post', route('admin.orders.refund', $order));
});

test('guests cannot refund an order', function () {
    $order = Order::factory()->create([
        'payment_method' => PaymentMethod::Cod,
        'payment_status' => PaymentStatus::Paid,
    ]);

    assertGuestCannotAccessResource('post', route('admin.orders.refund', $order));
});
