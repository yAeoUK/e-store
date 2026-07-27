# Changelog

Follow [Keep a Changelog](https://keepachangelog.com/) format.

## [Unreleased]
- Initial docs scaffolding
- Added Arabic localization and RTL support:
  - `ar` translations for every existing i18n domain (`common`, `shop`, `auth`,
    `profile`, `account`), type-checked against the `en` files via `satisfies`
    so a missing/renamed key fails `npm run types:check`.
  - `LanguageSwitcher` component (EN/AR toggle) in `ShopLayout` and `GuestLayout`.
  - Cookie-based locale switching (`HandleLocale` middleware, `LocaleController`,
    `GET /locale/{locale}`) and `dir`/`lang` rendered on `<html>` from the
    active locale.
  - RTL fixes to the few remaining physical-direction Tailwind classes
    (`CategoryNavigation`, `Products/Show`, `Account/Addresses`, the
    `GuestLayout` back-arrow glyph).
  - Localized Laravel's built-in validation/auth error messages
    (`lang/ar/{validation,auth,passwords,pagination}.php`), including a full
    `attributes` translation map for every field name used across the app.
  - Address-form validation errors are now actually rendered (`FormField` per
    field in `Account/Addresses.vue`) — a pre-existing gap that meant they
    were silently invisible even before this change.
  - Extracted two recurring Tailwind class pairs into `classNames.js`:
    `mutedTextClass` and `mutedLinkClass`.
- Added `database/sql/grocery_products_seed.sql` — a standalone SQL script
  (not part of the Laravel seeder/factory system) seeding a grocery product
  catalog in Arabic, with real food photos sourced from LoremFlickr.
- Brought `composer ci:check` to fully green (eslint, prettier, vue-tsc, pint,
  phpstan, Pest, Vitest) — previously it had never passed cleanly:
  - Migrated all 33 remaining plain-`<script setup>` Vue components to
    `<script setup lang="ts">`; added `resources/js/types/{ziggy,inertia,shims-vue}.d.ts`
    ambient type declarations to support it.
  - Fixed the `resources/js/app.ts` page-resolver typing (`resolvePageComponent`
    never unwraps a module's `.default` itself — the generic needs to reflect
    the real `{ default: DefineComponent }` module shape, not a bare component).
  - Added generic-typed `@return` PHPDoc to every Eloquent relation and
    `@use HasFactory<...>` to every model, and `--memory-limit=1G` to
    `composer types:check` (PHPStan was OOM-crashing under PHP's stock 128M).
  - Fixed real bugs surfaced along the way: `User` model was missing
    `implements MustVerifyEmail`; removed a dead, broken `UserFactory::withTwoFactor()`
    factory state referencing three DB columns that don't exist in the
    schema (plus the matching phantom PHPDoc/`Hidden` entries on `User`);
    replaced a fragile `?->id` route-param pattern in `UpdateCategoryRequest`/
    `UpdateProductRequest` with `Rule::unique()->ignore()`.
- Hardened and completed the address feature (backend + frontend):
  - **Backend**: extracted `StoreAddressRequest`/`UpdateAddressRequest` out of
    `AddressController`'s inline `validate()` calls; added the app's first
    `Policy` (`AddressPolicy`, `view`/`update`/`delete`) and an
    `AuthorizesRequests` trait on the base `Controller` so `$this->authorize()`
    is available — replaces the old manual `$request->user()->id !== $address->user_id`
    checks duplicated across `update`/`destroy`/`setDefault`.
  - Removed `user_id` from `Address::$fillable` (mass-assignment hardening —
    it was never actually settable via request data, since no validation
    rule ever whitelisted it, but this closes the door on a future
    `Address::create($request->all())`-style regression).
  - Fixed a real bug in the "only one default address per user" invariant:
    updating an address with `is_default: false` (or omitted, e.g. an
    unchecked checkbox) used to blindly write that value through, silently
    leaving the user with *no* default address at all. `is_default` can now
    only become `false` as a side effect of a different address becoming the
    default — added `Address::makeDefault()` to hold that single unset-others
    -then-set-self transaction, called from `store`/`update`/`setDefault`
    instead of each duplicating it. (Deliberately did **not** apply the same
    treatment to `destroy` or first-address creation — losing the default
    via an explicit delete, or a first address never being marked default,
    are both legitimate states a user can choose, not accidental data loss.)
  - Filled in the previously-missing update and set-default UI in
    `Account/Addresses.vue` (only create/delete existed before): an edit
    `Modal` reusing the same field set as the add form, and a per-row
    "set as default" action — backed by the routes/controller actions that
    already existed but had no frontend entry point.
  - Extracted the shared field markup between the add-form and edit-modal
    into `Account/Partials/AddressFormFields.vue`.
- Merged `TextInput`/`InputLabel`/`InputError` into a single `FormField.vue`
  (label + input + error, self-generating a unique id via Vue 3.5's
  `useId()` so the same form can render twice at once — e.g. the address add
  form and edit modal together — without colliding `label for`/`id` pairs)
  and migrated every consumer to it: all six Auth pages, all three Profile
  partial forms, `Account/Partials/AddressFormFields.vue`, and
  `ProductFilters.vue`'s text/number fields (its `category_id` `<select>`
  keeps using bare `InputLabel`, since `FormField` only wraps a `<TextInput>`-
  style field). `TextInput.vue`/`InputError.vue` and their standalone test
  files no longer exist — `InputLabel.vue` stays, since `ProductFilters`
  still uses it directly.
- Dark-mode pass: found and fixed ~13 places across the design-system
  components and pages where a Tailwind color utility (`text-*`, `bg-*`,
  `border-*`) was hardcoded with no `dark:` counterpart, so it rendered with
  the wrong (sometimes near-invisible) color once dark mode was toggled —
  `Checkbox`, `Modal`'s panel background, `TextLink`'s default variant,
  `ShopAuthBanner`'s logout-item focus state, `ProductGallery`'s image
  borders/thumbnail background, the product-page stock indicator, every
  `Profile/Partials/*` section heading, and `Account/Addresses.vue`'s page
  header/row border/"Default" label. Left `DangerButton`/`buttonVariants.primary`'s
  solid fill colors alone — those intentionally stay constant across themes
  (an unprefixed Tailwind class already applies in both modes; adding a
  same-value `dark:` variant would be a no-op, not a fix).
- Audited every frontend test file for a specific gap — a test asserting a
  page/component renders correctly without checking that its *children*
  actually received the right props (as opposed to just checking rendered
  text or a native `<input>`'s DOM value) — and added the missing assertions
  across 14 files: `Head`'s `title` prop (`Account/Orders`, `Products/Index`,
  `Products/Show`, `Categories/Show`), `PrimaryButton`'s forwarded `disabled`
  attribute reflecting `form.processing` (all six Auth pages),
  `ConfirmationDialog`'s full prop set (`title`/`message`/`confirmLabel`/
  `danger`/`processing`, not just `show`) in both of its consumers
  (`Account/Addresses`, `ShopAuthBanner`), and `CatalogLayout`/`ProductCard`/
  `ProductFilters`'s prop pass-through in the shop tests.
