<?php

use App\Models\Address;
use App\Models\User;

test('is_default is cast to a boolean', function () {
    $address = Address::factory()->create(['is_default' => 1]);

    $fresh = Address::find($address->id);

    expect($fresh->is_default)->toBeTrue();

    $address->update(['is_default' => 0]);

    expect($address->fresh()->is_default)->toBeFalse();
});

test('makeDefault marks the address as default', function () {
    assertExclusiveFlagMarksSelf(Address::class, 'makeDefault', 'is_default', 'user_id', User::class);
});

test('makeDefault unsets the previous default among the same user\'s addresses', function () {
    assertExclusiveFlagUnsetsPreviousHolder(Address::class, 'makeDefault', 'is_default', 'user_id', User::class);
});

test('makeDefault does not affect other users\' addresses', function () {
    assertExclusiveFlagScopedToOwner(Address::class, 'makeDefault', 'is_default', 'user_id', User::class);
});
