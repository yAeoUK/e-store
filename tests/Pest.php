<?php

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

function inertiaHeaders(): array
{
    $version = null;

    if (config('app.asset_url')) {
        $version = hash('xxh128', config('app.asset_url'));
    } elseif (file_exists(public_path('build/manifest.json'))) {
        $version = hash_file('xxh128', public_path('build/manifest.json'));
    } elseif (file_exists(public_path('mix-manifest.json'))) {
        $version = hash_file('xxh128', public_path('mix-manifest.json'));
    }

    return [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $version ?? '',
    ];
}

function actingAsAdmin(): User
{
    return makeAdmin();
}

/**
 * Create an admin user without acting as them, for tests that need an
 * "other admin" distinct from the one performing the request.
 */
function makeAdmin(): User
{
    Role::findOrCreate('admin');

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    return $admin;
}

function assertIndexPaginates(string $routeName, string $propKey, Closure $seed, int $expectedTotal = 20, ?Closure $actingAs = null, int $perPage = 15): void
{
    $actor = $actingAs ? $actingAs() : actingAsAdmin();
    $seed();

    $response = test()->actingAs($actor)->withHeaders(inertiaHeaders())->get(route($routeName));

    $response->assertOk();
    $response->assertJsonCount(min($perPage, $expectedTotal), "props.{$propKey}.data");
    $response->assertJsonPath("props.{$propKey}.total", $expectedTotal);
    $response->assertJsonPath("props.{$propKey}.per_page", $perPage);
}

/**
 * Assert that an admin GET to an index route renders the expected Inertia
 * component with the expected number of items in the given paginated prop.
 * Returns the response so callers can add further assertions.
 */
function assertAdminIndexRenders(string $routeName, string $component, string $propKey, int $expectedCount, array $params = []): TestResponse
{
    $admin = actingAsAdmin();

    $response = test()->actingAs($admin)->withHeaders(inertiaHeaders())->get(route($routeName, $params));

    $response->assertOk();
    $response->assertJsonPath('component', $component);
    $response->assertJsonCount($expectedCount, "props.{$propKey}.data");

    return $response;
}

/**
 * Assert that an admin index route, given a query filter, returns only the
 * matching row(s). Pass $assertField/$assertValue to confirm which row
 * survived; omit them when the count alone is sufficient (e.g. distinguishing
 * two search matches that don't expose a unique field to assert on).
 */
function assertAdminIndexFiltersBy(string $routeName, string $propKey, array $filter, ?string $assertField = null, mixed $assertValue = null, int $expectedCount = 1): void
{
    $admin = actingAsAdmin();

    $response = test()->actingAs($admin)->withHeaders(inertiaHeaders())
        ->get(route($routeName, $filter));

    $response->assertOk();
    $response->assertJsonCount($expectedCount, "props.{$propKey}.data");

    if ($assertField !== null) {
        $response->assertJsonPath("props.{$propKey}.data.0.{$assertField}", $assertValue);
    }
}

/**
 * Assert that a non-admin gets a 403 from a GET-only admin route.
 */
function assertNonAdminCannotView(string $routeName): void
{
    $user = User::factory()->create();

    test()->actingAs($user)->get(route($routeName))->assertForbidden();
}

/**
 * Assert that a non-admin gets a 403 from an arbitrary admin verb+URL. Use
 * this for actions that don't fit the create/update/destroy resource shape
 * assumed by assertNonAdminCannotMutate (e.g. promote, revoke, refund).
 */
function assertNonAdminForbidden(string $verb, string $url, array $payload = []): void
{
    $user = User::factory()->create();

    test()->actingAs($user)->{$verb}($url, $payload)->assertForbidden();
}

/**
 * Assert that a non-admin gets 403s from a resource's store/update/destroy routes
 * and that the instance passed in is left untouched.
 */
function assertNonAdminCannotMutate(string $resource, Model $instance): void
{
    $user = User::factory()->create();

    test()->actingAs($user)->post(route("admin.{$resource}.store"), ['name' => 'x'])->assertForbidden();
    test()->actingAs($user)->patch(route("admin.{$resource}.update", $instance), ['name' => 'x'])->assertForbidden();
    test()->actingAs($user)->delete(route("admin.{$resource}.destroy", $instance))->assertForbidden();

    test()->assertDatabaseHas($instance->getTable(), ['id' => $instance->id]);
}

/**
 * Assert that a GET to an admin resource's create page renders the expected
 * component and includes a related listing prop (e.g. a dropdown's options).
 */
