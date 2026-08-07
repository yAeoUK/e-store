<?php

namespace App\Http\Requests;

use App\Enums\OrderStatus;
use App\Http\Requests\Concerns\SharedRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    use SharedRules;

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'status' => $this->withSometimes(['required', Rule::enum(OrderStatus::class)->except(OrderStatus::Cart)], sometimes: true),
            'admin_note' => $this->withSometimes(['nullable', 'string', 'max:2000'], sometimes: true),
        ];
    }
}
