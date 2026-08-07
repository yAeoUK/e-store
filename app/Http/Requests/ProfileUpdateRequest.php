<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\SharedRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use SharedRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->nameEmailPasswordRules(
            includePassword: false,
            emailUnique: $this->uniqueIgnoring(User::class, $this->user()->id),
        );
    }
}
