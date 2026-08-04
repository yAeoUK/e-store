<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalRevenue = (float) Order::query()
            ->where('status', OrderStatus::Completed)
            ->sum('total');

        $revenueByDay = Order::query()
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders_count')
            ->where('created_at', '>=', now()->subDays(30)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topCategories = Category::query()
            ->withCount('products')
            ->orderByDesc('products_count')
            ->limit(5)
            ->get(['id', 'name']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_products' => Product::count(),
                'total_categories' => Category::count(),
                'total_users' => User::count(),
                'low_stock_products' => Product::lowStock()->count(),
                'out_of_stock_products' => Product::outOfStock()->count(),
                'total_orders' => Order::count(),
                'total_revenue' => $totalRevenue,
            ],
            'revenueByDay' => $revenueByDay,
            'topCategories' => $topCategories,
        ]);
    }
}