function assertAdminCanRenderCreatePage(string $routeName, string $component, string $listProp, Model $listItem): void
{
    $admin = actingAsAdmin();

    $response = test()->actingAs($admin)->withHeaders(inertiaHeaders())->get(route($routeName));

    $response->assertOk();
    $response->assertJsonPath('component', $component);
    $response->assertJsonCount(1, "props.{$listProp}");
    $response->assertJsonPath("props.{$listProp}.0.id", $listItem->id);
}

/**
 * Assert that a GET to an admin resource's edit page renders the expected
 * component with the resource's own prop.
 */
function assertAdminCanRenderEditPage(string $routeName, string $component, string $prop, Model $instance): void
{
    $admin = actingAsAdmin();

    $response = test()->actingAs($admin)->withHeaders(inertiaHeaders())->get(route($routeName, $instance));

    $response->assertOk();
    $response->assertJsonPath('component', $component);
    $response->assertJsonPath("props.{$prop}.id", $instance->id);
}

/**
 * Assert that a non-admin gets 403s from a resource's create and edit pages.
 */
function assertNonAdminCannotViewCreateOrEditPages(string $resource, Model $instance): void
{
    $user = User::factory()->create();

    test()->actingAs($user)->get(route("admin.{$resource}.create"))->assertForbidden();
    test()->actingAs($user)->get(route("admin.{$resource}.edit", $instance))->assertForbidden();
}

/**
 * Assert that setting (or clearing, when $newRelated is null) a foreign key on
 * update succeeds and persists.
 */
function assertAdminCanUpdateForeignKeyOnResource(string $resource, string $table, string $foreignKey, Model $instance, ?Model $newRelated): void
{
    $admin = actingAsAdmin();

    $response = test()->actingAs($admin)->patch(route("admin.{$resource}.update", $instance), [
        $foreignKey => $newRelated?->id ?? '',
    ]);

    $response->assertRedirect(route("admin.{$resource}.index"));
    test()->assertDatabaseHas($table, ['id' => $instance->id, $foreignKey => $newRelated?->id]);
}

/**
 * Assert that an admin can delete a resource that has no blocking relations.
 */
function assertAdminCanDeleteResource(string $resource, Model $instance): void
{
    $admin = actingAsAdmin();

    $response = test()->actingAs($admin)->delete(route("admin.{$resource}.destroy", $instance));

    $response->assertRedirect(route("admin.{$resource}.index"));
    test()->assertDatabaseMissing($instance->getTable(), ['id' => $instance->id]);
}

/**
 * Assert that an admin is blocked from deleting a resource still in use,
 * and that the resource is left untouched.
 */
function assertAdminCannotDeleteResourceInUse(string $resource, Model $instance, string $errorKey): void
{
    $admin = actingAsAdmin();

    $response = test()->actingAs($admin)->delete(route("admin.{$resource}.destroy", $instance));

    $response->assertRedirect(route("admin.{$resource}.index"));
    $response->assertSessionHasErrors($errorKey);
    test()->assertDatabaseHas($instance->getTable(), ['id' => $instance->id]);
}

/**
 * Assert that a nested child resource scoped to a parent via ->scopeBindings()
 * 404s on each given request when the child actually belongs to a different
 * parent than the one in the URL.
 *
 * @param  array<int, array{0: string, 1: string, 2: array<string, mixed>}>  $requests  Each entry: [verb, routeName, payload]
 */
function assertScopedChildNotFoundForWrongParent(Model $parent, Model $child, array $requests): void
{
    $admin = actingAsAdmin();

    foreach ($requests as [$verb, $routeName, $payload]) {
        test()->actingAs($admin)->{$verb}(route($routeName, [$parent, $child]), $payload)->assertNotFound();
    }
}

/**
 * Exercise the HasUniqueSlug behaviour shared by slugged admin resources: auto-generating
 * a slug from the name, deduplicating collisions, and regenerating on update when cleared.
 *
 * @param  class-string<Model>  $modelClass
 * @param  Closure(array<string, mixed>): TestResponse  $store
 * @param  Closure(Model, array<string, mixed>): TestResponse  $update
 */
