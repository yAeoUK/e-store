# Design System

The shared UI layer under `resources/js/components/` (top level — not the
`shop/` subfolder, which holds catalog-specific components). Introduced on
`feature/authentication` to give Auth, Account, Profile, and shop pages a
consistent look, replacing what used to be ad-hoc repeated Tailwind class
strings in each page.

## Shared class tokens (`resources/js/components/classNames.js`)

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
  `subheadingTextClass`/`pageTitleClass`/`dialogTitleClass` layer a fixed
  font-size/weight on top of it for, respectively, a small inline heading (a
  layout's logo caption), a card/section heading, a page `<h1>`, and a
  `ConfirmationDialog`'s title — reuse whichever size matches the role instead
  of restating `headingTextClass` plus ad-hoc `text-*`/`font-*` utilities.
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
  `buttonVariants`). `dropdownItemBaseClass` is the equivalent base for a
  full-width dropdown-menu-item row (`DropdownLink`, `ShopAuthBanner`'s
  logout button).
- A few tokens (`controlPaddingClass`, `transitionClass`, `disabledClass`)
  are declared in `classNames.js` but **not exported** — they exist only to
  compose the tokens above (`legacyButtonBaseClass`, `dropdownItemBaseClass`,
  `buttonVariants`) and have no consumer outside the file itself. If you find
  yourself wanting to import one of these three, check whether the composed
  token you actually need already exists first.

Note: `TextLink`'s `textLinkVariants` (`muted`/`slate`) live *inside*
`TextLink.vue` itself rather than in `classNames.js` — they were moved there
after confirming `TextLink` was the only consumer, so keeping them local
avoided an unnecessary shared-file dependency for a single caller. Only
promote a variant map to `classNames.js` once more than one component
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
- `ButtonLink` — an Inertia `Link` styled as a button (`variant: primary | secondary`).
- `TextLink` — an Inertia `Link` styled as inline text (`variant: muted | slate`).
- `DropdownLink` — an Inertia `Link` styled as a full-width dropdown menu item
  (distinct look from `TextLink`/`ButtonLink` — don't reuse those for menu
  items; see the reasoning captured when this was last questioned).

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
  processing).
- `Dropdown` — a menu trigger (down-arrow chevron button, built in — not
  slot-provided) + `content` slot for the menu items; `align: left | right`
  controls which corner it opens from.

**Typography / layout**
- `Card` — bordered surface wrapper (`cardSurfaceClass`).
- `PageContainer` — the standard max-width page padding wrapper.
- `LabelText`, `MutedText`, `SuccessText`, `ErrorBanner` — small colored text
  wrappers (slate, muted slate, green, red) for consistent copy styling.
  `ErrorBanner` is the one bordered/padded banner of the group (rather than
  plain inline text) — used for the "can't delete/revoke" messages on the
  admin categories and admins index pages.
- `ApplicationLogo` — the inline SVG site logo.

**Auth/shop-specific composite**
- `ShopAuthBanner` — the header-right auth widget used by `ShopLayout`:
  login/register `ButtonLink`s for guests, or a greeting + `Dropdown` (profile/
  addresses/orders/logout) + `ConfirmationDialog` for the logout prompt when
  authenticated.
- `LanguageSwitcher` — EN/AR toggle mounted in both `ShopLayout` and
  `GuestLayout`. Deliberately plain `<a>` tags, not Inertia `Link`s — see
  [docs/frontend/README.md](../frontend/README.md) for why switching locale
  needs a full page reload rather than an SPA navigation.

**Admin panel composites** (`resources/js/components/admin/`, only used
under `pages/Admin/` — not part of the general-purpose top-level inventory)
- `DataTable` — the composition wrapper around the `ui/table/*` primitives
  below: generic over a `Row` type, takes `columns: DataTableColumn<Row>[]`
  and `rows: Row[]`, an `emptyMessage`, and optional pagination metadata
  (`from`/`to`/`total`/`links`, straight off a Laravel paginator). Renders a
  per-column `#cell-${key}` slot (fall back to the raw field value or a
  column's own `render()`) and an `#actions` slot for a trailing per-row
  button group; shows a `TableEmpty` row when `rows` is empty, and a footer
  "Showing X–Y of Z" summary + `Pagination` when pagination metadata is given.
- `CategoryFormFields` / `ProductFormFields` — the shared field markup for
  each entity's Create *and* Edit pages (name/slug grid, category/parent
  select, description, and for products: price/stock/short-description/
  active-checkbox). Each page keeps its own `useForm()`, submit route/verb,
  and outer `Card`/`FormActions` — only the field markup is shared, via
  `v-model:<field>="form.<field>"` bindings and an `errors` prop. An
  `autoSlug` prop (only passed `true` on the Create page) controls whether
  the slug field auto-fills from the name as it's typed.
- `SlugField` — a slug input that shows the current value as read-only text
  with an "edit" affordance by default; while not manually edited, it
  live-updates from an optional `source` prop (the name field) via
  `resources/js/lib/slug.ts`'s `slugify()`. Once the admin clicks "edit" and
  types a custom slug, it stops auto-syncing from `source`.
- `ProductImageManager` / `ProductVariantManager` — the image gallery and
  variant list on the product Edit page; each manages its own upload/add
  form, edit (variant only — images have no separate fields to edit besides
  "which one is primary") and delete flows, each delete going through a
  `ConfirmationDialog`.
- `StatCard`, `RevenueChart`, `CategoryChart` — the Dashboard's stat tiles
  and the two chart wrappers (revenue-by-day, top categories by product
  count).
- `admin.ts` (a plain `.ts` file, not a component) — the shared TypeScript
  types every admin page/component props against: `Paginated<Row>`,
  `DataTableColumn<Row>`, `PaginationLink`, and the `AdminProduct`/
  `AdminCategory`/`AdminUser`/`AdminAdmin`/`AdminOrder`/`DashboardStats`/
  `RevenueByDayPoint`/`TopCategoryStat` shapes.

**shadcn-vue primitives** (`resources/js/components/ui/`) — generated against
the `components.json` config at the repo root (style `new-york-v4`,
`@/lib/utils`'s `cn()` for class merging), then adapted to import this app's
`classNames.js` tokens instead of shadcn's default raw Tailwind literals. Not
meant to be hand-written from scratch for a new primitive — regenerate via
the shadcn-vue CLI against `components.json` and re-apply the `classNames.js`
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
- **A component's classes only need to be extracted to `classNames.js` once a
  second component needs them.** Single-use variant maps (like `TextLink`'s)
  belong in the component itself.

See [docs/frontend/README.md](../frontend/README.md) for how these components
fit into pages/layouts, and [docs/testing.md](../testing.md) for how they're
tested (the `findComponent(Component)` vs. `findComponent({ name })` gotcha in
particular applies to several components here that have minimal `<script setup>`
blocks).
