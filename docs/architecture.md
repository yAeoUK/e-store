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
- User model (added on `feature/authentication`): [app/Models/User.php](../app/Models/User.php#L1-L60) — uses PHP attributes
  (`#[Fillable(...)]`, `#[Hidden(...)]`) instead of the classic `$fillable`/`$hidden`
  properties, and a `casts()` method (Laravel 11+ style) instead of a `$casts`
  property. Gained an `addresses()` hasMany relation.
- Address model (added on `feature/authentication`): [app/Models/Address.php](../app/Models/Address.php#L1-L40) —
  belongs to `User`; `is_default` is cast to boolean. See
  `app/Http/Controllers/Account/AddressController.php` for the "only one default
  address per user" invariant, which is enforced in the controller (inside a
  DB transaction), not the model or a DB constraint.

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
- Address CRUD + "set default" logic: [app/Http/Controllers/Account/AddressController.php](../app/Http/Controllers/Account/AddressController.php#L1-L106)
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