function assertSlugIsAutoGeneratedAndDeduplicated(string $modelClass, Closure $store, Closure $update): void
{
    $table = (new $modelClass)->getTable();

    $store(['name' => 'Slug Battery Item']);
    test()->assertDatabaseHas($table, ['name' => 'Slug Battery Item', 'slug' => 'slug-battery-item']);

    $store(['name' => 'Slug Battery Item']);
    test()->assertDatabaseHas($table, ['name' => 'Slug Battery Item', 'slug' => 'slug-battery-item-1']);

    $response = $store(['name' => 'Slug Battery Item']);
    $response->assertSessionDoesntHaveErrors();
    test()->assertDatabaseHas($table, ['name' => 'Slug Battery Item', 'slug' => 'slug-battery-item-2']);

    $model = $modelClass::where('slug', 'slug-battery-item')->firstOrFail();

    $update($model, ['name' => 'Renamed Item']);
    test()->assertDatabaseHas($table, ['id' => $model->id, 'name' => 'Renamed Item', 'slug' => 'slug-battery-item']);

    $update($model, ['name' => 'Second Name', 'slug' => '']);
    test()->assertDatabaseHas($table, ['id' => $model->id, 'name' => 'Second Name', 'slug' => 'second-name']);

    $update($model, ['name' => 'Third Name']);
    test()->assertDatabaseHas($table, ['id' => $model->id, 'name' => 'Third Name', 'slug' => 'second-name']);

    $update($model, ['slug' => '']);
    test()->assertDatabaseHas($table, ['id' => $model->id, 'name' => 'Third Name', 'slug' => 'third-name']);
}

/**
 * Assert that a belongsTo relation resolves to the correct owner and not to
 * an unrelated row of the same type, guarding against relations that
 * accidentally grab any row instead of filtering by foreign key.
 *
 * @param  class-string<Model>  $ownerClass
 * @param  class-string<Model>  $relatedClass
 */
function assertBelongsToResolvesCorrectOwner(string $ownerClass, string $relatedClass, string $foreignKey, string $relation): void
{
    $owner = $ownerClass::factory()->create();
    $related = $relatedClass::factory()->create([$foreignKey => $owner->id]);

    $otherOwner = $ownerClass::factory()->create();
    $relatedClass::factory()->create([$foreignKey => $otherOwner->id]);

    expect($related->{$relation}->id)->toBe($owner->id)
        ->and($related->{$relation}->id)->not->toBe($otherOwner->id);
}

/**
 * Assert that a hasMany relation resolves to only the owning model's related
 * rows, guarding against relations that accidentally grab every row instead
 * of filtering by foreign key.
 *
 * @param  class-string<Model>  $ownerClass
 * @param  class-string<Model>  $relatedClass
 */
function assertHasManyResolvesCorrectOwner(string $ownerClass, string $relatedClass, string $foreignKey, string $relation): void
{
    $owner = $ownerClass::factory()->create();
    $related = $relatedClass::factory()->create([$foreignKey => $owner->id]);

    $otherOwner = $ownerClass::factory()->create();
    $otherRelated = $relatedClass::factory()->create([$foreignKey => $otherOwner->id]);

    expect($owner->{$relation})->toHaveCount(1)
        ->and($owner->{$relation}->first()->id)->toBe($related->id)
        ->and($owner->{$relation}->pluck('id'))->not->toContain($otherRelated->id);
}

/**
 * Create a $modelClass row scoped to $owner via $scopeColumn, with
 * $flagColumn set to $value. Shared by the assertExclusiveFlag* helpers
 * below, which each create one or more such rows.
 *
 * @param  class-string<Model>  $modelClass
 */
function makeScopedFlagRow(string $modelClass, string $scopeColumn, Model $owner, string $flagColumn, bool $value): Model
{
    return $modelClass::factory()->create([$scopeColumn => $owner->id, $flagColumn => $value]);
}

/**
 * Assert that calling $method marks the model as the sole holder of
 * $flagColumn, guarding against an exclusive-flag method that no-ops instead
 * of setting the flag.
 *
 * @param  class-string<Model>  $modelClass
 */
function assertExclusiveFlagMarksSelf(string $modelClass, string $method, string $flagColumn, string $scopeColumn, string $scopeOwnerClass): void
{
    $owner = $scopeOwnerClass::factory()->create();
    $instance = makeScopedFlagRow($modelClass, $scopeColumn, $owner, $flagColumn, false);

    $instance->{$method}();

    expect($instance->fresh()->{$flagColumn})->toBeTrue();
}

/**
 * Assert that calling $method unsets the flag on the previous holder within
 * the same $scopeColumn, guarding against an exclusive-flag method that sets
 * the flag without clearing sibling rows.
 *
 * @param  class-string<Model>  $modelClass
 */
