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

- Inertia + Vue bootstrap (`createInertiaApp`): [resources/js/app.ts](../../resources/js/app.ts#L1-L29)
- Blade layout (Vite + Inertia includes): [resources/views/app.blade.php](../../resources/views/app.blade.php#L1-L40)

TypeScript

- Every `.vue` file uses `<script setup lang="ts">` — this was a full-repo
  migration (33 files were still plain `<script setup>`, mixed in with an
  already-TS majority); there's no "some components are JS" exception anymore.
  New components should follow suit from the start.
- Ambient type declarations live under
  [resources/js/types/](../../resources/js/types/) (all three feed into
  `tsconfig.json`'s `resources/js/**/*.d.ts` include, no per-file wiring
  needed):
  - `ziggy.d.ts` — declares the global `route()` function (Ziggy installs it
    at runtime via the `ZiggyVue` plugin, but nothing in `ziggy-js`'s own
    types declares it as a global or as a Vue `ComponentCustomProperty`).
    Needed for both bare script-level calls (`route('login')`) and template
    calls (`<Link :href="route('home')">`, which compile to `_ctx.route(...)`
    and specifically need the `ComponentCustomProperties` augmentation, not
    just the global function).
  - `inertia.d.ts` — types Inertia's shared page props (`name`, `auth.user`,
    `sidebarOpen`) via `declare module '@inertiajs/core' { interface
    InertiaConfig { sharedPageProps: {...} } }` — Inertia v3's own documented
    extension point. **Adding a new key to `HandleInertiaRequests::share()`
    needs a matching addition here**, or `usePage().props.yourNewKey` won't
    type-check anywhere.
  - `shims-vue.d.ts` — the standard `declare module '*.vue'` shim so plain
    `.ts` files (not `vue-tsc`-processed `.vue` SFCs) know what a `.vue`
    import's default export shape is.
- **`app.ts`'s `resolve()` function is more fragile than it looks.**
  `resolvePageComponent()` just calls the lazy-import function and returns
  whatever it resolves to — it does **not** unwrap `.default` itself. A real
  dynamic import of a `.vue` file resolves to the module object
  `{ default: DefineComponent }`, not the bare component. Typing
  `resolvePageComponent`'s generic (and `import.meta.glob`'s own generic) as
  bare `DefineComponent` instead of `{ default: DefineComponent }` looks
  more "correct" but produces a confusing, over-widened inferred type
  (`DefineComponent | Promise<DefineComponent> | (() => Promise<DefineComponent>)`)
  that `vue-tsc` can't reconcile against Inertia's `ComponentResolver` type —
  because `import.meta.glob`'s no-options overload has no argument to infer
  its own generic from, so it ends up inferring across multiple overloads at
  once. The fix is to pin **both** generics to the real module shape and
  unwrap `.default` explicitly:
  [resources/js/app.ts](../../resources/js/app.ts#L9-L14). Don't
  "simplify" this back to a bare `DefineComponent` generic — it'll silently
  reintroduce the exact same `vue-tsc` failure.

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
  (`common`, `shop`, `auth`, `profile`, `account`, `admin`). If a key isn't found, `t()`
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

Form validation (client-side)

- Every submit form validates on the client **in addition to** the backend
  `FormRequest`/inline `$request->validate()` rules it already had — the
  backend remains the source of truth (uniqueness, existence, auth checks),
  the client layer only short-circuits the obvious, non-DB-dependent cases
  (required, format, length, numeric range, password confirmation match)
  before a round trip happens.
- `resources/js/lib/validation.ts` is the whole utility — no external
  validation library (no vee-validate/yup/zod/vuelidate is installed).
  Validator factories (`required(label)`, `isEmail(label)`,
  `maxLength(label, limit)`, `numeric(label)`, `integer(label)`,
  `min(label, limit)`, `confirmedBy(label, otherField)`) each return a
  `(value, data) => string | null` function. `validateFields(data, rules)`
  runs a `{ field: [validator, ...] }` map against a data object and returns
  only the fields that failed. `required`/`min` treat `0`/`false` as present
  — only `null`/`undefined`/`''`/whitespace-only counts as missing, so a
  numeric field defaulting to `0` (e.g. `stock`) doesn't spuriously fail a
  `required` check. `minLength`/`max` were removed as dead code (no
  remaining callers); `filesRequired`/`fileType`/`fileMaxSize` moved out of
  this shared file into `ProductImageManager.vue` itself once it turned out
  to be their only caller (see the single-caller convention in
  [docs/design-system/README.md](../design-system/README.md)) — that
  component's file-selection validation is otherwise unchanged.
  Rule-*set* builders that mirror the backend's `SharedRules` shapes now
  live alongside the individual validators: `passwordConfirmationRules(labels)`,
  `nameEmailPasswordRules(labels)` (registration/admin-creation),
  `categoryValidationRules(labels)`, and `productValidationRules(labels)`
  each return a ready-made `{ field: Validator[] }` rules map instead of
  every caller re-assembling the same field list by hand.
- **DB-dependent backend rules stay server-only** — `unique`, `exists`, and
  similar aren't mirrored client-side; there's nothing to check without a
  round trip, so those fields still only get an error after the server
  responds.
- **Messages come from a dedicated i18n domain**,
  `resources/js/i18n/locales/{en,ar}/validation.ts`, via a new `tp(path,
  params, locale?)` export in [resources/js/i18n/index.ts](../../resources/js/i18n/index.ts)
  — the same dot-path lookup as `t()`, plus `{token}` interpolation from
  `params` (e.g. `tp('validation.required', { field: t('auth.login.email') })`
  → `"Email is required."`). `t()`'s own signature is untouched (its 2nd
  positional argument is already used as a locale override by
  `tests/lib/i18n.test.ts`), so `tp()` is a separate, additive export rather
  than an extra `t()` argument. Validator factories call `tp()` internally;
  callers just pass the field's already-translated label (the same string
  already used for that field's `label` prop) as the first argument — no new
  per-field label keys needed.
