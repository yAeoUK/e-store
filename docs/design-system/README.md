# Design System

The shared UI layer under `resources/js/components/` (top level — not the
`shop/` subfolder, which holds catalog-specific components). Introduced on
`feature/authentication` to give Auth, Account, Profile, and shop pages a
consistent look, replacing what used to be ad-hoc repeated Tailwind class
strings in each page.

## Shared class tokens (`resources/js/components/classNames.ts`)

A small registry of Tailwind class strings shared across components — the
"design tokens" for this project (no CSS variables or Tailwind theme config
beyond this). Import from here instead of re-typing a class string that
already exists:

- `buttonVariants.primary` / `.secondary` — button color/shape, used by
  `PrimaryButton`, `SecondaryButton`, and `ButtonLink`.
- `interactiveRowClass` — text color + hover/focus background for clickable
  list rows (dropdown items, category nav links, `SidebarNav` items,
  `ui/table`'s `TableRow`); includes both `hover:` and `focus:` background
  variants so mouse and keyboard interaction look the same.
- `formFieldClass` — the standard bordered input/select look; `formFieldBlockClass`
  is the same plus `mt-1 block`, for a `<textarea>` or a field that sits below
  its label rather than inline. `formGridClass` (`grid gap-4 sm:grid-cols-2`)
  and `filterFormClass` (`grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end`)
  are the two recurring form-layout grid shapes — the former for a paired
  name/slug row on the admin Create/Edit forms, the latter for a
  search-field-plus-submit-button filter bar on the admin index pages.
- `borderColorClass` (`border-slate-300 dark:border-slate-700`) — the default
  border color pairing, extracted after turning up inline in
  `buttonVariants.secondary`, `formFieldClass`, `Pagination`, `SlugField`, and
  `CatalogLayout`'s empty state. Compose it with your own `border`/`border-*`
  shape utilities, e.g. `:class="[borderColorClass, 'rounded-lg border ...']"`.
  Distinct from the lighter `mutedBorderClass` pairing.
- `mutedBorderClass` (`border-slate-200 dark:border-slate-800`) — the lighter
  border pairing used by `cardSurfaceClass`, composed the same way as
  `borderColorClass`; also used directly by `AdminLayout`'s header rule,
  `SidebarNav`'s nested-list divider, `ui/table`'s `TableFooter`/`TableRow`,
  and the bordered tiles in `ProductImageManager`/`ProductVariantManager`.
- `headingTextClass` — heading text color (light/dark aware); `compactHeadingClass`/
  `subheadingTextClass`/`pageTitleClass` layer a fixed font-size/weight on top
  of it for, respectively, a small inline heading (a layout's logo caption), a
  card/section heading, and a page `<h1>` — reuse whichever size matches the
  role instead of restating `headingTextClass` plus ad-hoc `text-*`/`font-*`
  utilities. `FormSectionHeader`'s `dialogTitleClass` (used by
  `ConfirmationDialog`'s title, its only caller) is the same pattern but
  declared locally in the component instead — see the single-caller note
  below.
- `mutedTextClass` — de-emphasized text color (`text-slate-500 dark:text-slate-400`);
  extracted after the same pair turned up inline in four different components.
  `mutedBodyTextClass` is the slightly-darker sibling (`text-slate-600
  dark:text-slate-400`) used for actual body copy rather than de-emphasized
  labels (`MutedText`, product descriptions, `SlugField`'s read-only value).
  `eyebrowTextClass` composes `mutedTextClass` with the small-caps "eyebrow"
  treatment (`text-xs font-medium tracking-wide uppercase`) used above a
  `StatCard`/`ProductCard` heading.
- `mutedLinkClass` — `mutedTextClass`'s hover-capable counterpart for links
  (adds `hover:text-slate-700 dark:hover:text-slate-200`); used by
  `LanguageSwitcher`'s inactive-locale link and `GuestLayout`'s back-to-shop
  link so both set their own resting color explicitly rather than one relying
  on inheriting it from a parent element.
- `cardSurfaceClass` — the bordered/rounded card surface used by `Card`.
- `accentBadgeTextClass` — the small indigo "default"/"primary" badge label
  (`Account/Addresses`'s default-address tag, `ProductImageManager`'s primary
  image tag). `rowActionsClass` — the trailing action-button row shape
  (`flex flex-wrap items-start gap-2 sm:justify-end`) shared by
  `Account/Addresses`'s per-address actions and `ProductVariantManager`'s
  per-variant actions.
- `surfaceBgClass`/`pageBgClass` — the two recurring page-level backgrounds:
  `surfaceBgClass` (`bg-white dark:bg-slate-900/90`) for a raised
  header/card/pagination-link surface, `pageBgClass` (`bg-slate-50
  dark:bg-slate-950`) for the page canvas underneath it. `pageWidthClass`
  (`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`) is the shared responsive
  max-width container `PageContainer` and both `ShopLayout`/`AdminLayout`
  header rows compose from; `headerRowClass` is `pageWidthClass` plus the
  flex/gap layout for a layout's header row specifically.
- `wrapBetweenClass` (`flex flex-wrap items-center justify-between gap-3`) —
  the heading-plus-action-button row shape shared by the three admin index
  pages' `#header` slot and `DataTable`'s own footer row (summary text +
  `Pagination`).
- `focusRingClass` — the focus-visible ring used by `SecondaryButton`/`TextLink`.
- `legacyButtonBaseClass` — shape/padding/transition/disabled-state base
  shared by `SecondaryButton` and `DangerButton` (the two buttons that still
  use the older uppercase/tracked-letter-spacing button style, as opposed to
  `buttonVariants`). `ShopAuthBanner`'s equivalent base for its full-width
  dropdown-menu-item row (account-menu links and logout button) is declared
  locally as `dropdownItemBaseClass` in that component instead, since
  `ShopAuthBanner` is its only caller — see the single-caller note below.
- A few tokens (`controlPaddingClass`, `transitionClass`, `disabledClass`)
  are declared in `classNames.ts` but **not exported** — they exist only to
  compose the tokens above (`legacyButtonBaseClass`, `buttonVariants`) and
  have no consumer outside the file itself. If you find yourself wanting to
  import one of these two, check whether the composed token you actually need
  already exists first.

Note: `TextLink`'s `textLinkVariants` (`muted`/`slate`) live *inside*
`TextLink.vue` itself rather than in `classNames.ts` — they were moved there
after confirming `TextLink` was the only consumer, so keeping them local
avoided an unnecessary shared-file dependency for a single caller. Only
promote a variant map to `classNames.ts` once more than one component
actually needs it.

**Typing a `variant` prop that indexes a class-variant map**: a runtime
`defineProps({ variant: { type: String, default: 'secondary' } })` infers as
plain `string`, which doesn't type-check as an index into
`{ primary: string; secondary: string }` under `vue-tsc`. `ButtonLink` and
`TextLink` type these as `type: String as PropType<keyof typeof
buttonVariants>` (import `PropType` from `vue`) instead of widening the
variant map itself — same pattern for `Link`-forwarding `href`/`method` props
(`PropType<string | UrlMethodPair>` / `PropType<Method>` from
`@inertiajs/core`, since those are Inertia's actual accepted types, not
plain `string`/`object`).

## Component inventory

**Buttons & links**
- `PrimaryButton`, `SecondaryButton`, `DangerButton` — plain `<button>`s,
  forward `$attrs` (so `type`, `disabled`, etc. pass straight through).
- `CancelButton` — an optional-`href` cancel control: renders `ButtonLink` if
  `href` is given, else `SecondaryButton`; wraps its default-slotted text
  (falls back to `t('common.cancel')`) in `IconLabel` with an X icon. Used by
  `EditFormModal`, `ConfirmationDialog`, and `admin/AdminResourceForm` — reach
  for this instead of hand-wrapping another cancel `SecondaryButton`/`ButtonLink`.
- `FilterSubmitButton` — a funnel-icon submit button (no props) for the
  search-field-plus-submit-button filter bars on the admin index pages and
  `shop/ProductFilters`; pairs with `filterFormClass` (see above).
- `ButtonLink` — an Inertia `Link` styled as a button (`variant: primary | secondary`).
- `TextLink` — an Inertia `Link` styled as inline text (`variant: muted | slate`).
  `ShopAuthBanner`'s account-menu links use `dropdownItemBaseClass` directly on
  a plain `Link` instead (distinct look from `TextLink`/`ButtonLink` — don't
  reuse those for menu items) — see the note below on why this isn't its own
  component.

**Form inputs**
- `FormField` — the standard way to render a labeled text/number input with
  its error message: composes `InputLabel` + a native `<input>` + `InputError`
  into one component (`v-model`, `label`, `error`, `labelClass`/`inputClass`
  for the rare sr-only-label/narrower-input case). Auto-focuses on mount if
  `autofocus` is present; coerces its emitted value to a number for
  `type="number"` inputs (native inputs otherwise always emit strings, even
  for number fields). Generates its own unique id via Vue 3.5's `useId()`
  unless an explicit `id` prop is passed — pass `id` for a form that only
  ever renders once per page (matches a stable `#email`-style test selector);
  omit it for a form that can render more than once at a time (e.g. an "edit"
  modal open alongside its own "add" form), where a hardcoded id would
  collide. `TextInput` used to be a separate component; it was merged into
  `FormField` once it had no callers left outside it.
- `SelectField` — the `<select>` counterpart to `FormField`: same
  `InputLabel` + `InputError` + id-generation conventions (`v-model`, `label`,
  `error`, `labelClass`/`selectClass`), but takes its `<option>` elements via
  the default slot instead of a fixed `options` prop, since callers'
  placeholder/"none" option text and option lists vary too much to standardize.
  Used by `CategoryFormFields`, `ProductFormFields`, the products index page's
  category filter, and `ProductFilters`.
- `TextareaField` — the `<textarea>` counterpart to `FormField`, same
  conventions otherwise. Used by `CategoryFormFields` and `ProductFormFields`.
- `CheckboxField` — a labeled checkbox row (`label` prop + `Checkbox` +
  `checkboxLabelClass`, `v-model:checked`). Used by `ProductFormFields` and
  `ProductVariantManager`'s add/edit variant forms. `Account/Addresses`'s
  `is_default` checkbox keeps its own distinct `MutedText`-based look rather
  than using this, since it's visually different, not just a copy of the same
  pattern.
- `PasswordConfirmationFields` — the password + password-confirmation
  `FormField` pair repeated across Register/ResetPassword/
  `UpdatePasswordForm`/`Admin/Admins/Create`
  (`v-model:password`/`v-model:confirmation`,
  `passwordLabel`/`confirmLabel`, `passwordError`/`confirmError`); exposes
  `focus()` (via `defineExpose`) so a caller can refocus the password field
  the same way a lone `FormField` ref would.
- `InputError` — the field error `<p>` (`message` prop, `v-show`s itself when
  empty). Used internally by `FormField`, `SelectField`, `TextareaField`, and
  `SlugField` so all four render validation errors identically. This one has
  round-tripped once already: it started as its own component, got merged
  into `FormField` when that was briefly the only caller, then got pulled
  back out once `SelectField`/`TextareaField`/`SlugField` needed the exact
  same error markup too — a duplicated 4-line `v-show` + `<p>` block across
  four components is the threshold where re-extracting wins even though it
  means undoing an earlier consolidation. See
  [docs/testing.md](../testing.md) for how its dedicated test file was
  restored alongside it.
- `Checkbox` — supports both boolean `v-model:checked` and array-mode
  `v-model:checked` (Vue's native checkbox-array semantics) via a `value` prop.
- `InputLabel` — renders its `value` prop, or falls back to the default slot.
  Used directly (not through `FormField`/`SelectField`/`TextareaField`) only
  where the form control is neither a native text input, `<select>`, nor
  `<textarea>` — e.g. the label above `ProductVariantManager`'s
  `VariantOptionsEditor`.
- `FormActions` — a plain flex-end wrapper for action buttons at the bottom of
  a form (`gap-3` between children); no other props/logic.

**Overlays**
- `Modal` — the base overlay primitive: native `<dialog>` element,
  `maxWidth: sm | md | lg | xl | 2xl` (default `2xl`), `closeable` prop gating
  whether backdrop-click/Escape actually close it. Locks `body` scroll while
  open; the close transition has a 200ms delay before content unmounts.
- `ConfirmationDialog` — built on `Modal` (fixed `max-width="sm"`); `title`,
  optional `message`, a `danger` prop that swaps the confirm button between
  `PrimaryButton` and `DangerButton`, and a `processing` prop that disables
  the confirm button (the cancel button is intentionally *not* disabled while
  processing). Its cancel button is `CancelButton` (see "Buttons & links"
  above) and its confirm-button text is wrapped in `IconLabel` (a `Trash2`
  icon when `danger`, `Check` otherwise). The `confirmingId`/`deleting` state
  feeding a delete `ConfirmationDialog` no longer needs to be hand-rolled per
  page — the `useDeleteConfirmation<T = number>(buildRoute)` composable
  (`resources/js/composables/useDeleteConfirmation.ts`, itself now a thin
  wrapper over the more generic `useConfirmAction` — see
  [docs/frontend/README.md](../frontend/README.md)) owns
  `confirmingId`/`deleting` plus `confirmDelete(id)`/`cancel()`/`destroy()`
  (an Inertia `router.delete(buildRoute(id), { preserveScroll: true, ... })`
  call), and is generic over the id type so a route needing no id at all
  (`Cart/Index.vue`'s "clear cart") can instantiate it as
  `useDeleteConfirmation<true>(() => route('cart.clear'))`. Used by
  `Admin/Categories/Index.vue`, `Admin/Products/Index.vue`,
  `Account/Addresses.vue`, `Cart/Index.vue`, `ProductVariantManager`, and
  `ProductImageManager` — reach for this rather than re-declaring the same
  `confirmingId ref` + `confirmDelete`/`cancel`/`destroy` trio again.
- `DeleteConfirmationDialog` — a thin wrapper over `ConfirmationDialog` that
  fixes `danger` and the delete-flavored confirm label, taking just
  `show`/`title`/`message`/`processing` and emitting `confirm`/`cancel`. Used
  by `Admin/Categories/Index.vue`, `Admin/Products/Index.vue`,
  `ProductVariantManager`, `ProductImageManager`, and `Account/Addresses.vue`
  — the same delete-dialog call sites listed above now go through this
  rather than passing `danger: true` to `ConfirmationDialog` by hand.
- `EditFormModal` — the `Modal`-based chrome for an "edit in a modal" flow:
  `show`/`title`/`processing`/`saveLabel`/optional `icon` props, emits
  `close`/`submit`, composes `SectionHeading` + a `<form>` slot +
  `CancelButton`/`PrimaryButton`. Used by `ProductVariantManager` (edit
  variant) and `Account/Addresses.vue` (edit address) — reach for this
  instead of hand-building another `Modal` + form-footer pair for an edit
  flow.

**Typography / layout**
- `Card` — bordered surface wrapper (`cardSurfaceClass`).
- `PageContainer` — the standard max-width page padding wrapper.
- `SectionHeading` — a `heading` + optional `icon`/`iconClass` (default
  muted slate)/`spacingClass` (default `mb-4`) heading row, with a default
  slot rendered inline after the heading when an icon is present. A genuinely
  shared primitive, not a decomposition-only one: used internally by
  `OrderNoteCard`, `OrderItemsSummary`, `OrderShippingAddressCard`, and
  `EditFormModal`, and directly in `Checkout/Index.vue`,
  `Account/Addresses.vue`, `ProductVariantManager`, and
  `Admin/Orders/Show.vue`.
- `EmptyState` — a required `icon: Component` prop, centers the icon above
  default-slot text (the `h-8 w-8` muted empty-state icon treatment
  described in "Icons" below). Used by `Cart/Index.vue`,
  `ui/table/TableEmpty.vue`, `Account/Orders.vue`, and
  `shop/CatalogLayout.vue` — reach for this instead of hand-building another
  centered icon + message block for a table/list/cart with no rows.
- `TotalRow` — a `label` + `total` (number or string) row, formats `total`
  via `resources/js/lib/format.ts`. Used by `Cart/Index.vue` and
  `OrderItemsSummary`.
- `LabelText`, `MutedText`, `SuccessText`, `ErrorBanner` — small colored text
  wrappers (slate, muted slate, green, red) for consistent copy styling.
  `ErrorBanner` is the one bordered/padded banner of the group (rather than
  plain inline text) — used for the "can't delete/revoke" messages on the
  admin categories and admins index pages.
- `ApplicationLogo` — the inline SVG site logo.
- `AppHeader` — the header shell shared by `Layouts/ShopLayout.vue` and
  `Layouts/AdminLayout.vue`: a `logoHref` prop plus `logo-suffix`/`actions`/
  `subheader` slots for each layout's own logo caption, `ShopAuthBanner`/nav
  controls, and optional page-title row.
- `FormSectionHeader` — a `heading` + optional `description` header for a
  form section (`Profile/Edit.vue`'s three partial forms); declares its own
  local `dialogTitleClass` rather than importing one from `classNames.ts`,
  since it's `ConfirmationDialog`'s title's only other caller — see the
  single-caller note in "Conventions" below.
- `SaveButton` — a `PrimaryButton` (default slot text falls back to
  `t('common.save')`) paired with a fade-in/out "Saved." `MutedText`, gated
  by a `saved` prop; `processing` disables the button. Used by the three
  `Profile/Partials/*Form.vue` components so each doesn't hand-roll its own
  save-confirmation transition.
- `RadioCardOption` — a `<li>`-wrapped radio input styled as a clickable
  card row (`v-model`/`value`, generic over `string | number`), an `align:
  start | center` prop for whether the input aligns with the first line or
  vertically centers against multi-line slot content. Used by
  `Checkout/Index.vue` for the shipping-address and payment-method pickers.

**Order & address display**
- `AddressLines` — renders an address (or address snapshot) as stacked
  `MutedText` lines (label/name, street, city/postal/state, optional
  country via `showCountry`); takes an `AddressSnapshot` shape so it works
  equally against a live `Address` record (`Checkout/Index.vue`) and a
  frozen `shipping_address_snapshot` JSON blob on a placed order
  (`Account/Orders/Show.vue`) — see
  [docs/architecture.md](../architecture.md)'s "Cart, checkout & payments"
  section for why orders snapshot the address instead of referencing it live.
- `OrderItemsSummary` — a heading + line-item list (name, variant options via
  `formatVariantOptions`, quantity, line total) + a total row; used by both
  `Checkout/Index.vue` (against live cart items) and
  `Account/Orders/Show.vue` (against a placed order's items). Callers build
  its `items` prop via `resources/js/lib/format.ts`'s `toSummaryItems()`
  helper rather than mapping the shape inline, so both pages stay in sync if
  the summary item shape ever changes.
- `StatusBadge` — the generic engine both status badges below delegate to:
  `status`, a `variants: Record<string, Variant>` map, and a
  `translationKey` prop, rendered through `ui/badge/`'s `Badge`. Also used
  directly (not through `OrderStatusBadge`/`PaymentStatusBadge`) in
  `Admin/Orders/Index.vue` and `Account/Orders.vue`.
- `OrderStatusBadge` / `PaymentStatusBadge` — thin wrappers around
  `StatusBadge` that map an `OrderStatus`/`PaymentStatus` string to a
  variant map and an already-translated label. Both take a `namespace:
  OrdersNamespace` prop (`'account.orders' | 'admin.orders'`, the type
  exported from `resources/js/lib/orderStatus.ts`) since the same status
  strings are shown to a shopper and an admin but read from different i18n
  domains (`account.orders.statuses.*` vs `admin.orders.statuses.*`, and the
  `paymentStatuses.*` sibling key) — don't hardcode a single namespace into
  either component.
- `CustomerContact` — a `user: { name, email } | null` prop, renders `"Name
  (email)"` or an em dash. Used by `Admin/Orders/Index.vue` and
  `Admin/Orders/Show.vue`.
- `OrderShippingAddressCard` — `namespace`/`address: AddressSnapshot` props,
  wraps `Card` + `SectionHeading` + `AddressLines` (see above). Used by
  `Account/Orders/Show.vue` and `Admin/Orders/Show.vue`.
- `OrderSummaryCard` — `namespace`/`status`/`paymentStatus`/`createdAt`/
  `orderItems`/`total` props, composes `OrderStatusBadge` + `PaymentStatusBadge`
  + `OrderItemsSummary` with a default slot for page-specific extra content
  (e.g. `Admin/Orders/Show.vue` slots in `CustomerContact`). Used by
  `Account/Orders/Show.vue` and `Admin/Orders/Show.vue`.
- `OrderNoteCard` — a generic note display card: `heading`/`note`/optional
  `icon`/`iconClass`/`badgeLabel`/`accentClass` props over `Card` +
  `SectionHeading`. Used for the *customer* note on both
  `Account/Orders/Show.vue` and `Admin/Orders/Show.vue` — the admin *note*
  section on `Admin/Orders/Show.vue` is hand-built with `Card` +
  `SectionHeading` + `TextareaField` instead (it's an editable form, not a
  read-only display), so don't assume every note-shaped block on that page
  goes through `OrderNoteCard`.

**Auth/shop-specific composite**
- `ShopAuthBanner` — the header-right auth widget used by `ShopLayout`:
  login/register `ButtonLink`s for guests, or a greeting + an inline account
  menu (profile/addresses/orders/logout — trigger button, escape/overlay-close
  behavior, and menu links all live directly in this component; there used to
  be a separate `Dropdown`/`DropdownLink` pair, but `ShopAuthBanner` was their
  only caller, so they were folded in — see the note below) +
  `ConfirmationDialog` for the logout prompt when authenticated.
- `LanguageSwitcher` — EN/AR toggle mounted in both `ShopLayout` and
  `GuestLayout`. Deliberately plain `<a>` tags, not Inertia `Link`s — see
  [docs/frontend/README.md](../frontend/README.md) for why switching locale
  needs a full page reload rather than an SPA navigation.

**Admin panel composites** (`resources/js/components/admin/`, only used
under `pages/Admin/` — not part of the general-purpose top-level inventory)
- `AdminPageHeader` — wraps `AdminLayout`, renders `Head`, and the page
  `<h1>` (`heading` prop, falls back to `title`) — with an `#actions` slot
  that, when used, switches the header to `wrapBetweenClass`'s
  heading-plus-button-row layout instead of a bare heading. Every admin page
  wraps this instead of `AdminLayout` directly now, except `Dashboard.vue`
  (no actions slot to share there) — see
  [docs/frontend/README.md](../frontend/README.md).
- `AdminResourceForm` — the Create/Edit page chrome one level above
  `AdminPageHeader`: the `Card` + `<form>` + `FormActions` (cancel
  `ButtonLink` + submit `PrimaryButton`) wrapper every admin resource form
  shares, emitting `submit` and taking `title`/`cancelHref`/`saveLabel`/
  `processing` — the page supplies its own field markup via the default
  slot (the shared `<Entity>FormFields` component) and an `#after` slot for
  anything that renders below the form card (none currently use it). Pairs
  with the `useValidatedSubmit` composable — see
  [docs/frontend/README.md](../frontend/README.md)'s "Form validation"
  section.
- `AdminSection` — a plain `title` + `<h2>` + slot wrapper
  (`sectionHeadingClass`) for grouping a page into labeled sections; no
  other logic.
- `ChartCard` — the `Card`-wrapped, fixed-height (`h-64`) shell around a
  chart (`title` prop + default slot for the actual chart component);
  `RevenueChart`/`CategoryChart` render inside one rather than each
  wrapping its own `Card` individually.
- `VariantFormFields` — the shared field markup (SKU, price, stock,
  `VariantOptionsEditor`, active checkbox) for `ProductVariantManager`'s add
  form and edit modal, the same "shared fields component, each caller keeps
  its own `useForm()`/submit" pattern as `CategoryFormFields`/
  `ProductFormFields`. Its `optionsResetKey` prop forces
  `VariantOptionsEditor` to remount with a fresh value — needed because that
  editor deliberately doesn't watch its `v-model` after mount, so switching
  which variant is being edited without a remount would leave stale options
  on screen.
- `DataTable` — the composition wrapper around the `ui/table/*` primitives
  below: generic over a `Row` type, takes `columns: DataTableColumn<Row>[]`
  and a single `paginated: Paginated<Row>` prop (rows plus pagination
  metadata collapsed into one object, typed in `admin.ts` — this used to be
  separate `rows`/`from`/`to`/`total`/`links` props) and an `emptyMessage`.
  Renders a per-column `#cell-${key}` slot (fall back to the raw field value
  or a column's own `render()`) and an `#actions` slot for a trailing
  per-row button group — callers typically slot in `RowEditDeleteActions`
  (below) rather than hand-building edit/delete buttons per row. Shows a
  `TableEmpty` row when there are no rows, and a footer "Showing X–Y of Z"
  summary + `Pagination` when pagination metadata is given.
- `RowEditDeleteActions` — an `editHref` prop plus a `delete` emit, rendering
  an edit `Link` and a danger delete button; slotted into `DataTable`'s
  `#actions` slot by `Admin/Categories/Index.vue` and `Admin/Products/Index.vue`
  rather than `DataTable` rendering it itself.
- `AdminListCard` — an `empty: boolean` + `emptyMessage` slot-based card
  wrapper for a non-tabular list (as opposed to `DataTable`'s tabular one).
  Used by `ProductVariantManager` and `ProductImageManager`.
- `LinkOrFallback` — `show: boolean`/`href?`/`fallback` props: renders a
  `Link` when `show` and `href` are present, otherwise the plain `fallback`
  text. Used by `Admin/Users/Index.vue` and `Admin/Categories/Index.vue` for
  a cell that's sometimes a link (e.g. a category with a parent) and
  sometimes plain text (no parent).
- `CategoryFormFields` / `ProductFormFields` — the shared field markup for
  each entity's Create *and* Edit pages (name/slug grid, category/parent
  select, description, and for products: price/stock/short-description/
  active-checkbox). Each page keeps its own `useForm()`, submit route/verb,
  and outer `Card`/`FormActions` — only the field markup is shared, via
  `v-model:<field>="form.<field>"` bindings and an `errors` prop. Both now
  compose their fields from the smaller, more granular field components
  below (`NameSlugFields`, `CategorySelectField`, `PriceField`, `StockField`,
  `DescriptionField`, `IsActiveField`) rather than inlining
  `FormField`/`SelectField`/`TextareaField`/`CheckboxField` directly.
- `NameSlugFields` — the name+slug grid row itself (a `form:
  InertiaForm<{name, slug}>` prop, `nameLabel`/`slugLabel`, `errors`, and the
  `autoSlug` prop described above). Used by both `ProductFormFields` and
  `CategoryFormFields`.
- `CategorySelectField` — a `label`/`noneLabel`/`categories: AdminCategoryRef[]`
  + `v-model` category picker (the `SelectField` instance for choosing a
  parent/category). Used by `ProductFormFields`, `CategoryFormFields`, and
  as the products index page's category filter control.
- `PriceField` / `StockField` — `label`/`error?`/`v-model` number inputs
  (`PriceField` also takes `required?`/`hint?`, `min="0" step="0.01"`;
  `StockField` is `min="0"`, integer). Used by both `ProductFormFields` and
  `VariantFormFields`.
- `DescriptionField` — a `label` + `v-model` fixed-`rows="4"` textarea. Used
  by `ProductFormFields` and `CategoryFormFields`.
- `IsActiveField` — a fixed-label (`t('admin.products.isActive')`)
  `v-model:checked` checkbox, no other props. Used by `ProductFormFields` and
  `VariantFormFields`.
- `SlugField` — a slug input that shows the current value as read-only text
  with an "edit" affordance by default; while not manually edited, it
  live-updates from an optional `source` prop (the name field) via its own
  inline `slugify()` (mirrors the backend's `HasUniqueSlug` trait's own
  slugification, but doesn't call the backend — client-side preview only).
  `slugify()` used to be a shared export from `resources/js/lib/slug.ts`;
  that file was deleted once `SlugField` became its only caller, and the
  function moved in-component. Once the admin clicks "edit" and types a
  custom slug, `SlugField` stops auto-syncing from `source`.
- `ProductImageManager` / `ProductVariantManager` — the image gallery and
  variant list on the product Edit page; each manages its own upload/add
  form, edit (variant only — images have no separate fields to edit besides
  "which one is primary") and delete flows, each delete going through a
  `ConfirmationDialog`.
- `StatCard` — the Dashboard's stat tiles. `RevenueChart`/`CategoryChart` —
  the two Chart.js (`vue-chartjs`) wrappers (revenue-by-day, top categories
  by product count); each is now just the bare chart component, wrapped in
  `ChartCard` by `Dashboard.vue` rather than owning its own `Card`/title.
  Both pull their line/bar color from the `useChartColor(cssVariable,
  fallback)` composable (reads a CSS custom property off
  `document.documentElement` on mount, so the chart picks up the current
  light/dark theme's color instead of a hardcoded hex) and share
  `admin/chartOptions.ts`'s `chartOptions` object for the common Chart.js
  config rather than each declaring its own.
- `admin.ts` (a plain `.ts` file, not a component) — the shared TypeScript
  types every admin page/component props against: `Paginated<Row>`,
  `DataTableColumn<Row>`, `PaginationLink`, and the `AdminProduct`/
  `AdminCategory`/`AdminUser`/`AdminAdmin`/`AdminOrder`/`DashboardStats`/
  `RevenueByDayPoint`/`TopCategoryStat` shapes.

**shadcn-vue primitives** (`resources/js/components/ui/`) — generated against
the `components.json` config at the repo root (style `new-york-v4`,
`@/lib/utils`'s `cn()` for class merging), then adapted to import this app's
`classNames.ts` tokens instead of shadcn's default raw Tailwind literals. Not
meant to be hand-written from scratch for a new primitive — regenerate via
the shadcn-vue CLI against `components.json` and re-apply the `classNames.ts`
substitution, matching the existing files' pattern.
- `ui/table/*` — `Table`/`TableHeader`/`TableBody`/`TableFooter`/`TableRow`/
  `TableHead`/`TableCell`/`TableCaption` are the standard shadcn-vue table
  primitives; `TableEmpty` is a **custom, non-stock** addition (`colspan` prop,
  centered slot content) for a table's empty state, built to match the same
  pattern. `DataTable` (above) is the only consumer — don't reach for these
  primitives directly in a new page, compose through `DataTable` instead.
- `ui/badge/` — `Badge` (built on `reka-ui`'s `Primitive`, so it can render as
  any element/component via `as`/`asChild`) with variants defined via
  `class-variance-authority` (`cva`): `default` (indigo), `secondary` (slate),
  `destructive` (red), `outline` (uses the app's `borderColorClass`/
  `mutedBodyTextClass` tokens rather than shadcn's defaults). Currently used
  once, for the admin orders list's status column.

## Dark mode

The app supports dark mode via Tailwind's `dark:` variant, keyed off a `.dark`
class on an ancestor element (`@custom-variant dark (&:is(.dark *));` in
`resources/css/app.css`) — not the `prefers-color-scheme` media query
directly. **Every hardcoded Tailwind color utility (`text-*`, `bg-*`,
`border-*`, `ring-*`) needs a `dark:` counterpart**, or it renders with the
light-mode color regardless of theme. This bit repeatedly: `text-gray-*`/
`text-red-600`/`border-slate-200` etc. with no `dark:` pairing turned up in
over a dozen places across older components and pages before being swept and
fixed. Two things make this easy to miss:
- Tailwind v4's compatibility shim in `app.css` hardcodes
  `border-color: var(--color-gray-200, currentColor)` for *any* element using
  a bare `border` class with no explicit color — so an unqualified `border`
  isn't "no color", it's "always light-gray", even in dark mode.
- A color that's genuinely meant to stay constant across themes (e.g.
  `DangerButton`/`buttonVariants.primary`'s solid `bg-red-600`/`bg-indigo-600`
  fills) doesn't need a `dark:` variant at all — an unprefixed Tailwind class
  already applies in both modes; adding `dark:bg-red-600` (same value) would
  be a no-op, not a fix. Don't "fix" these; they're a deliberate choice, not
  a bug.

Established pairings, reuse these rather than inventing new ones:
- Headings: `headingTextClass` (`text-slate-900 dark:text-slate-100`).
- Muted text: `mutedTextClass` (`text-slate-500 dark:text-slate-400`).
- Borders: `border-slate-200 dark:border-slate-800` (`mutedBorderClass`,
  matches `cardSurfaceClass`); `border-slate-300 dark:border-slate-700`
  (`borderColorClass`) for inputs, buttons, and dividers.
- Indigo accents (links, "default" badges): `text-indigo-600 dark:text-indigo-400`.
- Destructive/error text: `text-red-600 dark:text-red-400`.

## Icons

Icons come from `@lucide/vue` (already a dependency — see `package.json`);
don't add a second icon library for a one-off need. Two established sizes,
depending on role:
- **Inline icon** (next to a heading, nav label, or piece of body text) —
  `h-4 w-4` inside a `flex items-center gap-2` wrapper. See `SidebarNav.vue`'s
  nav item icons and `Admin/Orders/Show.vue`'s `MessageSquareText`/`Lock`
  section-heading icons. When the icon sits next to button or link text
  specifically, use the `IconLabel.vue` component (`:icon="Trash2"`) rather
  than hand-wrapping a `span` — see `ConfirmationDialog.vue`. Pass `trailing`
  for icon-after-text buttons like "Proceed to checkout".
- **Boxed/accent icon** (a dashboard stat tile) — `h-5 w-5` centered inside a
  fixed `h-10 w-10` rounded accent box (`rounded-lg bg-indigo-50
  dark:bg-indigo-500/10`). See `StatCard.vue`.
- **Empty-state icon** (a table/list with no rows, an empty cart) — `h-8 w-8`,
  centered above the empty message, no accent box, colored `text-slate-300
  dark:text-slate-700` — more muted than a boxed accent icon since it's
  decorative negative space rather than a call-to-action.

Icon color always pairs a light/dark variant, matching whatever accent the
element it decorates already uses — `text-indigo-600 dark:text-indigo-400`
for a primary/accent icon, `text-slate-500 dark:text-slate-400` for a muted
or internal-only one (e.g. `Show.vue`'s admin-note `Lock`) — never a bare
color utility with no `dark:` counterpart (see "Dark mode" above).

A component that accepts a caller-supplied icon (`StatCard`, `SidebarNav`'s
`SidebarNavItem.icon`) types the prop `icon?: Component` (`import type {
Component } from 'vue'`) and renders it with
`<component :is="icon" v-if="icon" class="h-4 w-4" />` — don't type it as a
string name resolved from a lookup map.

Icons are decorative alongside existing text by default — a section heading,
nav label, or button that already reads e.g. "Delete" needs no extra
`aria-*` wiring for the icon next to it. An icon-only control with no
visible text label needs its own `aria-label` on the surrounding
`<button>`/`<Link>` instead — there's no existing icon-only control to copy
yet, so add the `aria-label` by hand the first time one is built.

## Conventions

- **Reuse before you write new markup.** If you're about to write a raw
  `<button>`, `<input>`, or a repeated Tailwind class string, check this list
  first — the `b0a4544 unify ui, delete unused code` commit replaced exactly
  that pattern across the shop components (`CatalogLayout`, `ProductCard`,
  `ProductFilters`, `CategoryNavigation`) with these shared components.
- **Don't add a prop "for flexibility" that nothing actually uses.** `Dropdown`
  used to accept a `width` prop, but its only consumer always passed the same
  value as the default and the underlying class map only ever supported that
  one value anyway — it was removed and the width hardcoded. Keep component
  APIs matched to real, current usage; add configurability when a second real
  use case actually needs it, not preemptively.
- **A component with exactly one caller isn't automatically "shared" — check
  whether it's really being reused, or just living in a shared folder.**
  `Dropdown`/`DropdownLink` were fully generic (an `align: left | right |
  center` prop, `method`/`as` forwarding) but `ShopAuthBanner` was their only
  consumer and only ever used the defaults; both got inlined into
  `ShopAuthBanner` and deleted. Compare this to `admin/ProductImageManager.vue`
  or `shop/ProductCard.vue`, which also currently have one caller each but stay
  as their own files — those exist to keep an already-large page/component
  readable (decomposition), not to offer reuse that isn't happening. Inline a
  single-caller component when it's small and self-contained; keep it split
  out when merging it back would just bloat the caller.
- **A component's classes only need to be extracted to `classNames.ts` once a
  second component needs them.** Single-use variant maps (like `TextLink`'s)
  belong in the component itself. `dialogTitleClass` (only ever used by
  `FormSectionHeader.vue`) and `dropdownItemBaseClass` (its second caller,
  `DropdownLink`, got inlined away — see above) both got pulled out of
  `classNames.ts` for exactly this reason and now live as local consts in
  their one remaining caller. This isn't a one-way door: re-promote a token
  back to `classNames.ts` the moment a second component actually needs it
  again.

See [docs/frontend/README.md](../frontend/README.md) for how these components
fit into pages/layouts, and [docs/testing.md](../testing.md) for how they're
tested (the `findComponent(Component)` vs. `findComponent({ name })` gotcha in
particular applies to several components here that have minimal `<script setup>`
blocks).
