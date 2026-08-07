<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\AuthorizesUpdateVia;
use App\Http\Requests\Concerns\SharedRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
{
    use AuthorizesUpdateVia;
    use SharedRules;

    public function authorize(): bool
    {
        return $this->authorizeUpdate('orderItem');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'quantity' => $this->quantityRule(),
        ];
    }
}