- **The pattern lives in composables now, not hand-rolled per component.**
  The original shape (a `rules` map, an `attempted` ref, and a `computed`
  re-running `validateFields` only once a submit is attempted) is still
  exactly what happens under the hood, but it's been extracted to
  `resources/js/composables/`, in four layers from lowest- to
  highest-level — reach for the highest one that fits, not the raw
  primitive, so a new form doesn't re-inline the same three-piece
  boilerplate:
  - `useFormValidation(form, rules)` — the base primitive: takes an
    already-constructed `useForm()` result, returns `{ attempted,
    clientErrors, errors (client merged over server), fieldErrors (server
    merged over client), attemptSubmit(), reset() }`. Reach for this
    directly only when the page needs custom control over `submit()` beyond
    a single `form.post/put/patch/delete` call — e.g.
    [resources/js/pages/Checkout/Index.vue](../../resources/js/pages/Checkout/Index.vue),
    which calls `attemptSubmit()` itself before `form.post(route('checkout.store'))`.
  - `useValidatedSubmit(initialValues, rules, onSubmit)` — the common case:
    owns the `useForm()` call too, returns `{ form, clientErrors, errors,
    fieldErrors, submit, reset }` where `submit` already guards
    `onSubmit(form)` behind `attemptSubmit()`. Used by every Auth page, the
    three Profile partial forms, `Admin/Admins/Create.vue`,
    `Admin/Orders/Show.vue` (both its status-change and admin-note forms),
    and every admin Create/Edit page (`Admin/Products/{Create,Edit}.vue`,
    `Admin/Categories/{Create,Edit}.vue`). Most callers bind `errors`; admin
    Create/Edit pages instead bind `fieldErrors` since they hand a whole
    errors object down to a shared fields component (see "Display" below).
    See [resources/js/pages/Auth/Login.vue](../../resources/js/pages/Auth/Login.vue)
    for the reference implementation (this used to hand-roll the pattern
    inline — now it's a three-line `useValidatedSubmit()` call). This
    composable fully absorbed the now-deleted `useAdminResourceForm.ts` —
    that composable's exact shape is what `useValidatedSubmit` grew into once
    it also gained the `fieldErrors` (server-first) return, so there's no
    longer a separate admin-specific variant.
  - `useEditableForm(createInitialValues, rules, populate)` — for a "list
    with an add form and an edit-modal" manager that needs *two* independent
    `useForm()`/validation instances plus the `editingId`/`edit()`/
    `closeEdit()` bookkeeping between them. `createInitialValues` is a
    factory function (not a plain object) called once per form instance, so
    the add-form and edit-form never share a nested object (e.g. an
    `options` map) by reference. Returns both instances' `errors`/
    `fieldErrors` pairs (`fieldErrors`/`editFieldErrors` for the second
    form). Used by `Account/Addresses.vue` and
    `admin/ProductVariantManager.vue`.

  Outside this validation stack, a handful of smaller composables cover
  other repeated interaction patterns:
  - `useConfirmAction(action)` — a generic confirm/processing/run/cancel
    state machine for "click, confirm in a dialog, then fire an async
    action." `useDeleteConfirmation` (above) is now a thin wrapper over it;
    direct callers include `Admin/Users/Index.vue` (promote/revoke),
    `Admin/Orders/Show.vue` (the refund flow), and `ShopAuthBanner.vue` (the
    logout confirmation).
  - `useEscapeKey(handler)` — mounts/unmounts an Escape-keydown listener;
    used by `Modal.vue` instead of each modal-based component wiring its own
    `document.addEventListener('keydown', ...)`.
  - `useFilterForm(filters, defaults)` (plus a `submitFilters(routeName,
    params)` helper) — reactive filter state seeded from the server's echoed
    filter props (see `FiltersIndexRequests` in
    [docs/architecture.md](../architecture.md)) and a shared `router.get`
    submit call. Used by `Admin/Users/Index.vue`, `Admin/Categories/Index.vue`,
    `Admin/Orders/Index.vue`, `Admin/Products/Index.vue`, and
    `shop/ProductFilters.vue`.
  - `useServerError(key)` — reactively reads `usePage().props.errors[key]`.
    Used by `Admin/Categories/Index.vue`/`Admin/Admins/Index.vue` (the
    can't-delete/revoke flash error) and `Admin/Orders/Show.vue` (a failed
    refund's error).

  Whichever layer a page uses, errors only show once a submit has actually
  been attempted, not while the user is still filling the form in for the
  first time; every layer also passes the live `form` object into
  `validateFields` internally, **not** `form.data()` — the Vitest mock's
  `form.data()` returns a frozen snapshot of the values `useForm()` was
  called with, not the live values, so relying on it would silently validate
  stale data under test even though real Inertia's `data()` is live.
- **Display**: components binding `FormField`/`SelectField`/etc directly to
  a `useValidatedSubmit`/`useFormValidation` result use its client-first
  `errors` (`:error="errors.x"` — client and server are combined for you).
  Pages handing a whole errors object down to a shared fields component
  (`CategoryFormFields`, `ProductFormFields`, `AddressFormFields`) instead
  bind `fieldErrors`/`editFieldErrors`: `:errors="fieldErrors"` — the
  server-first merge, since a server-side failure (e.g. a uniqueness check)
  should win over a stale client-side error for the same field. Both merges
  live in `useFormValidation` itself, not hand-rolled per call site. No
  changes were needed to `FormField`/`SelectField`/`TextareaField`/
  `InputError` themselves — they already just render whatever string lands
  in their `error`/`message` prop.
- **Reset alongside the existing error-reset points.** Any form that can be
  reopened (an edit modal) resets its `attempted` ref back to `false`
  wherever the code already calls `clearErrors()`/`reset()` for that form
  (opening/closing the address or product-variant edit modals) — otherwise
  reopening the modal shows stale validation state from the previous edit.
- **`ProductImageManager.vue` doesn't fit the pattern above** — it has no
  `<form>`/submit button and auto-submits from the file input's `@change`
  handler. It validates the raw `File[]` selection synchronously (via
  `filesRequired`/`fileType`/`fileMaxSize`) before compressing or posting,
  setting a local `fileError` ref and returning early on failure, rendered
  via `<InputError :message="fileError || form.errors.images" />` — that
  error display didn't exist there at all before, for either client or
  server errors.

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
  `ShopAuthBanner.vue`'s account-menu panel classes
  (`ltr:origin-top-right rtl:origin-top-left end-0`) are the other reference
  example — written before Arabic support existed, but already following this
  exact convention.

Layouts (`resources/js/Layouts/`)

- `GuestLayout.vue` — wraps the unauthenticated Auth pages (Login, Register,
  password reset flow) in a centered card with the shop logo and a
  "back to shop" link.
- `ShopLayout.vue` — wraps every authenticated/shop page (product & category
  browsing, Account pages, Profile) with the site header, `ShopAuthBanner`
  (login/register links or the user menu + logout), and an optional `#header`
  slot for a page title.
- `AdminLayout.vue` — wraps every `pages/Admin/*` page: a header (logo,
  "back to shop" link, `LanguageSwitcher`, `ShopAuthBanner`) plus a
  `SidebarNav` (Dashboard/Products/Categories/Users/Orders/Admins, active-item
  highlighting matched by URL prefix against `usePage().url`) and the same
  optional `#header` slot convention as `ShopLayout`.

Pages

- Products index (`applyFilters` handler): [resources/js/pages/Products/Index.vue](../../resources/js/pages/Products/Index.vue#L15-L20)
- Product detail (inline gallery: `galleryImages` + `selectedImage`): [resources/js/pages/Products/Show.vue](../../resources/js/pages/Products/Show.vue#L52-L59)
- Auth pages (`pages/Auth/`): `Login`, `Register`, `ForgotPassword`,
  `ResetPassword`, `ConfirmPassword`, `VerifyEmail` — each a thin form wrapped
  in `GuestLayout`, using Inertia's `useForm()` for submission/validation
  errors. See [resources/js/pages/Auth/Login.vue](../../resources/js/pages/Auth/Login.vue#L1-L35) as the representative example.
  All six back onto the Breeze-style controllers under
  `app/Http/Controllers/Auth/` and the routes in `routes/auth.php`.
- Account pages (`pages/Account/`): `Addresses.vue` (list + add + delete +
  set-default, backed by `app/Http/Controllers/Account/AddressController.php`,
  using the `useEditableForm` composable — see "Form validation" above) and
  `Orders.vue` / `Orders/Show.vue` (order history list + single-order detail,
  backed by `app/Http/Controllers/Account/OrderController.php` — see
  [docs/architecture.md](../architecture.md)'s "Cart, checkout & payments"
  section for the backend side). Both render `OrderStatusBadge`, and
  `Show.vue` additionally renders `PaymentStatusBadge`,
  `OrderItemsSummary`, and `AddressLines` (against the order's
  `shipping_address_snapshot`) — see
  [docs/design-system/README.md](../design-system/README.md) for all three.
- Cart & checkout (`pages/Cart/Index.vue`, `pages/Checkout/Index.vue`):
  `Cart/Index.vue` lists/edits/removes cart line items (quantity edits go
  through a `ConfirmationDialog`-hosted mini-form, removal/clear through
  `useDeleteConfirmation`) and links to checkout;
  `Checkout/Index.vue` shows the cart summary (`OrderItemsSummary`) plus a
  shipping-address picker and payment-method picker, both built from
  `RadioCardOption` list items, validated via `useFormValidation` (see "Form
  validation" above) before `form.post(route('checkout.store'))`. Both pages
  share the cart subtotal calculation via the `useCartSubtotal` composable.
  Backed by `CartController`/`CheckoutController` — see
  [docs/architecture.md](../architecture.md)'s "Cart, checkout & payments"
  section for the full backend flow (stock locking, snapshotting, Stripe).
- Profile pages (`pages/Profile/`): `Edit.vue` composes three partial forms
  under `Profile/Partials/` (`UpdateProfileInformationForm`,
  `UpdatePasswordForm`, `DeleteUserForm`), backed by Breeze's
  `ProfileController`.
- Admin pages (`pages/Admin/`), wrapped via `AdminPageHeader` (which itself
  wraps `AdminLayout` — see [docs/design-system/README.md](../design-system/README.md))
  — except `Dashboard.vue`, which still wraps `AdminLayout` directly since it
  has no page-header actions slot to share — backed by the controllers under
  `app/Http/Controllers/Admin/` (see
  [docs/architecture.md](../architecture.md)'s "Admin panel & authorization"
  section for the backend side): `Dashboard.vue` (stat cards + revenue/category
  charts, each chart wrapped in the `ChartCard` layout shell); Create/Edit
  pairs (`Products`, `Categories`, `Admins/Create`) compose
  `AdminResourceForm` (the shared form chrome: card, submit/cancel buttons,
  processing state) around a shared `<Entity>FormFields` component
  (`CategoryFormFields`/`ProductFormFields`/`VariantFormFields`) and the
  `useValidatedSubmit` composable (see "Form validation" above);
  `Products/Edit.vue` additionally renders `ProductImageManager` and
  `ProductVariantManager` below the main form; `Users/Index.vue` and
  `Admins/Index.vue` (list + promote/revoke flows, each backed by a
  `ConfirmationDialog`); `Orders/Index.vue` (read-only list, status/payment
  rendered via `OrderStatusBadge`/`PaymentStatusBadge`, with a search box and
  a per-customer `user_id` filter, plus — added on `feature/admin.orders` —
  `status`/`date_from`/`date_to` filters, all via the `useFilterForm`
  composable). `Orders/Show.vue` (added on `feature/admin.orders`) is the one
  order-editing page: a status-change form (limited to the server-supplied
  `allowed_transitions`), an admin-note form, and a refund action gated
  behind a `ConfirmationDialog`/`useConfirmAction` — see
  [docs/architecture.md](../architecture.md)'s "Admin order editing,
  cancellation & refunds" section for the backend rules it's bound to, and
  [docs/design-system/README.md](../design-system/README.md) for the
  `CustomerContact`/`OrderShippingAddressCard`/`OrderSummaryCard`/
  `OrderNoteCard` components it composes. All list pages compose `DataTable` for
  the actual table markup — see
  [docs/design-system/README.md](../design-system/README.md) for that and
  the `resources/js/components/admin/admin.ts` shared TypeScript types
  (`Paginated<Row>`, `DataTableColumn<Row>`, `AdminProduct`, `AdminCategory`,
  `AdminOrder`, etc.) every admin page/component types its props against.

Shared component library

- `resources/js/components/*.vue` (top level, not `shop/`) holds generic,
  reusable UI primitives — buttons, form inputs, `Modal`,
  `ConfirmationDialog`, typography wrappers, etc. — used across Auth, Account,
  Profile, and shop pages alike. See [docs/design-system/README.md](../design-system/README.md)
  for the full inventory and the shared Tailwind class tokens in `classNames.ts`.
- `resources/js/components/admin/` holds admin-panel-only composites
  (`DataTable`, `CategoryFormFields`, `ProductFormFields`, `SlugField`,
  `ProductImageManager`, `ProductVariantManager`, `StatCard`, the chart
  wrappers, `admin.ts`'s shared types) — not reused outside `pages/Admin/`.
- `resources/js/components/ui/` holds [shadcn-vue](https://www.shadcn-vue.com/)-style
  primitives (`table/*`, `badge/*`) generated against the `components.json`
  config at the repo root, then adapted to import this app's `classNames.ts`
  tokens instead of shadcn's default raw Tailwind literals. `resources/js/lib/utils.ts`'s
  `cn()` (the standard `clsx` + `tailwind-merge` combinator) is the class-merging
  helper every `ui/*` component uses for its `class` prop — see
  [docs/design-system/README.md](../design-system/README.md) for what each
  primitive does.
- `resources/js/lib/navigation.ts` exports `isCurrentPath(url, href)` (a
  prefix match with a boundary check), used by `Layouts/AdminLayout.vue` and
  `shop/CategoryNavigation.vue` for active-nav-item highlighting.
- `resources/js/lib/orderStatus.ts` exports one type, `OrdersNamespace =
  'account.orders' | 'admin.orders'` — see `OrderStatusBadge`/
  `PaymentStatusBadge`/`OrderSummaryCard`/`OrderShippingAddressCard` in
  [docs/design-system/README.md](../design-system/README.md).
- `resources/js/lib/slug.ts` (exporting `slugify()`) was deleted once
  `SlugField.vue` turned out to be its only caller — the function now lives
  inline in that component instead. It still mirrors the backend's
  `HasUniqueSlug` trait's own slugification without calling the backend —
  a client-side preview only; the server always has the final say and
  appends its own `-1`/`-2` suffix on collision.

Shop-specific components

- Catalog layout (category + filters slots): [resources/js/components/shop/CatalogLayout.vue](../../resources/js/components/shop/CatalogLayout.vue#L35-L39)
- Product card (image & title): [resources/js/components/shop/ProductCard.vue](../../resources/js/components/shop/ProductCard.vue#L31-L31) and [resources/js/components/shop/ProductCard.vue](../../resources/js/components/shop/ProductCard.vue#L45-L45)
- Product filters (`applyFilters` + form): [resources/js/components/shop/ProductFilters.vue](../../resources/js/components/shop/ProductFilters.vue#L20-L27) and [resources/js/components/shop/ProductFilters.vue](../../resources/js/components/shop/ProductFilters.vue#L31-L36)
- Category navigation (header and list): [resources/js/components/shop/CategoryNavigation.vue](../../resources/js/components/shop/CategoryNavigation.vue#L16-L16) and [resources/js/components/shop/CategoryNavigation.vue](../../resources/js/components/shop/CategoryNavigation.vue#L19-L23)

If you prefer different anchors or additional files linked here, tell me which ones and I'll add them.
