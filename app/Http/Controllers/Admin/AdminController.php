<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PromoteUserRequest;
use App\Http\Requests\Admin\StoreAdminRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Admins/Index', [
            'admins' => User::role('admin')
                ->select(['id', 'name', 'email', 'created_at'])
                ->latest()
                ->paginate(15),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Admins/Create');
    }

    public function promote(PromoteUserRequest $request): RedirectResponse
    {
        $user = User::where('email', $request->validated('email'))->firstOrFail();

        $user->assignRole('admin');

        return redirect()->route('admin.admins.index');
    }

    public function store(StoreAdminRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $user = User::create([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'password' => Hash::make($request->validated('password')),
            ]);

            $user->forceFill(['email_verified_at' => now()])->save();
            $user->assignRole('admin');
        });

        return redirect()->route('admin.admins.index');
    }

    public function revoke(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return redirect()->route('admin.admins.index')->withErrors([
                'admin' => __('admin.admins.cannot_revoke_self'),
            ]);
        }

        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            return redirect()->route('admin.admins.index')->withErrors([
                'admin' => __('admin.admins.at_least_one_required'),
            ]);
        }

        $user->removeRole('admin');

        return redirect()->route('admin.admins.index');
    }
}
