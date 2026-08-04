<?php

namespace App\Http\Controllers\Account;

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
        $orders = $request->user()->orders()
            ->where('status', '!=', OrderStatus::Cart)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Account/Orders', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $this->authorize('view', $order);
        abort_if($order->status === OrderStatus::Cart, 404);

        $order->load('orderItems');

        return Inertia::render('Account/Orders/Show', [
            'order' => $order,
        ]);
    }
}
