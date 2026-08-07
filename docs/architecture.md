# Architecture

High-level overview of the system.

Sections to include
- System diagram (services, third-party integrations)
- Database schema overview and important tables
- Migrations and seeding strategy
- Key domain models and relationships

Include ER diagrams or links to generated diagrams where possible.

Source links

Below are direct links to migrations and model definitions referenced in this document. Use these links to quickly inspect table structure and model relationships.

- Categories migration: [database/migrations/2026_07_19_000000_create_categories_table.php](../database/migrations/2026_07_19_000000_create_categories_table.php#L1-L60)
- Products migration: [database/migrations/2026_07_19_000001_create_products_table.php](../database/migrations/2026_07_19_000001_create_products_table.php#L1-L60)
- Product images migration: [database/migrations/2026_07_19_000002_create_product_images_table.php](../database/migrations/2026_07_19_000002_create_product_images_table.php#L1-L60)
- Product variants migration: [database/migrations/2026_07_19_000003_create_product_variants_table.php](../database/migrations/2026_07_19_000003_create_product_variants_table.php#L1-L80)
- Addresses migration (added on `feature/authentication`): [database/migrations/2026_07_21_000000_create_addresses_table.php](../database/migrations/2026_07_21_000000_create_addresses_table.php#L1-L40)
- Users table: created by the default Laravel scaffold (`0001_01_01_000000_create_users_table.php`); unchanged shape, just the model gained new behavior (see below).
- Permission tables (added on `feature/admin`, spatie/laravel-permission's stock publish): [database/migrations/2026_07_28_083754_create_permission_tables.php](../database/migrations/2026_07_28_083754_create_permission_tables.php)
- Orders / order items migrations (added on `feature/admin`): [database/migrations/2026_07_28_084257_create_orders_table.php](../database/migrations/2026_07_28_084257_create_orders_table.php), [database/migrations/2026_07_28_084258_create_order_items_table.php](../database/migrations/2026_07_28_084258_create_order_items_table.php)
- Shipping address snapshot / payment fields migrations (added on `feature/order`): [database/migrations/2026_08_01_000000_add_shipping_address_snapshot_to_orders_table.php](../database/migrations/2026_08_01_000000_add_shipping_address_snapshot_to_orders_table.php) (nullable `shipping_address_snapshot` JSON column), [database/migrations/2026_08_01_000001_add_payment_fields_to_orders_table.php](../database/migrations/2026_08_01_000001_add_payment_fields_to_orders_table.php) (`payment_method` nullable, `payment_status` defaulting to `PaymentStatus::Unpaid`, unique `stripe_checkout_session_id`, `stripe_payment_intent_id`, `paid_at`) — see "Cart, checkout & payments" below.
- Order note migrations (added on `feature/admin.orders`): [database/migrations/2026_08_04_000000_add_admin_note_to_orders_table.php](../database/migrations/2026_08_04_000000_add_admin_note_to_orders_table.php) / [database/migrations/2026_08_04_000001_add_customer_note_to_orders_table.php](../database/migrations/2026_08_04_000001_add_customer_note_to_orders_table.php) — each adds a single nullable `text` column (`admin_note`, `customer_note` respectively) after `shipping_address_snapshot`. See "Admin order editing, cancellation & refunds" below for who can write each.
- Restrict-delete FK migrations (added on `feature/admin`): [database/migrations/2026_07_28_112242_restrict_delete_on_category_and_product_foreign_keys.php](../database/migrations/2026_07_28_112242_restrict_delete_on_category_and_product_foreign_keys.php) (Category `parent_id`, Product `category_id`), [database/migrations/2026_07_29_110345_add_product_snapshot_and_restrict_delete_on_order_items.php](../database/migrations/2026_07_29_110345_add_product_snapshot_and_restrict_delete_on_order_items.php) (Order item `product_id`, plus adds `product_snapshot` JSON), [database/migrations/2026_07_29_120000_add_product_variant_id_to_order_items_table.php](../database/migrations/2026_07_29_120000_add_product_variant_id_to_order_items_table.php) (adds `product_variant_id`, also restrict-delete)
- Product images soft-delete migration (added on `feature/admin`): [database/migrations/2026_07_29_101919_add_deleted_at_to_product_images_table.php](../database/migrations/2026_07_29_101919_add_deleted_at_to_product_images_table.php)

Models

- Category model: [app/Models/Category.php](../app/Models/Category.php#L1-L120)
- Product model: [app/Models/Product.php](../app/Models/Product.php#L1-L200)
- ProductImage model: [app/Models/ProductImage.php](../app/Models/ProductImage.php#L1-L120)
- ProductVariant model: [app/Models/ProductVariant.php](../app/Models/ProductVariant.php#L1-L160)
- `HasUniqueSlug` trait (added on `feature/admin`): [app/Models/Concerns/HasUniqueSlug.php](../app/Models/Concerns/HasUniqueSlug.php) —
  a static `generateUniqueSlug(string $source, ?int $ignoreId = null): string`
  shared by `Category` and `Product`. Slugifies `$source` (`Str::slug()`),
  then appends `-1`, `-2`, ... until no row with that `slug` exists (excluding
  `$ignoreId` on update, so a model keeps its own slug during an unrelated
  edit). Both models deliberately keep `slug` (and `parent_id`/`category_id`)
  **out of `$fillable`** — slug generation and parent/category assignment
  must go through the trait/controller, never raw mass-assignment
  (`Category::create($request->all())` would silently skip `slug` entirely).
  `Category`/`Product` additionally `implements`
  [`GeneratesUniqueSlug`](../app/Models/Concerns/GeneratesUniqueSlug.php) (added
  on `feature/admin.orders`) — a one-method marker interface for the same
  `generateUniqueSlug()` signature, not a replacement for the trait. It exists
  purely so `Admin\Concerns\FillsSlugAndForeignKey` (see "Shared Concerns &
  base Request classes" below) can type-hint `Model&GeneratesUniqueSlug`
  instead of a concrete class, since `Category`/`Product` are otherwise
  unrelated models.
- Order model (added on `feature/admin`, extended on `feature/order` and
  `feature/admin.orders`): [app/Models/Order.php](../app/Models/Order.php) —
  `$fillable = ['user_id', 'status', 'total', 'payment_method',
  'payment_status', 'stripe_checkout_session_id', 'stripe_payment_intent_id',
  'paid_at', 'admin_note', 'customer_note']`; `status` cast to `OrderStatus`,
  `total` cast `decimal:2`, `shipping_address_snapshot` cast `array`,
  `payment_method` cast `PaymentMethod`, `payment_status` cast
  `PaymentStatus`, `paid_at` cast `datetime`. Two relations: `user():
  BelongsTo<User>` and `orderItems(): HasMany<OrderItem>` — the latter used to
  deliberately not exist ("nothing traverses `Order → OrderItem`"), but the
  cart/checkout flow added the first real caller
  (`CartController`/`CheckoutController` both operate on a cart's
  `orderItems`), so it was added for real use, not speculatively.
  `admin_note`/`customer_note` are both plain nullable strings with no
  business logic on the model itself — see "Admin order editing, cancellation
  & refunds" below for who can write each.
- OrderItem model (added on `feature/admin`): [app/Models/OrderItem.php](../app/Models/OrderItem.php) —
  `$fillable = ['order_id', 'product_id', 'product_variant_id',
  'product_snapshot', 'quantity', 'unit_price']`; `product_snapshot` cast
  `array`, `quantity` cast `integer`, `unit_price` cast `decimal:2`. Three
  `BelongsTo` relations: `order()`, `product()`, `productVariant()`.
  `product_snapshot` exists so an order line item still shows the product's
  name/image/category *as it was at order time*, even after the live
  `Product` row is later edited or (if unreferenced) deleted.
- `OrderStatus` enum (added on `feature/admin`, gained a case on
  `feature/order`, gained methods on `feature/admin.orders`):
  [app/Enums/OrderStatus.php](../app/Enums/OrderStatus.php) — backed string
  enum, five cases: `Cart` (added on `feature/order` — an in-progress order
  that hasn't been through checkout yet; see "Cart, checkout & payments"
  below), `Pending`, `Processing`, `Completed`, `Cancelled`. Two methods now
  encode the order status state machine: `allowedTransitions(): array`
  (`Pending → [Processing, Cancelled]`, `Processing → [Completed,
  Cancelled]`, `Completed`/`Cancelled`/`Cart` → `[]`, i.e. terminal) and
  `canTransitionTo(self $status): bool`, derived from it. Both are exercised
  from `Admin\OrderController::update` (see below) — the transition graph is
  enforced server-side on every update, not just suggested by the frontend's
  `<select>` options. Label/color mapping (e.g. `OrderStatusBadge`'s variant)
  still lives on the frontend, not the enum. `PaymentMethod`/`PaymentStatus`
  gained no equivalent transition methods — refunding is a one-way flag flip
  handled directly in the controller (see below), not a graph.
- `PaymentMethod` / `PaymentStatus` enums (added on `feature/order`):
  [app/Enums/PaymentMethod.php](../app/Enums/PaymentMethod.php) (`Cod`,
  `Stripe`), [app/Enums/PaymentStatus.php](../app/Enums/PaymentStatus.php)
  (`Unpaid`, `Paid`, `Failed`, `Refunded`) — both backed string enums, no
  methods, cast on the `Order` model.
- User model (added on `feature/authentication`, extended on `feature/admin`): [app/Models/User.php](../app/Models/User.php#L1-L52) — uses PHP attributes
  (`#[Fillable(...)]`, `#[Hidden(...)]`) instead of the classic `$fillable`/`$hidden`
  properties, and a `casts()` method (Laravel 11+ style) instead of a `$casts`
  property. Has an `addresses()` hasMany relation, an `orders(): HasMany<Order>`
  relation (added on `feature/admin`), and the `Spatie\Permission\Traits\HasRoles`
  trait (also `feature/admin` — gives `hasRole()`/`assignRole()`/`removeRole()`
  and the `role()` query scope used to list admins). Implements
  `Illuminate\Contracts\Auth\MustVerifyEmail` — this import used to be
  commented out and the interface unimplemented, which silently broke the
  email-verification flow's type contract (`VerifyEmailController`'s
  `Verified` event expects a `MustVerifyEmail`); no route currently uses the
  `verified` middleware, so this had no visible runtime symptom, just a
  latent correctness gap that PHPStan level 7 caught. The model's PHPDoc used
  to also declare `$two_factor_secret`/`$two_factor_recovery_codes`/
  `$two_factor_confirmed_at` and hide them via `#[Hidden(...)]` — vestigial
  starter-kit scaffolding for columns that were **never added to the users
  migration** (no 2FA feature exists in this app). Removed along with the
  matching dead `UserFactory::withTwoFactor()` factory state, which had an
  empty body and would have failed at runtime (inserting into non-existent
  columns) if anything had ever called it.
- Address model (added on `feature/authentication`): [app/Models/Address.php](../app/Models/Address.php#L1-L40) —
  belongs to `User`; `is_default` is cast to boolean; `user_id` is
  deliberately **not** in `$fillable` (never actually settable via request
  data, but closes the door on a future `Address::create($request->all())`
  regression). The "only one default address per user" invariant — still not
  a DB constraint — lives in `Address::makeDefault()`, called from
  `AddressController::store`/`update`/`setDefault` instead of each
  duplicating the unset-then-set logic. As of `feature/admin.orders`,
  `makeDefault()` is a one-line wrapper (`$this->makeExclusive('is_default',
  'user_id')`) around
  [`HasExclusiveFlag`](../app/Models/Concerns/HasExclusiveFlag.php)'s
  `makeExclusive(string $column, string $scopeColumn): void` — unset `$column`
  on every sibling sharing `$scopeColumn`, then set it on `$this`, all inside
  one `DB::transaction()`. `ProductImage::makePrimary()` (see "Images" below)
  is the trait's other caller (`$this->makeExclusive('is_primary',
  'product_id')`) — the two methods used to duplicate this transactional
  unset-then-set logic independently; `HasExclusiveFlag` centralizes the
  "exactly one flagged row per scope" pattern generically, while `makeDefault()`/
  `makePrimary()` themselves are unchanged as public method names/call sites.
  `update()` also never writes
  `is_default: false` through directly — an address can only stop being
  default as a side effect of a *different* address becoming default via
  `makeDefault()`, otherwise an unchecked checkbox (or an omitted field) on
  update would silently leave the user with no default address at all.
  Authorization is `AddressPolicy` (`view`/`update`/`delete`, ownership-only)
  via `$this->authorize()` — the app's first `Policy`, backed by an
  `AuthorizesRequests` trait added to the base `Controller`. Validation is
  `StoreAddressRequest`/`UpdateAddressRequest`, not inline
  `$request->validate()`.

If you'd like, I can add inline references from sections above to the exact line ranges that show relationships or important fields.

Inline schema references

Products

- `category_id` column (foreign key) in the products migration: [database/migrations/2026_07_19_000001_create_products_table.php](../database/migrations/2026_07_19_000001_create_products_table.php#L1-L60)
- `category()` relation on the `Product` model: [app/Models/Product.php](../app/Models/Product.php#L1-L200)
- Images relation: [app/Models/Product.php](../app/Models/Product.php#L1-L200) (see `images()`)
- Variants relation and `sku`/`options` fields: [app/Models/ProductVariant.php](../app/Models/ProductVariant.php#L1-L160) and [database/migrations/2026_07_19_000003_create_product_variants_table.php](../database/migrations/2026_07_19_000003_create_product_variants_table.php#L1-L80)

Categories

- Categories table definition (parent/child relation): [database/migrations/2026_07_19_000000_create_categories_table.php](../database/migrations/2026_07_19_000000_create_categories_table.php#L1-L60)
- `parent()` / `children()` relations on the `Category` model: [app/Models/Category.php](../app/Models/Category.php#L1-L120)

Images

- Product images table and fields: [database/migrations/2026_07_19_000002_create_product_images_table.php](../database/migrations/2026_07_19_000002_create_product_images_table.php#L1-L60);
  gained a `deleted_at` column on `feature/admin`
  ([database/migrations/2026_07_29_101919_add_deleted_at_to_product_images_table.php](../database/migrations/2026_07_29_101919_add_deleted_at_to_product_images_table.php)).
- `ProductImage` model and `product()` relation: [app/Models/ProductImage.php](../app/Models/ProductImage.php#L1-L120) —
  gained `SoftDeletes` on `feature/admin`, so deleting an image via the admin
  UI retains the row (with `deleted_at` set) instead of physically removing
  it. "Primary" image selection is a plain `is_primary` boolean column, not a
  separate relation/accessor — `ProductImage::makePrimary()` unsets
  `is_primary` on every other image for the same product, then sets it on
  `$this`, via the shared `HasExclusiveFlag` trait (see "Models" above for
  the trait itself and its other caller, `Address::makeDefault()`).
  `Admin\ProductImageController::destroy` re-promotes the next image (by
  `sort_order`) to primary if the deleted one held the flag.

Accounts & authentication (added on `feature/authentication`)

- `user_id` foreign key (cascade delete) in the addresses migration: [database/migrations/2026_07_21_000000_create_addresses_table.php](../database/migrations/2026_07_21_000000_create_addresses_table.php#L1-L40)
- `addresses()` relation on the `User` model: [app/Models/User.php](../app/Models/User.php#L1-L60) — `Address`
  has no inverse `user()` relation (removed on `feature/admin` as dead code;
  nothing in the codebase called `$address->user`). Add it back if a real
  caller needs the reverse lookup.
- Address CRUD + "set default" logic: [app/Http/Controllers/Account/AddressController.php](../app/Http/Controllers/Account/AddressController.php#L1-L106),
  validated by [StoreAddressRequest](../app/Http/Requests/StoreAddressRequest.php)/[UpdateAddressRequest](../app/Http/Requests/UpdateAddressRequest.php)
  and authorized by [AddressPolicy](../app/Policies/AddressPolicy.php)
- Standard Laravel Breeze auth controllers under `app/Http/Controllers/Auth/`
  (registration, login, password reset/confirmation, email verification) —
  routes in [routes/auth.php](../routes/auth.php#L1-L60); account/profile routes,
  gated behind the `auth` middleware, in [routes/web.php](../routes/web.php#L1-L31).
- Profile edit/update/delete (Breeze's `ProfileController`): [app/Http/Controllers/ProfileController.php](../app/Http/Controllers/ProfileController.php#L1-L64)

Admin panel & authorization (added on `feature/admin`)

- This codebase has **two distinct authorization mechanisms**, deliberately
  not unified: per-owner Laravel Policies (`AddressPolicy`, added on
  `feature/authentication`; `OrderPolicy`/`OrderItemPolicy`, added on
  `feature/order` — see "Cart, checkout & payments" below) for resources a
  specific user owns, and role-based middleware for resources gated by *who
  the user is* rather than *what they own*. `Category`/`Product` still have
  no Policy — access to
  their admin CRUD is a role check (are you an admin at all?), not an
  ownership check (do you own this specific row?), so a Policy would be the
  wrong tool.
- Role-based gating uses [spatie/laravel-permission](https://spatie.be/docs/laravel-permission)
  (`config/permission.php` is its stock published config — unmodified,
  `teams` disabled, standard table names). Only a single `admin` role is
  actually used; the package's finer-grained `permissions` tables/gate exist
  but nothing in the app currently checks individual permissions, only
  `hasRole('admin')`.
- [app/Http/Middleware/EnsureUserIsAdmin.php](../app/Http/Middleware/EnsureUserIsAdmin.php) —
  `abort_unless($request->user()?->hasRole('admin'), 403)`. Registered as the
  `admin` middleware alias in [bootstrap/app.php](../bootstrap/app.php)
  (not appended to the `web` group — opt-in per route). Every admin route in
  [routes/admin.php](../routes/admin.php) is `Route::middleware(['auth', 'admin'])`:
  `auth` runs first so a guest gets the normal login redirect, then `admin`
  403s an authenticated non-admin. `EnsureUserIsAdmin` alone would 403 a
  guest too (`null?->hasRole()` is falsy), so the `auth` middleware always
  has to come first in the stack.
- Admin controllers, all under `app/Http/Controllers/Admin/`, all
  `prefix('admin')->name('admin.')`:
  - `AdminController` — manage who holds the `admin` role: `index`/`create`
    (list/add-admin form), `store` (create a brand-new admin user), `promote`
    (grant the role to an existing user by email), `revoke` (remove the role
    — blocked from revoking yourself, and blocked from dropping the last
    remaining admin).
  - `CategoryController` / `ProductController` — full CRUD except `show`
    (there's no public-style detail page in the admin panel). `store`/`update`
    build the model manually rather than mass-assigning, so `slug`/`parent_id`/
    `category_id` go through `HasUniqueSlug` explicitly. `destroy` is blocked
    (with a flashed error) if the category has children/products, or the
    product has order items — backed at the DB layer by the restrict-delete
    FK migrations above, not just an app-level check.
  - `DashboardController` — one `index` action: aggregate stats (product/
    category/user/order counts, low-stock/out-of-stock counts, total revenue
    from `Completed` orders only), a 30-day revenue-by-day series (**not**
    filtered by status — includes pending/cancelled order totals, unlike the
    `total_revenue` stat), and the top 5 categories by product count.
    `total_orders`/`revenueByDay` are also **not** filtered to exclude
    `OrderStatus::Cart` rows (unlike `Admin\OrderController::index` and
    `Account\OrderController::index`, which both do) — in practice this
    doesn't skew the numbers, since a cart's `total` stays unset until
    checkout writes it, but it's worth knowing if a cart-abandonment stat is
    ever added here: the existing counts already include abandoned carts.
  - `OrderController` — `index` (excludes `OrderStatus::Cart` rows, selects
    `payment_method`/`payment_status` alongside the original columns; as of
    `feature/admin.orders` also filters by `status`/`date_from`/`date_to` and
    searches `admin_note`/`customer_note` in addition to the existing
    `search`/`user_id` filters, all via `FiltersIndexRequests`, see below),
    plus (added on `feature/admin.orders`) `show`/`update`/`refund` — see
    "Admin order editing, cancellation & refunds" below. There is still no
    `create`/`store`/`destroy`: an order is never admin-*created*, only
    edited once it exists.
  - `ProductImageController` / `ProductVariantController` — nested under a
    product (`admin.products.images.*` / no dedicated variant route prefix),
    not their own top-level resource. See "Image uploads & processing" below
    for the image side. Their nested routes call `->scopeBindings()` (added
    on `feature/admin.orders`, in [routes/admin.php](../routes/admin.php)) so
    Laravel's route-model binding itself 404s when `{image}`/`{variant}`
    doesn't belong to the `{product}` in the same URL — this replaced
    per-action `abort_unless($image->product_id === $product->id, 404)` /
    `abort_unless($variant->product_id === $product->id, 404)` checks that
    used to be duplicated across each affected controller method.
  - `UserController` — read-only `index`: lists users with an `orders_count`
    and `is_admin` flag, built as an explicit array response per user rather
    than spreading `$user->toArray()` (see "Don't spread a full model into an
    array response" in AGENTS.md's DB column-selection conventions).
- Bootstrapping the *first* admin is a chicken-and-egg problem — `AdminController::store`/
  `promote` both require the caller to already be an authenticated admin.
  [app/Console/Commands/MakeAdmin.php](../app/Console/Commands/MakeAdmin.php)
  (`php artisan make:admin <email>`) is the escape hatch: promotes an existing
  user by email from the CLI, no admin session required.
- Seeding: [database/seeders/RoleSeeder.php](../database/seeders/RoleSeeder.php)
  just ensures the `admin` role row exists (`Role::findOrCreate('admin')`) —
  it does **not** assign the role to anyone. `DatabaseSeeder` runs it first,
  then the default `test@example.com` user, then `CatalogSeeder`, then
  [database/seeders/OrderSeeder.php](../database/seeders/OrderSeeder.php)
  (creates 15 more users and 150 backdated orders/order-items against
  whatever products already exist — requires `CatalogSeeder` to have run
  first, and silently does nothing if the products table is empty). The
  default seeded user is **not** an admin; use `make:admin` or the UI to
  promote one.

Image uploads & processing (added on `feature/admin`)

- `Admin\ProductImageController::store` accepts `images[]` (validated by
  [StoreProductImageRequest](../app/Http/Requests/Admin/StoreProductImageRequest.php):
  jpeg/png/webp, 5MB max each) and re-encodes every upload server-side via
  [Intervention Image](https://image.intervention.io/) (GD driver):
  `scaleDown(1600, 1600)` (never upscales a smaller image) then re-encodes as
  JPEG at quality 80 regardless of the original format, before storing to the
  `public` disk at `products/{productId}/{uuid}.jpg`. This is the app's first
  and only image-processing dependency — if a future feature needs uploaded
  images, follow this same "resize + normalize format" pattern rather than
  storing whatever the browser sent verbatim.
- The first image ever uploaded for a product is automatically marked
  `is_primary`; later uploads append to `sort_order` (`max(sort_order) + 1`)
  without changing which one is primary.

Orders (added on `feature/admin`)

- `orders`/`order_items` tables (see migrations above) back the `Order`/
  `OrderItem` models described in "Models" above. `OrderSeeder` still seeds
  15 users and 150 backdated orders/order-items directly (bypassing the cart/
  checkout flow entirely) purely so the admin orders list and dashboard stats
  have realistic historical data — `OrderItemFactory` builds a realistic
  `product_snapshot` (name/slug/primary-image URL/category/variant info) from
  whatever product/variant it's attached to, mirroring what a real checkout
  needs to snapshot at purchase time. As of `feature/order`, orders are also
  created through normal user action — see "Cart, checkout & payments" below.
- Deleting a `Product`/`ProductVariant` that has existing `order_items`
  referencing it is blocked at the DB layer (`restrictOnDelete()`) — this is
  why `ProductController::destroy` checks `$product->orderItems()->exists()`
  before attempting the delete, rather than letting the FK constraint throw.

Admin order editing, cancellation & refunds (added on `feature/admin.orders`)

- An admin can now change a placed order's status, leave an internal note,
  and refund a paid order — none of this existed when `Admin\OrderController`
  was read-only (see "Admin panel & authorization" above). Gated purely by
  the existing `['auth', 'admin']` route-middleware group in
  [routes/admin.php](../routes/admin.php), the same as every other admin
  route — there is **no** `OrderPolicy` ability added for this (an admin
  editing any order is a role check, not an ownership check, matching the
  `Category`/`Product` precedent already described above).
- `Admin\OrderController::show(Order $order)` 404s if `$order->status ===
  OrderStatus::Cart` (a cart isn't a placed order), eager-loads
  `user:id,name,email` and `orderItems`, and renders `Admin/Orders/Show` with
  `order` plus `allowed_transitions` — `$order->status->allowedTransitions()`
  mapped to plain enum values, so the frontend's status `<select>` can be
  populated without duplicating the transition graph client-side.
- `Admin\OrderController::update(UpdateOrderRequest $request, Order $order)`
  — [UpdateOrderRequest](../app/Http/Requests/UpdateOrderRequest.php) allows
  `status` (`sometimes|required|Rule::enum(OrderStatus::class)->except(OrderStatus::Cart)`)
  and `admin_note` (`sometimes|nullable|string|max:2000`) — **not**
  `customer_note`, which has no rule at all and is therefore never
  mass-assignable through this endpoint (confirmed by a dedicated test: "admin
  cannot modify the customer note through the update endpoint"). The
  controller only touches fields actually present in the validated data
  (`array_key_exists`), and — on top of the FormRequest's enum rule — calls
  `abort_unless($order->status->canTransitionTo($newStatus), 422, 'Invalid
  status transition.')` before saving, so the transition graph is enforced
  server-side even if a request bypasses the frontend's `<select>` options.
  There is no stock-restoration or inventory side effect anywhere in this
  flow — cancelling an order (`status: Cancelled`) only changes the status
  column; product/variant stock decremented at checkout is not restored.
- `Admin\OrderController::refund(Order $order)` —
  `abort_unless($order->payment_status === PaymentStatus::Paid, 422, 'Only
  paid orders can be refunded.')`. For a `PaymentMethod::Stripe` order, it
  calls [`RefundCreator::createForOrder()`](../app/Services/Stripe/RefundCreator.php)
  inside a try/catch for `Stripe\Exception\ApiErrorException`
  (`back()->withErrors(['refund' => ...])` on failure, `payment_status`
  untouched); a `Cod` order skips Stripe entirely. Either way, success sets
  `payment_status` to `PaymentStatus::Refunded` — a one-way flag flip, not a
  graph like `OrderStatus`'s transitions.
  `RefundCreator::createForOrder(Order $order): \Stripe\Refund` is a single
  method, constructor-injecting the app's `StripeClient` singleton (see
  "Stripe integration" below) and calling `$this->client->refunds->create(['payment_intent'
  => $order->stripe_payment_intent_id])` — a full refund only (no partial
  amount, no idempotency key); any Stripe error bubbles straight up to the
  controller's catch block above.

Cart, checkout & payments (added on `feature/order`)

- **There is no separate `Cart` model or table.** A user's cart *is* an
  `Order` row with `status === OrderStatus::Cart` — `User::cart(): Order`
  ([app/Models/User.php](../app/Models/User.php)) is
  `$this->orders()->firstOrCreate(['status' => OrderStatus::Cart])`, so the
  first call for a given user creates the row and every later call reuses it.
  Checkout doesn't create a new `Order`; it mutates this same row in place
  (fills in `total`/`payment_method`/`shipping_address_snapshot`, flips
  `status` to `Pending`). Every place that reads a user's *placed* orders
  (`Account\OrderController`, `Admin\OrderController`,
  `Admin\DashboardController`'s per-status stats) has to explicitly exclude
  `OrderStatus::Cart` — there's no separate table boundary doing that for
  free.
- [app/Http/Controllers/CartController.php](../app/Http/Controllers/CartController.php) —
  `index`/`store`/`update`/`destroy`/`clear`, all operating on
  `$request->user()->cart()->orderItems()`. `store` increments the quantity
  of an existing line (same `product_id` + `product_variant_id` pair) rather
  than inserting a duplicate row. `update`/`destroy` are authorized by
  `OrderItemPolicy` (ownership **and** the parent order still being
  `Cart` — see "Admin panel & authorization" above); there's no policy check
  on `store`/`clear` since those always operate on the current user's own
  `cart()`, never a route-bound `OrderItem`/`Order` id.
- [app/Http/Controllers/CheckoutController.php](../app/Http/Controllers/CheckoutController.php) —
  `index` renders the cart plus the user's saved addresses. `store` runs
  inside `DB::transaction()`: for every cart line item it locks the
  `Product`/`ProductVariant` row (`lockForUpdate()`), aborts with 422 if
  requested quantity exceeds current stock, decrements stock, and writes that
  item's final `unit_price` + `product_snapshot` (same shape `OrderItemFactory`
  produces) — then sums the order total with `bcadd`/`bcmul` (string-based
  arbitrary-precision math) rather than float arithmetic, to avoid
  cent-level rounding drift on money. The cart `Order` itself is then
  `forceFill()`-ed to `status: Pending`, `payment_method`, `payment_status:
  Unpaid`, and a `shipping_address_snapshot` copied from the selected
  `Address` (so the order keeps its own delivery address even if the
  `Address` row is later edited or deleted — the same snapshot rationale as
  `OrderItem::product_snapshot`). After the transaction commits: a `cod`
  order redirects straight to `account.orders.show`; a `stripe` order instead
  creates a Stripe Checkout Session (see below) and does an
  `Inertia::location()` redirect to Stripe's hosted checkout page.
- **Payments**: `PaymentMethod` (`Cod`/`Stripe`) and `PaymentStatus`
  (`Unpaid`/`Paid`/`Failed`/`Refunded`) enums, both cast on `Order` (see
  "Models" above). A `stripe` order's `payment_status` only ever becomes
  `Paid` through one of the two paths below — never optimistically on
  checkout submission.
- **Stripe integration**: [config/services.php](../config/services.php)'s
  `stripe` block (`STRIPE_KEY`/`STRIPE_SECRET`/`STRIPE_WEBHOOK_SECRET`) backs
  a `StripeClient` singleton registered in
  [app/Providers/AppServiceProvider.php](../app/Providers/AppServiceProvider.php)
  (`register()`, built from `config('services.stripe.secret')` — resolved
  fresh from the container on every injection, not cached across requests
  beyond the singleton binding itself).
  [app/Services/Stripe/CheckoutSessionCreator.php](../app/Services/Stripe/CheckoutSessionCreator.php)
  wraps the two Stripe Checkout Session calls the app needs:
  `createForOrder(Order $order)` (line items priced from the order's own
  `orderItems`, `success_url` pointing at `checkout.stripe.return` with a
  `{CHECKOUT_SESSION_ID}` placeholder, `cancel_url` back to
  `checkout.index`, `metadata.order_id` for cross-referencing) and
  `retrieve(string $sessionId)`. Any controller method type-hinting
  `CheckoutSessionCreator` resolves this singleton (and therefore
  `StripeClient`) via the container on *every* call to that method, even down
  a code path that never touches Stripe (e.g. a `cod` checkout) — see the
  Playwright gotchas in [docs/testing.md](testing.md) for why this matters
  for any environment missing Stripe config.
- **Two independent paths mark a Stripe order paid**, both idempotency-guarded
  the same way (only act if `payment_status !== PaymentStatus::Paid`):
  - `CheckoutController::stripeReturn` — the `success_url` landing route the
    shopper's browser hits after paying. Re-authorizes via
    `OrderPolicy::view` (the `order` route param could be tampered with),
    checks the returned `session_id` matches
    `$order->stripe_checkout_session_id`, then calls
    `CheckoutSessionCreator::retrieve()` to confirm `payment_status ===
    'paid'` before flipping the order to `Paid`/`Processing`.
  - [app/Http/Controllers/StripeWebhookController.php](../app/Http/Controllers/StripeWebhookController.php) —
    the authoritative, server-to-server confirmation path (a shopper closing
    the tab before the redirect fires shouldn't leave an order stuck
    `Unpaid` forever). Verifies the `Stripe-Signature` header against
    `config('services.stripe.webhook_secret')` via Stripe SDK's
    `Webhook::constructEvent()`, then handles `checkout.session.completed`
    (mark paid, also stores `stripe_payment_intent_id`) and
    `checkout.session.expired` (mark `Failed`, only if still `Unpaid`).
    Registered as `POST /stripe/webhook` in
    [routes/web.php](../routes/web.php) **outside** the `auth` middleware
    group (Stripe's servers call it directly, with no user session) and
    **CSRF-exempted** (`$middleware->validateCsrfTokens(except:
    ['stripe/webhook'])` in [bootstrap/app.php](../bootstrap/app.php) — a
    server-to-server POST has no CSRF token to send).
- Account order history:
  [app/Http/Controllers/Account/OrderController.php](../app/Http/Controllers/Account/OrderController.php) —
  `index` (paginated, excludes `OrderStatus::Cart`) and `show` (404s on a
  `Cart`-status order, since it isn't a "placed" order the URL should be
  able to reach), both authorized via `OrderPolicy::view`.

Shared Concerns & base Request classes (added on `feature/admin.orders`)

A refactor pass extracted logic that had been separately duplicated across
the admin Category/Product/Address/Auth controllers and their Form Requests
into shared traits/base classes. Each of these has **2+ real call sites**
today (the same bar `AGENTS.md`'s "Duplication checks" section applies to the
frontend) — treat that as the threshold before adding a third abstraction
here, not evidence more sharing is automatically good.

- [`Http\Controllers\Concerns\DefaultsNullableFieldsToZero`](../app/Http/Controllers/Concerns/DefaultsNullableFieldsToZero.php) —
  `defaultToZeroOnStore(array &$data, string $key)` (blank → `0` on create)
  and `defaultToZeroOnUpdate(array &$data, string $key)` (zeroes only if the
  key is present *and* explicitly `null`, not merely omitted). Used by
  `Admin\ProductController` and `Admin\ProductVariantController` for `stock`.
- [`Http\Controllers\Concerns\FillsSlugAndForeignKey`](../app/Http/Controllers/Concerns/FillsSlugAndForeignKey.php) —
  `extractSlugAndForeignKey()` (create path) /
  `applySlugAndForeignKey(Model&GeneratesUniqueSlug $model, ...)` (update
  path, conditional on the foreign key being present in the request). Used by
  `Admin\CategoryController` (`parent_id`/`Category`) and
  `Admin\ProductController` (`category_id`/`Product`) — see the
  `GeneratesUniqueSlug` interface above for why it can type-hint across both
  otherwise-unrelated models.
- [`Http\Controllers\Concerns\FiltersIndexRequests`](../app/Http/Controllers/Concerns/FiltersIndexRequests.php) —
  `applySearchFilter(Builder $query, Request $request, Closure $callback)`
  (only applies the callback if `search` is filled/trimmed) and
  `requestFilters(Request $request, array $keys)` (echoes the applied filters
  back into the Inertia response so the frontend's filter form can stay in
  sync with the URL). Used by `Admin\CategoryController`,
  `Admin\ProductController`, `Admin\UserController`, and
  `Admin\OrderController`'s `index` actions.
- [`Http\Controllers\Concerns\GuardsRelatedDeletes`](../app/Http/Controllers/Concerns/GuardsRelatedDeletes.php) —
  `preventDeleteIfRelated(Model $model, array $relations, string $indexRoute,
  string $errorField, string $errorMessageKey)`: loops the given relation
  names, and on the first one that `->exists()`, flashes an error and
  redirects back instead of deleting. Used by `Admin\CategoryController::destroy`
  (`['children', 'products']`) and `Admin\ProductController::destroy`
  (`['orderItems']`) — this is the app-level half of the "block delete both
  at the app layer and via a DB `restrictOnDelete()` FK" pattern described
  under "Authorization" in `AGENTS.md`; the FK backstop is unchanged.
- [`Http\Requests\Concerns\AuthorizesUpdateVia`](../app/Http/Requests/Concerns/AuthorizesUpdateVia.php) —
  `authorizeUpdate(string $routeParam): bool` →
  `$this->user()->can('update', $this->route($routeParam))`. Used by
  `UpdateAddressRequest`/`UpdateCartItemRequest`'s `authorize()` methods —
  the same Policy-backed ownership check each used to spell out inline.
- [`Http\Requests\Concerns\SharedRules`](../app/Http/Requests/Concerns/SharedRules.php) —
  a grab-bag of rule-array builders reused across otherwise-unrelated Form
  Requests: `nameEmailPasswordRules()`, `withSometimes(array $rules, bool
  $sometimes)`, `activeAndStockRules()`, `quantityRule()`,
  `descriptionRule()`, `isPartialUpdate(): bool` (default `false`, overridden
  `true` by update-flavored subclasses), `uniqueIgnoring($table, $ignore,
  $column = 'NULL')`. Used by `NameSlugRequest`, `Admin\ProductVariantRequest`,
  `Auth\RegisterRequest`, `ProfileUpdateRequest`, `Admin\StoreAdminRequest`,
  `StoreCartItemRequest`, and both product/category/variant update requests
  (via `isPartialUpdate()`).
- [`Http\Requests\NameSlugRequest`](../app/Http/Requests/NameSlugRequest.php)
  (abstract) — `rules() = commonRules() + nameAndSlugRules($this->isPartialUpdate())`,
  subclasses implement `commonRules()`. `ProductRequest`/`CategoryRequest`
  each extend it (holding the product/category-specific field rules), and
  are themselves subclassed by the now near-empty
  `Store*`/`Update*ProductRequest`/`Update*CategoryRequest` classes (an
  `Update*` subclass typically only overrides `isPartialUpdate(): bool {
  return true; }`).
- [`Http\Requests\AddressRequest`](../app/Http/Requests/AddressRequest.php)
  (abstract) — holds the full address rule set directly (address fields don't
  overlap with the name/email/password/stock shapes `SharedRules` covers).
  `StoreAddressRequest`/`UpdateAddressRequest` are now near-empty subclasses.
- [`Http\Requests\Admin\ProductVariantRequest`](../app/Http/Requests/Admin/ProductVariantRequest.php)
  (abstract, uses `SharedRules`) — `rules() = skuRules() + commonRules()`;
  subclasses implement the abstract `skuRules()` (a plain `unique` rule on
  create, a `uniqueIgnoring()` rule scoped to the current variant on update).
- [`Http\Requests\Auth\RegisterRequest`](../app/Http/Requests/Auth/RegisterRequest.php) —
  a normal FormRequest (`rules() = nameEmailPasswordRules()`) that
  `Auth\RegisteredUserController::store` now type-hints instead of validating
  inline — not a "single-use abstraction" concern per se (a controller action
  needing validation is the expected FormRequest pairing, per the
  `AGENTS.md` note on `authorize()` placement), just newly extracted from
  what used to be an inline `$request->validate([...])` call.
- [`Support\Validation\PasswordRules`](../app/Support/Validation/PasswordRules.php) —
  a plain class, one static method `defaults(): array` (`['required',
  'confirmed', Password::defaults()]`), replacing that same array literal
  that used to be duplicated across `RegisterRequest`/`SharedRules`,
  `Admin\StoreAdminRequest`, `Auth\PasswordController::update`, and
  `Auth\NewPasswordController::store`.

Routing bridge (Ziggy)

- The frontend needs to build URLs from Laravel route *names* (`route('login')`,
  `route('account.addresses.store')`, etc.) without hardcoding paths. This is
  provided by [Ziggy](https://github.com/tighten/ziggy) — `tightenco/ziggy` on
  the PHP side, `ziggy-js` on the JS side — added on `feature/authentication`
  (see the diff in `composer.json`/`package.json`). It's installed as a Vue
  plugin in [resources/js/app.ts](../resources/js/app.ts#L1-L21)
  (`app.use(ZiggyVue)`), which is what makes the global `route()` function
  available in every `<script setup>` block and template.

Locale & RTL (Arabic support)

- `HandleLocale` middleware reads a `locale` cookie, validates it against
  `config('app.available_locales')` (`['en', 'ar']`), falls back to
  `config('app.locale')`, and calls `app()->setLocale()`:
  [app/Http/Middleware/HandleLocale.php](../app/Http/Middleware/HandleLocale.php#L1-L28).
  Registered in the `web` middleware group in
  [bootstrap/app.php](../bootstrap/app.php#L1-L30), before
  `HandleInertiaRequests` — mirrors the existing `HandleAppearance` cookie
  pattern rather than introducing a new mechanism.
- Switching locale: `GET /locale/{locale}` →
  [app/Http/Controllers/LocaleController.php](../app/Http/Controllers/LocaleController.php#L1-L20)
  — validates the locale (404s on anything not in `available_locales`), queues
  an *unencrypted* `locale` cookie (it's in the `encryptCookies(except: [...])`
  list in `bootstrap/app.php`, alongside `appearance`/`sidebar_state`), and
  redirects back. Deliberately a `GET`, not a `POST`: see
  [docs/frontend/README.md](frontend/README.md) for why the switcher is a
  plain `<a>` that needs a full page reload rather than an Inertia visit.
- `resources/views/app.blade.php` renders both `lang` and `dir` straight from
  `app()->getLocale()` / `config('app.rtl_locales')` on every request — no
  Inertia shared prop needed for this, since a full reload always recomputes
  it fresh.
- Laravel's own validation/auth error strings are localized too, separately
  from the Vue-side `t()` system: `lang/en/*.php` (published via
  `php artisan lang:publish`) and `lang/ar/{validation,auth,passwords,pagination}.php`.
  `validation.php`'s `attributes` array translates every field name actually
  used across the app's Form Requests and inline `validate()` calls (auth,
  profile, address, and the admin product/category/user/admin requests) so
  errors read naturally — e.g. "حقل الاسم مطلوب." rather than "حقل name
  مطلوب." Both this and the Vue `t()` system key off the same
  `locale` cookie but are otherwise independent; a new field/rule needs a
  translation added in both places if it should read naturally in Arabic.

Static analysis (PHPStan/Larastan, level 7)

- `composer types:check` runs `phpstan analyse --memory-limit=1G` — the
  `--memory-limit` flag is baked into the Composer script because PHPStan
  crashes with an OOM fatal error under PHP CLI's stock 128M default on this
  codebase's size; if you ever run `phpstan`/`vendor/bin/phpstan` directly
  instead of through Composer, pass the same flag.
- **Every Eloquent relation method needs a generic-typed `@return` PHPDoc** —
  e.g. `@return BelongsTo<Category, $this>` or
  `@return HasMany<ProductImage, $this>` — and every model using
  `HasFactory` needs `/** @use HasFactory<ItsFactory> */` immediately above
  the `use HasFactory;` line. Plain `: BelongsTo`/`: HasMany` return types
  with no generic PHPDoc pass PHP's own type checker fine but fail Larastan's
  `missingType.generics` rule. See any relation in
  [app/Models/Product.php](../app/Models/Product.php#L1-L200) or
  [app/Models/Category.php](../app/Models/Category.php#L1-L120) for the
  pattern — apply it to every new relation on every new model.
- **Faker's locale-specific provider methods aren't visible to PHPStan.**
  Faker proxies most calls through `Generator::__call()`, and the base
  `Faker\Generator` class's own `@method` PHPDoc (which is what static
  analysis actually sees) only lists the common cross-locale methods —
  `name()`, `city()`, `postcode()`, etc. all resolve fine. Locale-specific
  ones like `en_US\Address`'s `secondaryAddress()`/`state()` (used in
  [database/factories/AddressFactory.php](../database/factories/AddressFactory.php#L1-L38),
  matching `config('app.faker_locale')`) are **not** in that base PHPDoc and
  get flagged as undefined methods, even though they exist and work
  perfectly at runtime. Don't try to fix this with a PHPStan `stubFiles`
  entry re-declaring `Faker\Generator` — a stub for an already-autoloaded
  class **replaces** PHPStan's reflection of it rather than merging
  additively, so every other (correctly-recognized) Faker method call across
  every factory breaks at once. The actual fix: call the provider class's
  static method directly (`\Faker\Provider\en_US\Address::secondaryAddress()`),
  bypassing `$this->faker`'s magic proxy for just that one call — real static
  methods have no reflection ambiguity. Only do this for the specific
  locale-only methods PHPStan actually flags; leave the common ones (`name()`,
  `city()`, ...) called through `$this->faker` as normal.
