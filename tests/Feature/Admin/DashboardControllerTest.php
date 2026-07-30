<?php

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Carbon;

test('dashboard returns expected stats and revenue by day', function () {
    $admin = actingAsAdmin();

    User::factory()->count(2)->create();

    $category = Category::factory()->create();
    Product::factory()->count(2)->create(['category_id' => $category->id, 'stock' => 50]);
    Product::factory()->create(['category_id' => $category->id, 'stock' => 0]);
    Product::factory()->create(['category_id' => $category->id, 'stock' => 3]);

    $today = Carbon::now()->startOfDay();

    $customer = User::factory()->create();
    Order::factory()->create(['user_id' => $customer->id, 'status' => OrderStatus::Completed, 'total' => 100, 'created_at' => $today]);
    Order::factory()->create(['user_id' => $customer->id, 'status' => OrderStatus::Completed, 'total' => 50, 'created_at' => $today]);
    Order::factory()->create(['user_id' => $customer->id, 'status' => OrderStatus::Pending, 'total' => 25, 'created_at' => $today]);

    $response = $this->actingAs($admin)->withHeaders(inertiaHeaders())->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertJsonPath('component', 'Admin/Dashboard');
    $response->assertJsonPath('props.stats.total_products', 4);
    $response->assertJsonPath('props.stats.total_categories', 1);
    $response->assertJsonPath('props.stats.total_users', 4);
    $response->assertJsonPath('props.stats.out_of_stock_products', 1);
    $response->assertJsonPath('props.stats.low_stock_products', 1);
    $response->assertJsonPath('props.stats.total_orders', 3);
    $response->assertJsonPath('props.stats.total_revenue', 150);

    $revenueByDay = $response->json('props.revenueByDay');
    $todaysEntry = collect($revenueByDay)->firstWhere('date', $today->toDateString());
    expect((float) $todaysEntry['revenue'])->toBe(175.0);
    expect((int) $todaysEntry['orders_count'])->toBe(3);
});

test('non-admin cannot view the dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('admin.dashboard'))->assertForbidden();
});
