<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Concerns\FiltersIndexRequests;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Services\Stripe\RefundCreator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Exception\ApiErrorException;

class OrderController extends Controller
{
    use FiltersIndexRequests;

    public function index(Request $request): Response
    {
        $query = Order::query()
            ->where('status', '!=', OrderStatus::Cart)
            ->select(['id', 'user_id', 'status', 'total', 'payment_method', 'payment_status', 'admin_note', 'created_at'])
            ->with('user:id,name,email');

        $this->applySearchFilter($query, $request, function ($q, $search): void {
            $q->whereHas('user', function ($q2) use ($search): void {
                $q2->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('admin_note', 'like', "%{$search}%")
                ->orWhere('customer_note', 'like', "%{$search}%");
        });

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->value());
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->string('date_from')->value());
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->string('date_to')->value());
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $this->requestFilters($request, [
                'search' => 'string',
                'user_id' => 'integer',
                'status' => 'string',
                'date_from' => 'string',
                'date_to' => 'string',
            ]),
        ]);
    }

    public function show(Order $order): Response
    {
        abort_if($order->status === OrderStatus::Cart, 404);

        $order->load(['user:id,name,email', 'orderItems']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'allowed_transitions' => array_map(
                fn (OrderStatus $status) => $status->value,
                $order->status->allowedTransitions(),
            ),
        ]);
    }

    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $newStatus = OrderStatus::from($data['status']);

            abort_unless($order->status->canTransitionTo($newStatus), 422, 'Invalid status transition.');

            $order->status = $newStatus;
        }

        if (array_key_exists('admin_note', $data)) {
            $order->admin_note = $data['admin_note'];
        }

        $order->save();

        return redirect()->route('admin.orders.show', $order);
    }

    public function refund(Order $order): RedirectResponse
    {
        abort_unless($order->payment_status === PaymentStatus::Paid, 422, 'Only paid orders can be refunded.');

        if ($order->payment_method === PaymentMethod::Stripe) {
            try {
                app(RefundCreator::class)->createForOrder($order);
            } catch (ApiErrorException $e) {
                return back()->withErrors(['refund' => $e->getMessage()]);
            }
        }

        $order->update(['payment_status' => PaymentStatus::Refunded]);

        return redirect()->route('admin.orders.show', $order);
    }
}
