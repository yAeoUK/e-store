<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\AuthorizesUpdateVia;

class UpdateAddressRequest extends AddressRequest
{
    use AuthorizesUpdateVia;

    public function authorize(): bool
    {
        return $this->authorizeUpdate('address');
    }
}
