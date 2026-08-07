<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        $addresses = $request->user()->addresses()->get(Address::DISPLAY_COLUMNS);

        return Inertia::render('Account/Addresses', [
            'addresses' => $addresses,
        ]);
    }

    public function store(StoreAddressRequest $request): RedirectResponse
    {
        $this->saveWithDefault($request->validated(), fn (array $data): Address => $request->user()->addresses()->create($data));

        return redirect()->route('account.addresses.index');
    }

    public function update(UpdateAddressRequest $request, Address $address): RedirectResponse
    {
        // An address can't be un-defaulted directly - only replaced by marking another one
        // default via makeDefault() - otherwise the user could end up with no default address.
        $this->saveWithDefault($request->validated(), function (array $data) use ($address): Address {
            $address->update($data);

            return $address;
        });

        return redirect()->route('account.addresses.index');
    }

    /**
     * Persist $data via $save, then make the resulting address the user's default if requested.
     *
     * @param  array<string, mixed>  $data
     */
    private function saveWithDefault(array $data, Closure $save): void
    {
        $shouldBeDefault = ! empty($data['is_default']);
        unset($data['is_default']);

        DB::transaction(function () use ($data, $shouldBeDefault, $save): void {
            $address = $save($data);

            if ($shouldBeDefault) {
                $address->makeDefault();
            }
        });
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
