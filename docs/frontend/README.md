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
  [resources/js/i18n/index.ts](../../resources/js/i18n/index.ts#L1-L33). Locale
  files live under `resources/js/i18n/locales/en/` split by domain (`common`,
  `shop`, `auth`, `profile`, `account`); only `en` exists today
  (`LocaleKey` is currently just `'en'`). If a key isn't found, `t()` returns
  the path itself rather than throwing, which is handy for spotting missing
  translations in the rendered UI. Add new copy to the matching domain file
  rather than inlining strings in components.

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
