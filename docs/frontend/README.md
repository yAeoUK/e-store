# Frontend Guidelines

Guidance for Inertia + Vue code in `resources/js`.

Contents
- Folder structure overview (`pages`, `components`, `tests`)
- Component conventions and prop validation
- Using Inertia: `Inertia::render`, lazy-loading, and routing
- State management patterns (if any)

Tips
- Add skeletons for deferred props and client-side loading states.

Quick links to source

- Inertia + Vue bootstrap (`createInertiaApp`): [resources/js/app.ts](../../resources/js/app.ts#L1-L21)
- Blade layout (Vite + Inertia includes): [resources/views/app.blade.php](../../resources/views/app.blade.php#L1-L40)

Routing (`route()`)

- The frontend never hardcodes URLs — every link/redirect goes through Ziggy's
  `route()` helper (`route('login')`, `route('account.addresses.store')`,
  etc.), installed as a Vue plugin: [resources/js/app.ts](../../resources/js/app.ts#L1-L21)
  (`app.use(ZiggyVue)`). This makes `route()` a real global — it doesn't need to
  be imported, and works both inside `<script setup>` and directly in template
  expressions.

i18n (`t()`)

- All user-facing copy goes through `t('namespace.key')`, backed by a plain
  nested-object dictionary — no external i18n library:
  [resources/js/i18n/index.ts](../../resources/js/i18n/index.ts#L1-L53). Locale
  files live under `resources/js/i18n/locales/{en,ar}/` split by domain
  (`common`, `shop`, `auth`, `profile`, `account`). If a key isn't found, `t()`
  returns the path itself rather than throwing, which is handy for spotting
  missing translations in the rendered UI. Add new copy to **both** the `en`
  and `ar` domain file rather than inlining strings in components.
- **Locale resolution**: `t()`'s default `locale` argument is
  `currentLocale` — resolved *once*, at module load, from
  `document.documentElement.lang` (falling back to `'en'` if unset/unrecognized):
  [resources/js/i18n/index.ts](../../resources/js/i18n/index.ts#L32-L38). It's a
  plain constant, not a reactive ref, because the app only ever changes locale
  via a full page reload (see below) — there's no case where it needs to
  change mid-session, so none of the ~20+ existing `t('...')` call sites had to
  be touched when Arabic was added.
- **Keeping `en`/`ar` in sync**: each `locales/ar/*.ts` file is typed
  `satisfies <Domain>Translations` against a named type exported from its
  English counterpart (e.g. `ShopTranslations` from
  [locales/en/shop.ts](../../resources/js/i18n/locales/en/shop.ts)), so a
  missing or renamed key fails `npm run types:check` at compile time instead
  of silently falling back to the raw key path at runtime. This needs a
  **named type export**, not `import enShop from '../en/shop'; ... satisfies
  typeof enShop` — TypeScript doesn't allow `typeof` on a type-only import, and
  a non-type-only import of a value only used inside `satisfies` trips the
  `consistent-type-imports` lint rule. So each `en/*.ts` file binds its object
  to a local const and additionally exports its inferred type
  (`export type ShopTranslations = typeof shop`), and the matching `ar/*.ts`
  does `import type { ShopTranslations } from '../en/shop'`.

Locale switching & RTL

- `LanguageSwitcher.vue` (an EN/AR toggle) is mounted in both `ShopLayout` and
  `GuestLayout`'s header area:
  [resources/js/components/LanguageSwitcher.vue](../../resources/js/components/LanguageSwitcher.vue#L1-L32).
  It reads the current locale the same way `t()` does
  (`document.documentElement.lang`) and links the *other* locale to
  `route('locale.update', code)` — deliberately a plain `<a>`, not an Inertia
  `<Link>`. Switching locale has to cause a **full browser reload**: `dir`/
  `lang` on `<html>` are rendered server-side in `app.blade.php` from
  `app()->getLocale()`, and only refresh on a real navigation, not an Inertia
  XHR visit. See [docs/architecture.md](../architecture.md) for the
  `HandleLocale` middleware / cookie / route on the backend side of this.
- **RTL**: `app.blade.php` sets `dir="rtl"`/`dir="ltr"` on `<html>` based on
  `config('app.rtl_locales')`. Tailwind v4 ships logical-property utilities
  (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`/`text-end`, `border-s`/
  `border-e`) and core `rtl:`/`ltr:` variants keyed off that attribute
  out of the box — no plugin, no `tailwind.config` changes needed. Prefer
  logical properties for anything direction-sensitive; reach for an explicit
  `rtl:`/`ltr:` variant pair only when there's no logical-property equivalent,
  like the back-arrow glyph swap in
  [resources/js/Layouts/GuestLayout.vue](../../resources/js/Layouts/GuestLayout.vue#L22)
  (`<span class="rtl:hidden">&larr;</span><span class="ltr:hidden">&rarr;</span>`).
  `Dropdown.vue`'s `alignmentClasses` (`ltr:origin-top-right rtl:origin-top-left
  end-0`) is the other reference example — written before Arabic support
  existed, but already following this exact convention.

Layouts (`resources/js/Layouts/`)

- `GuestLayout.vue` — wraps the unauthenticated Auth pages (Login, Register,
  password reset flow) in a centered card with the shop logo and a
  "back to shop" link.
- `ShopLayout.vue` — wraps every authenticated/shop page (product & category
  browsing, Account pages, Profile) with the site header, `ShopAuthBanner`
  (login/register links or the user menu + logout), and an optional `#header`
  slot for a page title.

Pages

- Products index (`applyFilters` handler): [resources/js/pages/Products/Index.vue](../../resources/js/pages/Products/Index.vue#L15-L20)
- Product detail (uses `ProductGallery`): [resources/js/pages/Products/Show.vue](../../resources/js/pages/Products/Show.vue#L45-L45)
- Auth pages (`pages/Auth/`): `Login`, `Register`, `ForgotPassword`,
  `ResetPassword`, `ConfirmPassword`, `VerifyEmail` — each a thin form wrapped
  in `GuestLayout`, using Inertia's `useForm()` for submission/validation
  errors. See [resources/js/pages/Auth/Login.vue](../../resources/js/pages/Auth/Login.vue#L1-L35) as the representative example.
  All six back onto the Breeze-style controllers under
  `app/Http/Controllers/Auth/` and the routes in `routes/auth.php`.
- Account pages (`pages/Account/`): `Addresses.vue` (list + add + delete +
  set-default, backed by `app/Http/Controllers/Account/AddressController.php`)
  and `Orders.vue` (currently a static placeholder — no orders feature yet).
- Profile pages (`pages/Profile/`): `Edit.vue` composes three partial forms
  under `Profile/Partials/` (`UpdateProfileInformationForm`,
  `UpdatePasswordForm`, `DeleteUserForm`), backed by Breeze's
  `ProfileController`.

Shared component library

- `resources/js/components/*.vue` (top level, not `shop/`) holds generic,
  reusable UI primitives — buttons, form inputs, `Modal`, `Dropdown`,
  `ConfirmationDialog`, typography wrappers, etc. — used across Auth, Account,
  Profile, and shop pages alike. See [docs/design-system/README.md](../design-system/README.md)
  for the full inventory and the shared Tailwind class tokens in `classNames.js`.

Shop-specific components

- Catalog layout (category + filters slots): [resources/js/components/shop/CatalogLayout.vue](../../resources/js/components/shop/CatalogLayout.vue#L35-L39)
- Product card (image & title): [resources/js/components/shop/ProductCard.vue](../../resources/js/components/shop/ProductCard.vue#L31-L31) and [resources/js/components/shop/ProductCard.vue](../../resources/js/components/shop/ProductCard.vue#L45-L45)
- Product gallery (`selectedImage` & `images`): [resources/js/components/shop/ProductGallery.vue](../../resources/js/components/shop/ProductGallery.vue#L16-L24)
- Product gallery (main image render): [resources/js/components/shop/ProductGallery.vue](../../resources/js/components/shop/ProductGallery.vue#L33-L38)
- Product filters (`applyFilters` + form): [resources/js/components/shop/ProductFilters.vue](../../resources/js/components/shop/ProductFilters.vue#L20-L27) and [resources/js/components/shop/ProductFilters.vue](../../resources/js/components/shop/ProductFilters.vue#L31-L36)
- Category navigation (header and list): [resources/js/components/shop/CategoryNavigation.vue](../../resources/js/components/shop/CategoryNavigation.vue#L16-L16) and [resources/js/components/shop/CategoryNavigation.vue](../../resources/js/components/shop/CategoryNavigation.vue#L19-L23)

If you prefer different anchors or additional files linked here, tell me which ones and I'll add them.