function assertExclusiveFlagUnsetsPreviousHolder(string $modelClass, string $method, string $flagColumn, string $scopeColumn, string $scopeOwnerClass): void
{
    $owner = $scopeOwnerClass::factory()->create();
    $current = makeScopedFlagRow($modelClass, $scopeColumn, $owner, $flagColumn, true);
    $other = makeScopedFlagRow($modelClass, $scopeColumn, $owner, $flagColumn, false);

    $other->{$method}();

    expect($other->fresh()->{$flagColumn})->toBeTrue()
        ->and($current->fresh()->{$flagColumn})->toBeFalse();
}

/**
 * Assert that calling $method leaves other $scopeColumn owners' flag holders
 * untouched, guarding against an exclusive-flag method that clears the flag
 * globally instead of scoping to $scopeColumn.
 *
 * @param  class-string<Model>  $modelClass
 */
function assertExclusiveFlagScopedToOwner(string $modelClass, string $method, string $flagColumn, string $scopeColumn, string $scopeOwnerClass): void
{
    $owner = $scopeOwnerClass::factory()->create();
    $instance = makeScopedFlagRow($modelClass, $scopeColumn, $owner, $flagColumn, false);

    $otherOwner = $scopeOwnerClass::factory()->create();
    $otherInstance = makeScopedFlagRow($modelClass, $scopeColumn, $otherOwner, $flagColumn, true);

    $instance->{$method}();

    expect($instance->fresh()->{$flagColumn})->toBeTrue()
        ->and($otherInstance->fresh()->{$flagColumn})->toBeTrue();
}

/**
 * Create a user together with an address they own.
 *
 * @return array{0: User, 1: Address}
 */
function userWithAddress(): array
{
    $user = User::factory()->create();

    return [$user, Address::factory()->create(['user_id' => $user->id])];
}

/**
 * Create a single cart item for the given user, defaulting to a product
 * priced at 20 with 10 in stock. Overrides are merged on top to set a
 * specific product, variant, quantity, or unit_price.
 */
function createCartItem(User $user, array $overrides = []): OrderItem
{
    return OrderItem::factory()->create(array_merge([
        'order_id' => $user->cart()->id,
        'product_id' => Product::factory()->create(['price' => 20, 'stock' => 10]),
    ], $overrides));
}

/**
 * Create the given user's cart populated with order items, each for its own
 * product priced at 20 with 10 in stock.
 */
function createCartWithItems(User $user, int $itemCount = 1, int $quantity = 2): Order
{
    $cart = $user->cart();

    for ($i = 0; $i < $itemCount; $i++) {
        createCartItem($user, ['quantity' => $quantity]);
    }

    return $cart;
}

/**
 * Put the given order into a Stripe payment state: pending, unpaid, and tied
 * to a checkout session, with any overrides merged on top.
 */
function stripeOrderInState(Order $order, array $overrides = []): Order
{
    $order->forceFill(array_merge([
        'status' => 'pending',
        'payment_method' => PaymentMethod::Stripe,
        'payment_status' => PaymentStatus::Unpaid,
        'stripe_checkout_session_id' => 'cs_test_123',
    ], $overrides))->save();

    return $order;
}

/**
 * Assert that a user acting on another user's owned resource is forbidden,
 * and that the resource is left in its original state.
 */
function assertForeignUserCannotAccessResource(string $verb, string $url, Model $resource, array $payload = [], ?array $expected = null, ?TestCase $testCase = null): void
{
    $intruder = User::factory()->create();
    $expected ??= ['id' => $resource->id];

    $response = ($testCase ?? test())->actingAs($intruder)->{$verb}($url, $payload);

    $response->assertForbidden();

    if ($testCase !== null) {
        Closure::bind(fn () => $this->assertDatabaseHas($resource->getTable(), $expected), $testCase, TestCase::class)();
    } else {
        test()->assertDatabaseHas($resource->getTable(), $expected);
    }
}

/**
 * Assert that a guest is redirected to the login page when attempting to
 * access a resource, with optional further assertions (e.g. that no
 * database mutation occurred).
 */
function assertGuestCannotAccessResource(string $verb, string $url, array $payload = [], ?Closure $additionalAssertions = null, ?TestCase $testCase = null): void
{
    $testCase ??= test();
    $response = $testCase->{$verb}($url, $payload);

    $response->assertRedirect(route('login'));

    if ($additionalAssertions !== null) {
        $additionalAssertions();
    }
}
