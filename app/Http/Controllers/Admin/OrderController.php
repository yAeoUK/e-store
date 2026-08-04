<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::query()
            ->where('status', '!=', OrderStatus::Cart)
            ->select(['id', 'user_id', 'status', 'total', 'payment_method', 'payment_status', 'created_at'])
            ->with('user:id,name,email');

        if ($request->filled('search')) {
            $search = $request->string('search')->trim();
            $query->whereHas('user', function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $request->string('search')->value() ?: null,
                'user_id' => $request->integer('user_id') ?: null,
            ],
        ]);
    }
}
