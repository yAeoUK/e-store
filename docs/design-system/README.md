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
- `interactiveRowClass` — hover/text styling for clickable list rows
  (dropdown items, category nav links).
- `formFieldClass` — the standard bordered input/select look.
- `headingTextClass` — heading text color (light/dark aware).
- `cardSurfaceClass` — the bordered/rounded card surface used by `Card`.

Note: `TextLink`'s `textLinkVariants` (`muted`/`slate`) live *inside*
`TextLink.vue` itself rather than in `classNames.js` — they were moved there
after confirming `TextLink` was the only consumer, so keeping them local
avoided an unnecessary shared-file dependency for a single caller. Only
promote a variant map to `classNames.js` once more than one component
actually needs it.

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
- `TextInput` — wraps a native `<input>`; auto-focuses on mount if the
  `autofocus` attribute is present; coerces its emitted value to a number for
  `type="number"` inputs (native inputs otherwise always emit strings, even
  for number fields).
- `Checkbox` — supports both boolean `v-model:checked` and array-mode
  `v-model:checked` (Vue's native checkbox-array semantics) via a `value` prop.
- `InputLabel` — renders its `value` prop, or falls back to the default slot.
- `InputError` — shows/hides via `v-show` based on whether a `message` is set.
- `FormActions` — a plain flex-end wrapper for action buttons at the bottom of
  a form; no props/logic.

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
- `LabelText`, `MutedText`, `SuccessText` — small colored text wrappers (slate,
  muted slate, green) for consistent copy styling.
- `ApplicationLogo` — the inline SVG site logo.

**Auth/shop-specific composite**
- `ShopAuthBanner` — the header-right auth widget used by `ShopLayout`:
  login/register `ButtonLink`s for guests, or a greeting + `Dropdown` (profile/
  addresses/orders/logout) + `ConfirmationDialog` for the logout prompt when
  authenticated.

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
