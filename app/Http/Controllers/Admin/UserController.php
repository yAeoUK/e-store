<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\FiltersIndexRequests;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    use FiltersIndexRequests;

    public function index(Request $request): Response
    {
        $query = User::query()
            ->select(['id', 'name', 'email', 'created_at'])
            ->withCount('orders');

        $this->applySearchFilter($query, $request, function ($q, $search): void {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });

        $users = $query->latest()->paginate(15)->withQueryString();

        $users->getCollection()->transform(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'created_at' => $user->created_at,
            'orders_count' => $user->orders_count,
            'is_admin' => $user->hasRole('admin'),
        ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $this->requestFilters($request, [
                'search' => 'string',
            ]),
        ]);
    }
}
