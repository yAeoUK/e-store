<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        $addresses = $request->user()->addresses()->get();

        return Inertia::render('Account/Addresses', [
            'addresses' => $addresses,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => ['nullable', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'line1' => ['required', 'string', 'max:255'],
            'line2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:64'],
            'country' => ['required', 'string', 'max:64'],
            'phone' => ['nullable', 'string', 'max:64'],
            'is_default' => ['nullable', 'boolean'],
        ]);

        $user = $request->user();

        DB::transaction(function () use ($data, $user) {
            if (!empty($data['is_default'])) {
                $user->addresses()->update(['is_default' => false]);
            }

            $user->addresses()->create($data);
        });

        return redirect()->route('account.addresses.index');
    }

    public function update(Request $request, Address $address)
    {
        if ($request->user()->id !== $address->user_id) {
            abort(403);
        }

        $data = $request->validate([
            'label' => ['nullable', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'line1' => ['required', 'string', 'max:255'],
            'line2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:64'],
            'country' => ['required', 'string', 'max:64'],
            'phone' => ['nullable', 'string', 'max:64'],
            'is_default' => ['nullable', 'boolean'],
        ]);

        DB::transaction(function () use ($data, $request, $address) {
            if (!empty($data['is_default'])) {
                $request->user()->addresses()->update(['is_default' => false]);
            }

            $address->update($data);
        });

        return redirect()->route('account.addresses.index');
    }

    public function destroy(Request $request, Address $address)
    {
        if ($request->user()->id !== $address->user_id) {
            abort(403);
        }

        $address->delete();

        return redirect()->route('account.addresses.index');
    }

    public function setDefault(Request $request, Address $address)
    {
        if ($request->user()->id !== $address->user_id) {
            abort(403);
        }

        DB::transaction(function () use ($request, $address) {
            $request->user()->addresses()->update(['is_default' => false]);
            $address->update(['is_default' => true]);
        });

        return redirect()->route('account.addresses.index');
    }
}
