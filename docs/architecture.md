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

Models

- Category model: [app/Models/Category.php](../app/Models/Category.php#L1-L120)
- Product model: [app/Models/Product.php](../app/Models/Product.php#L1-L200)
- ProductImage model: [app/Models/ProductImage.php](../app/Models/ProductImage.php#L1-L120)
- ProductVariant model: [app/Models/ProductVariant.php](../app/Models/ProductVariant.php#L1-L160)
- User model (added on `feature/authentication`): [app/Models/User.php](../app/Models/User.php#L1-L52) — uses PHP attributes
  (`#[Fillable(...)]`, `#[Hidden(...)]`) instead of the classic `$fillable`/`$hidden`
  properties, and a `casts()` method (Laravel 11+ style) instead of a `$casts`
  property. Gained an `addresses()` hasMany relation. Implements
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
  a DB constraint — lives in `Address::makeDefault()` (unset every other
  address of the same user, then set this one, in a single transaction),
  called from `AddressController::store`/`update`/`setDefault` instead of
  each duplicating the unset-then-set logic. `update()` also never writes
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
- Images and primary image relations: [app/Models/Product.php](../app/Models/Product.php#L1-L200) (see `images()` and `primaryImage()`)
- Variants relation and `sku`/`options` fields: [app/Models/ProductVariant.php](../app/Models/ProductVariant.php#L1-L160) and [database/migrations/2026_07_19_000003_create_product_variants_table.php](../database/migrations/2026_07_19_000003_create_product_variants_table.php#L1-L80)

Categories

- Categories table definition (parent/child relation): [database/migrations/2026_07_19_000000_create_categories_table.php](../database/migrations/2026_07_19_000000_create_categories_table.php#L1-L60)
- `parent()` / `children()` relations on the `Category` model: [app/Models/Category.php](../app/Models/Category.php#L1-L120)

Images

- Product images table and fields: [database/migrations/2026_07_19_000002_create_product_images_table.php](../database/migrations/2026_07_19_000002_create_product_images_table.php#L1-L60)
- `ProductImage` model and `product()` relation: [app/Models/ProductImage.php](../app/Models/ProductImage.php#L1-L120)

Accounts & authentication (added on `feature/authentication`)

- `user_id` foreign key (cascade delete) in the addresses migration: [database/migrations/2026_07_21_000000_create_addresses_table.php](../database/migrations/2026_07_21_000000_create_addresses_table.php#L1-L40)
- `addresses()` relation on the `User` model, `user()` relation on `Address`: [app/Models/User.php](../app/Models/User.php#L1-L60), [app/Models/Address.php](../app/Models/Address.php#L1-L40)
- Address CRUD + "set default" logic: [app/Http/Controllers/Account/AddressController.php](../app/Http/Controllers/Account/AddressController.php#L1-L106),
  validated by [StoreAddressRequest](../app/Http/Requests/StoreAddressRequest.php)/[UpdateAddressRequest](../app/Http/Requests/UpdateAddressRequest.php)
  and authorized by [AddressPolicy](../app/Policies/AddressPolicy.php)
- Standard Laravel Breeze auth controllers under `app/Http/Controllers/Auth/`
  (registration, login, password reset/confirmation, email verification) —
  routes in [routes/auth.php](../routes/auth.php#L1-L60); account/profile routes,
  gated behind the `auth` middleware, in [routes/web.php](../routes/web.php#L1-L31).
- Profile edit/update/delete (Breeze's `ProfileController`): [app/Http/Controllers/ProfileController.php](../app/Http/Controllers/ProfileController.php#L1-L64)

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
  profile, address, plus the not-yet-wired-up product/category admin
  requests) so errors read naturally — e.g. "حقل الاسم مطلوب." rather than
  "حقل name مطلوب." Both this and the Vue `t()` system key off the same
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
