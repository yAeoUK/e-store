<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    public function test_account_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/account/profile');

        $response->assertOk();
    }

    public function test_account_addresses_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/account/addresses');

        $response->assertOk();
    }

    public function test_account_orders_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/account/orders');

        $response->assertOk();
    }

    public function test_user_can_create_an_address(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post('/account/addresses', [
                'label' => 'Home',
                'name' => 'Jane Doe',
                'line1' => '123 Main St',
                'line2' => 'Apt 4',
                'city' => 'Springfield',
                'state' => 'IL',
                'postal_code' => '62704',
                'country' => 'US',
                'phone' => '555-0123',
                'is_default' => true,
            ]);

        $response
            ->assertRedirect('/account/addresses');

        $this->assertDatabaseHas('addresses', [
            'user_id' => $user->id,
            'label' => 'Home',
            'name' => 'Jane Doe',
            'line1' => '123 Main St',
            'city' => 'Springfield',
            'postal_code' => '62704',
            'country' => 'US',
            'is_default' => true,
        ]);
    }
}
