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
            ->get('/profile');

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

    public function test_creating_a_second_default_address_unsets_the_first(): void
    {
        $user = User::factory()->create();
        $existing = Address::factory()->create(['user_id' => $user->id, 'is_default' => true]);

        $response = $this
            ->actingAs($user)
            ->post('/account/addresses', [
                'line1' => '456 Oak Ave',
                'city' => 'Metropolis',
                'postal_code' => '10001',
                'country' => 'US',
                'is_default' => true,
            ]);

        $response->assertRedirect('/account/addresses');

        $this->assertDatabaseHas('addresses', ['id' => $existing->id, 'is_default' => false]);
        $this->assertDatabaseHas('addresses', ['user_id' => $user->id, 'line1' => '456 Oak Ave', 'is_default' => true]);
    }

    public function test_user_can_update_an_address(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->patch("/account/addresses/{$address->id}", [
                'label' => 'Work',
                'name' => 'John Smith',
                'line1' => '789 Pine Rd',
                'city' => 'Gotham',
                'postal_code' => '20500',
                'country' => 'US',
            ]);

        $response->assertRedirect('/account/addresses');

        $this->assertDatabaseHas('addresses', [
            'id' => $address->id,
            'label' => 'Work',
            'name' => 'John Smith',
            'line1' => '789 Pine Rd',
            'city' => 'Gotham',
            'postal_code' => '20500',
        ]);
    }

    public function test_updating_an_address_requires_the_required_fields(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->patch("/account/addresses/{$address->id}", [
                'line1' => '',
                'city' => '',
                'postal_code' => '',
                'country' => '',
            ]);

        $response->assertSessionHasErrors(['line1', 'city', 'postal_code', 'country']);
    }

    public function test_setting_is_default_on_update_unsets_other_addresses(): void
    {
        $user = User::factory()->create();
        $current = Address::factory()->create(['user_id' => $user->id, 'is_default' => true]);
        $other = Address::factory()->create(['user_id' => $user->id, 'is_default' => false]);

        $response = $this
            ->actingAs($user)
            ->patch("/account/addresses/{$other->id}", [
                'line1' => '789 Pine Rd',
                'city' => 'Gotham',
                'postal_code' => '20500',
                'country' => 'US',
                'is_default' => true,
            ]);

        $response->assertRedirect('/account/addresses');

        $this->assertDatabaseHas('addresses', ['id' => $other->id, 'is_default' => true]);
        $this->assertDatabaseHas('addresses', ['id' => $current->id, 'is_default' => false]);
    }

    public function test_updating_another_users_address_is_forbidden(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $owner->id, 'line1' => 'Original Line']);

        $response = $this
            ->actingAs($intruder)
            ->patch("/account/addresses/{$address->id}", [
                'line1' => 'Hacked Line',
                'city' => 'Gotham',
                'postal_code' => '20500',
                'country' => 'US',
            ]);

        $response->assertForbidden();

        $this->assertDatabaseHas('addresses', ['id' => $address->id, 'line1' => 'Original Line']);
    }

    public function test_user_can_delete_an_address(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->delete("/account/addresses/{$address->id}");

        $response->assertRedirect('/account/addresses');

        $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
    }

    public function test_deleting_another_users_address_is_forbidden(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $owner->id]);

        $response = $this
            ->actingAs($intruder)
            ->delete("/account/addresses/{$address->id}");

        $response->assertForbidden();

        $this->assertDatabaseHas('addresses', ['id' => $address->id]);
    }

    public function test_user_can_set_an_address_as_default(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id, 'is_default' => false]);

        $response = $this
            ->actingAs($user)
            ->post("/account/addresses/{$address->id}/default");

        $response->assertRedirect('/account/addresses');

        $this->assertDatabaseHas('addresses', ['id' => $address->id, 'is_default' => true]);
    }

    public function test_setting_default_unsets_the_previous_default_among_multiple_addresses(): void
    {
        $user = User::factory()->create();
        $first = Address::factory()->create(['user_id' => $user->id, 'is_default' => true]);
        $second = Address::factory()->create(['user_id' => $user->id, 'is_default' => false]);
        Address::factory()->create(['user_id' => $user->id, 'is_default' => false]);

        $response = $this
            ->actingAs($user)
            ->post("/account/addresses/{$second->id}/default");

        $response->assertRedirect('/account/addresses');

        $this->assertDatabaseHas('addresses', ['id' => $second->id, 'is_default' => true]);
        $this->assertDatabaseHas('addresses', ['id' => $first->id, 'is_default' => false]);
        $this->assertSame(1, Address::where('user_id', $user->id)->where('is_default', true)->count());
    }

    public function test_setting_default_on_another_users_address_is_forbidden(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $owner->id, 'is_default' => false]);

        $response = $this
            ->actingAs($intruder)
            ->post("/account/addresses/{$address->id}/default");

        $response->assertForbidden();

        $this->assertDatabaseHas('addresses', ['id' => $address->id, 'is_default' => false]);
    }
}
