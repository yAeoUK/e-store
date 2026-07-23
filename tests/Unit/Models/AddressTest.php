<?php

use App\Models\Address;
use App\Models\User;

test('user relationship returns the owning user', function () {
    $user = User::factory()->create();
    $address = Address::factory()->create(['user_id' => $user->id]);

    // Unrelated data: another user with their own address, so the relation
    // must resolve via user_id and not just grab any user row.
    $otherUser = User::factory()->create();
    Address::factory()->create(['user_id' => $otherUser->id]);

    expect($address->user->id)->toBe($user->id)
        ->and($address->user->id)->not->toBe($otherUser->id);
});

test('is_default is cast to a boolean', function () {
    $address = Address::factory()->create(['is_default' => 1]);

    $fresh = Address::find($address->id);

    expect($fresh->is_default)->toBeTrue();

    $address->update(['is_default' => 0]);

    expect($address->fresh()->is_default)->toBeFalse();
});
