<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Faker\Provider\en_US\Address as AddressProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    protected $model = Address::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'label' => $this->faker->randomElement(['Home', 'Work', null]),
            'name' => $this->faker->name(),
            'line1' => $this->faker->streetAddress(),
            'line2' => $this->faker->boolean() ? AddressProvider::secondaryAddress() : null,
            'city' => $this->faker->city(),
            'state' => AddressProvider::state(),
            'postal_code' => $this->faker->postcode(),
            'country' => 'US',
            'phone' => $this->faker->phoneNumber(),
            'is_default' => false,
        ];
    }
}
