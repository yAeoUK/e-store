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
