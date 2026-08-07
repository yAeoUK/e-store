<?php

namespace App\Models;

use App\Models\Concerns\HasExclusiveFlag;
use Database\Factories\AddressFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    /** @use HasFactory<AddressFactory> */
    use HasExclusiveFlag, HasFactory;

    /**
     * Columns safe to expose to the frontend (id + all fillable fields).
     *
     * @var list<string>
     */
    public const DISPLAY_COLUMNS = [
        'id',
        'label',
        'name',
        'line1',
        'line2',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'is_default',
    ];

    protected $fillable = [
        'label',
        'name',
        'line1',
        'line2',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Make this the user's one and only default address.
     */
    public function makeDefault(): void
    {
        $this->makeExclusive('is_default', 'user_id');
    }
}
