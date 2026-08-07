<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Address;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;

class E2eSeeder extends Seeder
{
    /**
     * Seed deterministic data for the Playwright e2e suite: known users,
     * a small category/product catalog with images and variants, saved
     * addresses, and order history - so every feature area's spec file has
     * fixed slugs/emails/SKUs to select on instead of random factory output.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $customer = User::factory()->create([
            'name' => 'E2E Customer',
            'email' => 'e2e-customer@example.com',
        ]);

        // Kept separate from the customer above so the "abandoned cart" test
        // can assert on a user who has never placed a real order.
        User::factory()->create([
            'name' => 'E2E Cart Abandoner',
            'email' => 'e2e-cart-abandoner@example.com',
        ]);

        $admin = User::factory()->create([
            'name' => 'E2E Admin',
            'email' => 'e2e-admin@example.com',
        ]);
        $admin->assignRole('admin');

        // Kept separate from the customer above so the addresses feature's
        // spec file has existing rows to edit/delete/set-default, without
        // disturbing the checkout spec's "no saved addresses yet" scenario.
        $addressOwner = User::factory()->create([
            'name' => 'E2E Address Owner',
            'email' => 'e2e-address-owner@example.com',
        ]);
        Address::factory()->create([
            'user_id' => $addressOwner->id,
            'label' => 'Home',
            'line1' => '1 Existing Home Street',
            'city' => 'Testville',
            'is_default' => true,
        ]);
        Address::factory()->create([
            'user_id' => $addressOwner->id,
            'label' => 'Work',
            'line1' => '2 Existing Work Avenue',
            'city' => 'Testville',
            'is_default' => false,
        ]);

        // A plain non-admin user, distinct from the ones above, for the
        // admin "promote user to admin" / "revoke admin" tests.
        User::factory()->create([
            'name' => 'E2E Promotable User',
            'email' => 'e2e-promotable@example.com',
        ]);

        $category = Category::factory()->create([
            'name' => 'E2E Category',
            'slug' => 'e2e-category',
        ]);
        $subCategory = Category::factory()->create([
            'name' => 'E2E Subcategory',
            'slug' => 'e2e-subcategory',
            'parent_id' => $category->id,
        ]);
        $categoryTwo = Category::factory()->create([
            'name' => 'E2E Category Two',
            'slug' => 'e2e-category-two',
        ]);

        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'E2E Test Product',
            'slug' => 'e2e-test-product',
            'price' => 50,
            'is_active' => true,
            'stock' => 20,
        ]);
        ProductImage::factory()->create([
            'product_id' => $product->id,
            'is_primary' => true,
            'sort_order' => 0,
        ]);
        ProductImage::factory()->create([
            'product_id' => $product->id,
            'is_primary' => false,
            'sort_order' => 1,
        ]);
        ProductVariant::factory()->create([
            'product_id' => $product->id,
            'sku' => 'E2E-VARIANT',
            'options' => ['size' => 'M'],
            'price' => 55,
            'stock' => 10,
            'is_active' => true,
        ]);

        // Low-stock (below Product::LOW_STOCK_THRESHOLD = 5), lives in the
        // second top-level category for cross-category filtering tests.
        Product::factory()->create([
            'category_id' => $categoryTwo->id,
            'name' => 'E2E Second Product',
            'slug' => 'e2e-second-product',
            'price' => 25,
            'is_active' => true,
            'stock' => 3,
        ]);

        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'E2E Out Of Stock Product',
            'slug' => 'e2e-out-of-stock-product',
            'price' => 15,
            'is_active' => true,
            'stock' => 0,
        ]);

        // Inactive - must never appear in storefront listings/search, only
        // in the admin product list.
        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'E2E Inactive Product',
            'slug' => 'e2e-inactive-product',
            'price' => 99,
            'is_active' => false,
            'stock' => 10,
        ]);

        // Bulk filler so the storefront's 12-per-page pagination has a
        // second page to click through.
        Product::factory()->count(15)->create([
            'category_id' => $category->id,
        ]);

        // Kept separate from both the checkout-flow customer and the
        // address-owner customer so admin order search/filter tests have
        // pre-existing, non-cart order history to assert on without a live
        // checkout run muddying the picture.
        $orderHistoryCustomer = User::factory()->create([
            'name' => 'E2E Order History Customer',
            'email' => 'e2e-order-history@example.com',
        ]);

        $this->seedHistoricalOrder($orderHistoryCustomer, $product, OrderStatus::Completed, PaymentStatus::Paid, 199.99);
        $this->seedHistoricalOrder($orderHistoryCustomer, $product, OrderStatus::Processing, PaymentStatus::Paid, 89.50);
        $this->seedHistoricalOrder($orderHistoryCustomer, $product, OrderStatus::Cancelled, PaymentStatus::Unpaid, 45.00);
        $this->seedHistoricalOrder($customer, $product, OrderStatus::Completed, PaymentStatus::Paid, 150.00);

        // Kept separate from the order-history customer above so the admin
        // order-management spec (status transitions, admin note, refund) can
        // freely mutate its own rows without corrupting the exact
        // status/payment counts the order-history search test asserts on.
        $orderManagementCustomer = User::factory()->create([
            'name' => 'E2E Order Management Customer',
            'email' => 'e2e-order-management@example.com',
        ]);

        $this->seedHistoricalOrder($orderManagementCustomer, $product, OrderStatus::Pending, PaymentStatus::Unpaid, 75.00);
        $this->seedHistoricalOrder($orderManagementCustomer, $product, OrderStatus::Processing, PaymentStatus::Paid, 60.00);
    }

    private function seedHistoricalOrder(User $user, Product $product, OrderStatus $status, PaymentStatus $paymentStatus, float $total): void
    {
        $order = Order::factory()->for($user)->create([
            'status' => $status,
            'payment_method' => PaymentMethod::Cod,
            'payment_status' => $paymentStatus,
            'total' => $total,
        ]);

        OrderItem::factory()->for($order)->create([
            'product_id' => $product->id,
            'product_variant_id' => null,
            'quantity' => 1,
            'unit_price' => $total,
            'product_snapshot' => OrderItem::buildProductSnapshot($product, null),
        ]);
    }
}
