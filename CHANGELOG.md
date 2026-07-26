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
  - Address-form validation errors are now actually rendered (`InputError` per
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
