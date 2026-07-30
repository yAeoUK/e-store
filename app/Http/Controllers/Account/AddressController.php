<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        $addresses = $request->user()->addresses()->get([
            'id', 'label', 'name', 'line1', 'line2', 'city',
            'state', 'postal_code', 'country', 'phone', 'is_default',
        ]);

        return Inertia::render('Account/Addresses', [
            'addresses' => $addresses,
        ]);
    }

    public function store(StoreAddressRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $shouldBeDefault = ! empty($data['is_default']);
        unset($data['is_default']);

        DB::transaction(function () use ($data, $shouldBeDefault, $request) {
            $address = $request->user()->addresses()->create($data);

            if ($shouldBeDefault) {
                $address->makeDefault();
            }
        });

        return redirect()->route('account.addresses.index');
    }

    public function update(UpdateAddressRequest $request, Address $address): RedirectResponse
    {
        $data = $request->validated();
        $shouldBeDefault = ! empty($data['is_default']);
        // An address can't be un-defaulted directly - only replaced by marking another one
        // default via makeDefault() - otherwise the user could end up with no default address.
        unset($data['is_default']);

        DB::transaction(function () use ($data, $shouldBeDefault, $address) {
            $address->update($data);

            if ($shouldBeDefault) {
                $address->makeDefault();
            }
        });

        return redirect()->route('account.addresses.index');
    }

    public function destroy(Address $address): RedirectResponse
    {
        $this->authorize('delete', $address);

        $address->delete();

        return redirect()->route('account.addresses.index');
    }

    public function setDefault(Address $address): RedirectResponse
    {
        $this->authorize('update', $address);

        $address->makeDefault();

        return redirect()->route('account.addresses.index');
    }
}
