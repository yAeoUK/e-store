<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(15)->create();

        $users = User::all();
        $products = Product::all();

        if ($products->isEmpty()) {
            return;
        }

        for ($i = 0; $i < 150; $i++) {
            $createdAt = Carbon::now()->subDays(random_int(0, 60))->subHours(random_int(0, 23));

            $order = Order::factory()->for($users->random())->create();

            $itemsTotal = collect(range(1, random_int(1, 4)))
                ->map(function () use ($order, $products, $createdAt) {
                    $item = OrderItem::factory()
                        ->for($order)
                        ->for($products->random())
                        ->create();

                    $item->forceFill(['created_at' => $createdAt, 'updated_at' => $createdAt])->save();

                    return $item->quantity * $item->unit_price;
                })
                ->sum();

            $order->forceFill([
                'total' => $itemsTotal,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ])->save();
        }
    }
}
