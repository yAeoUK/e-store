<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.5
- inertiajs/inertia-laravel (INERTIA_LARAVEL) - v3
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- tightenco/ziggy (ZIGGY) - v2
- larastan/larastan (LARASTAN) - v3
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/vue3 (INERTIA_VUE) - v3
- tailwindcss (TAILWINDCSS) - v4
- vue (VUE) - v3
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-vue-development` when working with Inertia Vue client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-vue/core rules ===

# Inertia + Vue

Vue components must have a single root element.
- IMPORTANT: Activate `inertia-vue-development` when working with Inertia Vue client-side patterns.

</laravel-boost-guidelines>

<!--
The section below is project-specific and hand-written — it lives outside the
<laravel-boost-guidelines> block on purpose, since `composer update` regenerates
everything inside that block via `artisan boost:update` and would silently wipe
anything added there. Any AI coding tool reading this file should follow this
section the same as the Boost guidelines above.
-->

# Project Conventions (this repo specifically)

## Pre-change checklist (this repo specifically)

Run all four of these on every file add/edit — not as an occasional audit,
every single time, before considering the change done:

1. **Before adding a new file**, inspect the code you're about to add for
   duplication against the rest of the codebase (not just sibling files). If
   it repeats logic that already exists elsewhere, extract the shared logic
   into a common file instead of writing the duplicate — see "Duplication
   checks" below for the 2+ call site bar this has to clear.
2. **Before editing a file, look at the part of the code being removed.** If
   it was a caller of a shared helper/trait/scope/composable/component, and
   removing it leaves that shared code with only one remaining caller,
   inline the shared code into that one remaining call site and delete the
   now-unused shared definition — in the same change, not as a follow-up.
3. **Before editing a file, look at the part of the code being added**, the
   same way as for a new file in point 1: check it against the rest of the
   codebase for duplication, and extract to a shared location once 2+ real
   call sites exist.
4. **After any file is added or edited, add or update the test(s) covering
   that change** and run them before finalizing — see "Testing conventions"
   below for what "covering the change" means per area (model, controller,
   Vue component, enum, service).

The sections below spell out the detailed rules (call-site thresholds,
where shared code lives, what "covered by a test" means per file type) —
this checklist is the procedure for applying them on every change, not a
replacement for them.

## Formatting & type-checking while editing (this repo specifically)

Run these as part of making each change, not only via `composer ci:check` at
the very end — catching a formatting/type issue on the file you just touched
is cheaper than discovering a pile of unrelated fallout across dozens of
files in one final sweep:

- **PHP**: `vendor/bin/pint --dirty --format agent` after editing PHP files
  (already a Boost rule above — only formats files with uncommitted changes,
  so it's cheap to run after every edit, not just before finalizing).
- **Frontend (Vue/TS)**: run `npx prettier --write <file>` right after
  editing a `.vue`/`.ts` file, and `npm run types:check` (`vue-tsc --noEmit`)
  after any type-affecting change (a new/changed prop, a generic helper like
  `createFieldsHarness`, a shared test util) — don't wait until
  `composer ci:check` to find out a test-helper generic broke type inference
  across a dozen unrelated test files.
- `composer ci:check` (`lint:check`, `format:check`, `types:check`,
  `pint --test`, `phpstan`, Pest) is still the final gate before calling a
  change done — the incremental runs above are a supplement to catch issues
  early, not a replacement for it.

## Duplication checks (this repo specifically)

- Every time code is added or changed, check it against the rest of the
  codebase for duplication — not just within the file being touched. If the
  new/changed code repeats logic that already exists elsewhere (a controller
  method, a model method/scope, a validation rule, a Vue component, a
  Tailwind class string, etc.), say so and propose extracting the shared
  logic to a common place rather than leaving the duplicate in place. This is
  a check to run on every change, not a one-off audit.
- An extraction only clears the bar once there are **2+ real call sites** —
  see "Reuse before writing new UI" below and the `classNames.js` promotion
  rule in it for the frontend version of this; the same threshold applies on
  the backend (e.g. `OrderItem::resolveUnitPrice`/`buildProductSnapshot`,
  `Order::loadCartItemsForDisplay`, and `ProductVariant::findOptional` were
  extracted out of `CartController`/`CheckoutController` because both
  controllers needed them, not speculatively). The admin Category/Product/
  Address controller-and-request layer went through the same pass:
  `FillsSlugAndForeignKey`/`GuardsRelatedDeletes`/`FiltersIndexRequests`/
  `DefaultsNullableFieldsToZero` (each shared by 2+ admin controllers),
  `SharedRules`/`AuthorizesUpdateVia` (shared by several Form Requests), and
  `HasExclusiveFlag` (shared by `Address::makeDefault()` and
  `ProductImage::makePrimary()`) — see
  [docs/architecture.md](docs/architecture.md)'s "Shared Concerns & base
  Request classes" section for the full list and exact call sites. Don't
  add a third caller's worth of speculative flexibility to any of these
  beyond what the existing 2 callers actually need.
- **The 2+ call site check applies per extracted symbol, not per file pair.**
  Two files can be structurally identical (same shape of component/script)
  while each individual constant/type moved out of them is still only
  consumed by one of the two — that's not duplication, just two single-use
  definitions that happen to look alike. `OrderStatusBadge.vue` and
  `PaymentStatusBadge.vue` are near-identical wrapper components, but their
  `orderStatusVariants`/`paymentStatusVariants` maps were each only ever
  imported by their own component — moving them into `lib/orderStatus.ts`
  added indirection with no real dedup, and both were moved back inline.
  Before extracting, check where *each specific symbol* would be imported
  from post-extraction, not just whether the surrounding pattern looks
  duplicated — only move the parts genuinely shared by 2+ import sites.
  `ORDER_STATUS_VALUES` and the `OrderStatusValue` type were also moved back
  inline (into `Admin/Orders/Index.vue` and `OrderStatusBadge.vue`
  respectively) once each turned out to have only one real importer;
  `OrdersNamespace` stayed in `lib/orderStatus.ts` because both
  `OrderStatusBadge.vue` and `PaymentStatusBadge.vue` import it.
- The reverse applies too: if a change removes a caller of some shared
  helper/trait/scope/composable/component such that only **one** caller is
  left afterward, inline that shared code into its one remaining call site
  and delete the now-unused shared definition, in the same change that
  removed the second-to-last caller — don't leave a one-call indirection
  standing "in case it's needed again."

## Reuse before writing new UI

- Before writing a `<button>`, `<input>`, a modal/dropdown, or repeating a
  Tailwind class string, check `resources/js/components/*.vue` (top level,
  not `shop/`) for an existing component that already does it — see
  [docs/design-system/README.md](docs/design-system/README.md) for the full
  inventory (buttons, inputs, `Modal`, `Dropdown`, `ConfirmationDialog`,
  typography wrappers, etc.) and the shared Tailwind class tokens in
  `resources/js/components/classNames.js`. This includes the smaller,
  easy-to-miss primitives added alongside the admin order-editing feature:
  `CancelButton`/`FilterSubmitButton` (buttons), `SectionHeading`/`EmptyState`/
  `TotalRow` (typography/layout), `StatusBadge` (generic status-to-badge
  mapping, underneath `OrderStatusBadge`/`PaymentStatusBadge`), and
  `DeleteConfirmationDialog`/`EditFormModal` (the delete-confirm and
  edit-in-a-modal shapes built on `ConfirmationDialog`/`Modal`) — don't
  hand-roll any of these again because they're small enough to look
  one-off.
- A labeled text/number input with an error slot is `FormField` — not a
  hand-assembled `InputLabel` + `<input>` + error `<p>`. The same idea extends
  to the other control types: a labeled `<select>` is `SelectField`
  (label/error/id-generation handled the same way as `FormField`; pass the
  `<option>` elements via its default slot), a labeled `<textarea>` is
  `TextareaField`, and a labeled checkbox row is `CheckboxField` (`label`
  prop + `v-model:checked`). `InputLabel` is still used on its own directly
  only where none of these four fit, e.g. a label sitting over a custom,
  non-native control like `VariantOptionsEditor`.
- The error message under a field is `InputError` (`message` prop) — used
  internally by `FormField`/`SelectField`/`TextareaField`/`SlugField` so all
  four render error text identically; don't hand-roll another
  `v-show="error"` + `<p>` pair. `InputError` briefly didn't exist as its own
  component (folded into `FormField`) until the same `v-show`/`<p>` pair
  turned up duplicated across `SelectField`/`TextareaField`/`SlugField` too —
  it's back as a shared piece specifically to keep those four in sync.
- Wrap new pages in the existing layouts rather than duplicating header/nav
  markup: `GuestLayout` for unauthenticated Auth pages, `ShopLayout` for
  shop/Account/Profile pages, `AdminLayout` for anything under `pages/Admin/`
  — see [docs/frontend/README.md](docs/frontend/README.md).
- A new admin list page reuses `DataTable` (columns/rows/pagination props,
  per-column `#cell-*` slots, `#actions` slot) rather than a hand-rolled
  `<table>` — see `resources/js/components/admin/` in
  [docs/design-system/README.md](docs/design-system/README.md). A new
  Create/Edit page pair for an admin resource shares its field markup via a
  `<Entity>FormFields` component (see `CategoryFormFields`/`ProductFormFields`)
  — each page keeps its own `useForm()`/submit route/verb and passes
  `v-model:<field>`/`errors` down, only the fields themselves are shared.
  `resources/js/components/ui/` (shadcn-vue `Table`/`Badge` primitives) are
  building blocks for `DataTable`/status badges specifically — go through
  `DataTable`, don't reach for `ui/table/*` directly in a new page.
- Only promote a component-local variant map (e.g. a `variantClasses` object)
  to the shared `classNames.js` once a **second** component actually needs it.
  Don't add a prop "for flexibility" that nothing currently uses — e.g. don't
  add a `width`/`size`-style prop unless more than one real call site needs a
  different value than the default.
- **Every hardcoded Tailwind color utility needs a `dark:` counterpart** —
  see [docs/design-system/README.md](docs/design-system/README.md)'s "Dark
  mode" section for the established pairings (headings, muted text, borders,
  indigo accents, error text) and the two traps that cause this to slip
  through unnoticed (Tailwind v4's bare-`border` compatibility shim, and
  solid brand-color button fills that are *supposed* to stay constant across
  themes).
- User-facing copy goes through `t('namespace.key')`
  (`resources/js/i18n/`), not inline strings. Links/redirects go through
  Ziggy's `route('name')`, never a hardcoded path.

## Icons (this repo specifically)

Full detail in [docs/design-system/README.md](docs/design-system/README.md)'s
"Icons" section — the essentials:

- Icons come from `@lucide/vue` (already a dependency) — don't add a second
  icon library for a one-off need.
- `h-4 w-4` for an inline icon next to a heading/nav label/button text
  (inside a `flex items-center gap-2` wrapper); `h-5 w-5` inside a fixed
  `h-10 w-10` rounded accent box for a boxed/stat-tile icon — see
  `SidebarNav.vue`/`Admin/Orders/Show.vue` and `StatCard.vue` respectively.
- For an icon next to button/link text specifically, use `IconLabel.vue`
  (`:icon="Trash2"`, with a `trailing` prop for icon-after-text buttons like
  "Proceed to checkout") instead of hand-wrapping a `span` — see
  `ConfirmationDialog.vue`.
  A table/list empty state uses a larger, unboxed `h-8 w-8` icon in a muted
  `text-slate-300 dark:text-slate-700`, centered above the message.
- Icon color always pairs a `dark:` variant matching the element's existing
  accent (`text-indigo-600 dark:text-indigo-400` for primary/accent,
  `text-slate-500 dark:text-slate-400` for muted) — never a bare color
  utility with no `dark:` counterpart.
- A component that takes a caller-supplied icon types the prop
  `icon?: Component` (from `vue`), not a string/name resolved internally.
- An icon-only control (no visible text label) needs its own `aria-label`;
  an icon placed next to existing text needs no extra `aria-*` wiring.
- Adding a purely decorative icon to a component that already has test
  coverage doesn't by itself require a new test assertion — but if the
  change alters what's rendered (an icon-only button replacing a text
  button, an empty state's icon replacing plain text), update that
  component's test in the same pass per the testing conventions below.

## Database query column selection (this repo specifically)

- **Every Eloquent query whose result reaches an `Inertia::render()` prop must
  explicitly select only the columns the frontend actually needs** — no bare
  `Model::query()->paginate()`/`->get()`/`->all()`, no unrestricted
  `->with('relation')`/`->load('relation')`, if a narrower column list would
  do. This applies to the top-level query (`->select([...])` or
  `Model::all(['col1', 'col2'])`) and to every eager-loaded relation
  (`->with('relation:col1,col2')` / `->load('relation:col1,col2')`).
- **"Needed by the frontend" means matching the prop's TypeScript shape**, not
  grepping the current template for literal `row.xxx` reads — check
  `resources/js/components/admin/admin.ts` for admin pages (`AdminProduct`,
  `AdminCategory`, `AdminUser`, `AdminOrder`, `AdminAdmin`, ...),
  `resources/js/components/shop/catalog.ts` for the public catalog
  (`CatalogProduct`, `CatalogCategory`), or the page's own local `interface`
  otherwise. A field declared on the type is "needed" even if the current
  template happens not to render it yet — trust the type, don't re-derive it
  from render call sites every time.
- **Eager-loaded relation column lists must include the foreign key**
  Eloquent needs to map the related rows back to their parent (e.g.
  `images:id,product_id,url,alt_text` — `product_id` isn't used by any Vue
  page, but dropping it breaks the eager load). The parent side doesn't need
  the reverse FK re-added if it's already selected for its own sake (e.g.
  `category_id` on `Product` is normally already needed to filter/relate).
- **A column filtered or sorted on in the same query doesn't need to be in
  the `->select()` just because it's in a `->where()`/`->orderBy()`/search
  clause** — e.g. `Product::query()->select([...])->where('is_active', true)`
  is fine even though `is_active` isn't in the select list; SQL doesn't
  require it.
- **Don't restrict the columns of a route-model-bound top-level model**
  (e.g. `edit(Product $product)`) — Laravel's implicit binding always fetches
  the full row before the controller method runs, so trimming it means
  replacing implicit binding with a manual `Model::select([...])->findOrFail()`,
  which is disproportionate effort for a single-row fetch. Only trim that
  model's **eager-loaded relations** (`$product->load(['images:...', ...])`),
  which are fully controllable and where the multi-row cost actually adds up.
  See `Admin\ProductController::edit`/`Admin\CategoryController::edit` for
  the pattern: the bound model's own `select()` is left alone, its relations
  aren't.
- **Don't spread a full model into an array response** (`[...$user->toArray(), ...]`)
  when only a few fields are needed — it silently re-exposes every future
  column added to that table. Build the response as an explicit array
  instead (see `Admin\UserController::index`).
- See `CategoryController`/`ProductController` (public), `Admin\ProductController`,
  `Admin\OrderController`, `Admin\UserController`, `Admin\AdminController`,
  `Admin\CategoryController`, and `Account\AddressController` for the applied
  pattern across every existing listing/detail endpoint — use them as the
  template for any new query that feeds an Inertia prop.

## Authorization (this repo specifically)

- Per-owner authorization (does this user own this record?) goes through a
  Laravel Policy, not an inline `if ($request->user()->id !== $model->user_id) { abort(403); }`
  check duplicated across every controller action that needs it.
  `AddressPolicy` (`view`/`update`/`delete`) was the app's first Policy;
  `OrderPolicy` (`view` only — an order is never customer-editable, so there's
  nothing to authorize but reading it) and `OrderItemPolicy` (`update`/
  `delete`, gated on **both** ownership *and* `$orderItem->order->status ===
  OrderStatus::Cart`) followed for the cart/checkout feature. Use whichever
  is the closer template: `AddressPolicy`/`OrderPolicy` for a plain
  ownership check, `OrderItemPolicy` for "owned *and* still mutable" (a cart
  line item stops being deletable the moment checkout flips its order out of
  `Cart`). Call a policy via `$this->authorize('ability', $model)` in a
  controller (needs `AuthorizesRequests` on the base `Controller`, already
  added) or `$this->user()->can('ability', $model)` inside a `FormRequest`'s
  `authorize()`.
- This is a distinct concern from mass-assignment protection
  (`$fillable`) — removing a foreign key like `user_id` from `$fillable`
  stops it being set via `Model::create($request->all())`, but does nothing
  to stop a different logged-in user from hitting
  `PATCH /account/addresses/{someone_else's_id}` via route-model binding.
  Both are needed; neither substitutes for the other.
- `Category`/`Product` don't have Policies, and shouldn't get one just for
  symmetry: they're public read-only endpoints for shoppers, and their admin
  CRUD (`app/Http/Controllers/Admin/CategoryController`/`ProductController`)
  is gated by the `admin` role instead — a role check ("is this user an admin
  at all"), not a per-record ownership check, so a Policy is the wrong tool.
  `Admin\OrderController::update`/`refund` (order status changes, admin
  notes, refunds) follow the same precedent — no new `OrderPolicy` ability
  was added for admin editing; it's gated purely by the existing `admin`
  route-middleware group, same as `Category`/`Product`'s admin CRUD. Only
  `OrderPolicy::view` (a shopper viewing *their own* order) is a genuine
  per-owner check — don't add a Policy ability for an admin-only action just
  because the model already has a Policy for something else.
  The role check itself is `EnsureUserIsAdmin` (registered as the `admin`
  middleware alias), backed by spatie/laravel-permission's `HasRoles` trait
  on `User` — every admin route is `Route::middleware(['auth', 'admin'])`
  (`auth` first, so a guest gets the login redirect rather than a 403).
  Bootstrapping the very first admin account (before any admin session
  exists to promote one via the UI) goes through `php artisan make:admin
  <email>`, not a manual DB edit.
- A resource that other rows can reference (a `Category` with children/
  products, a `Product` with order items) should block `destroy()` at both
  layers: an app-level existence check in the controller (flash a specific
  error, e.g. `admin.categories.has_children_or_products`) **and** a
  `restrictOnDelete()` foreign key in the migration as the backstop — don't
  rely on just one. See `Admin\CategoryController::destroy`/
  `Admin\ProductController::destroy` and the restrict-delete migrations
  referenced in [docs/architecture.md](docs/architecture.md) for the pattern.
- A model needing a unique, human-editable slug (`Category`, `Product`) uses
  the `HasUniqueSlug` trait's `generateUniqueSlug($source, $ignoreId)` —
  don't hand-roll another slug-collision loop. Keep `slug` (and any parent/
  category FK the slug depends on) out of `$fillable` so it can only be set
  through the trait/controller, never raw mass-assignment.

## File uploads (this repo specifically)

- An uploaded image goes through Intervention Image before it's stored, not
  saved verbatim from the request: `Admin\ProductImageController::store` is
  the reference — `scaleDown(1600, 1600)` (never upscales) then re-encode as
  JPEG at a fixed quality, regardless of the original format, before writing
  to the `public` disk. Apply the same "resize + normalize format" pattern to
  any new upload feature rather than storing whatever the browser sent.

## TypeScript conventions (this repo specifically)

Full detail in [docs/frontend/README.md](docs/frontend/README.md) — the essentials:

- Every `.vue` file uses `<script setup lang="ts">` — this is now a
  repo-wide, no-exceptions convention (a 33-file migration cleared out the
  last plain-JS holdouts). New components follow suit from the start.
- Ambient types live in `resources/js/types/*.d.ts` (already covered by
  `tsconfig.json`'s include, nothing else to wire up): `ziggy.d.ts` for the
  global `route()` function, `inertia.d.ts` for Inertia's shared page props,
  `shims-vue.d.ts` for the standard `.vue` module shape. **Adding a new key
  to `HandleInertiaRequests::share()` needs a matching addition to
  `inertia.d.ts`'s `sharedPageProps`**, or it won't type-check anywhere on
  the frontend.
- A `defineProps({ variant: { type: String, ... } })`-style prop that indexes
  into a class-variant map (`buttonVariants[props.variant]`) needs
  `type: String as PropType<keyof typeof buttonVariants>` (import
  `PropType` from `vue`) — plain `String` infers as generic `string`, which
  doesn't type-check as a map index. Same idea for `href`/`method` props
  forwarded to Inertia's `<Link>`: type them `PropType<string |
  UrlMethodPair>` / `PropType<Method>` from `@inertiajs/core`, not
  `[String, Object]`/`String`.
- Don't touch `resources/js/app.ts`'s `resolve()` function without reading
  the comment-worthy gotcha in [docs/frontend/README.md](docs/frontend/README.md)
  first — pinning `resolvePageComponent`'s generic to bare `DefineComponent`
  instead of `{ default: DefineComponent }` looks more correct but breaks
  `vue-tsc` in a confusing way.

## Localization & RTL conventions (this repo specifically)

Full detail in [docs/frontend/README.md](docs/frontend/README.md) and
[docs/architecture.md](docs/architecture.md) — the essentials:

- Two locales exist: `en` and `ar`. New user-facing copy needs an entry in
  **both** `resources/js/i18n/locales/en/<domain>.ts` and the matching
  `ar/<domain>.ts` — not just `en`. Each `ar/*.ts` is typed
  `satisfies <Domain>Translations` against a named type exported from its
  `en/*.ts` counterpart; a missing/renamed key fails `npm run types:check`, so
  don't skip adding the Arabic side even for a quick fix.
- `t()`'s current locale is resolved once from `document.documentElement.lang`
  at module load (`resources/js/i18n/index.ts`) — it's not reactive, because
  locale only ever changes via a full page reload (see the `LocaleController`/
  `HandleLocale` middleware in `docs/architecture.md`). Don't add a locale
  prop/store expecting mid-session reactivity; it isn't needed.
- RTL: prefer Tailwind's logical-property utilities (`ms-*`, `me-*`, `ps-*`,
  `pe-*`, `text-start`/`text-end`, `border-s`/`border-e`) over physical ones
  (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `text-left`/`text-right`) for anything
  direction-sensitive — they flip automatically with the `dir` attribute, no
  Tailwind config needed. Only reach for an explicit `rtl:`/`ltr:` variant
  pair when there's no logical-property equivalent (e.g. swapping a directional
  arrow glyph — see `GuestLayout.vue`'s back-arrow or `Dropdown.vue`'s
  `alignmentClasses`).
- Laravel's own validation/auth error strings are localized separately from
  the Vue `t()` system, via `lang/en/*.php` / `lang/ar/*.php`. A new field
  name used in a Form Request or `$request->validate([...])` needs an entry
  added to `lang/ar/validation.php`'s `attributes` array too, or its error
  message will read awkwardly in Arabic (the raw English field name embedded
  in an otherwise-Arabic sentence).

## Frontend form validation (this repo specifically)

Full detail in [docs/frontend/README.md](docs/frontend/README.md)'s "Form
validation" section (feature) and
[docs/testing.md](docs/testing.md)'s "Testing client-side form validation"
(tests) — the essentials:

- **Every submit form validates client-side, in addition to** its existing
  backend `FormRequest`/inline `$request->validate()` rules — the backend
  stays authoritative (uniqueness, existence, auth checks aren't mirrored;
  there's nothing to check without a round trip). `resources/js/lib/validation.ts`
  is a small first-party utility (`required`, `isEmail`, `maxLength`,
  `minLength`, `numeric`, `integer`, `min`, `max`, `confirmedBy`,
  `filesRequired`, `fileType`, `fileMaxSize`, plus the `validateFields(data,
  rules)` runner) — no vee-validate/yup/zod/vuelidate is installed, don't add
  one for this.
- The component owning `useForm()` adds a `rules` map, an `attempted` ref,
  and `const clientErrors = computed(() => (attempted.value ? validateFields(form, rules) : {}))`,
  setting `attempted.value = true` and bailing out of `submit()` before
  `form.post/put/patch/delete` if `clientErrors.value` isn't empty. Pass
  `form` itself into `validateFields`, not `form.data()` (the Vitest mock's
  `form.data()` is a frozen initial-values snapshot, not live). See
  `resources/js/pages/Auth/Login.vue` for the reference implementation.
- Messages go through a new `tp(path, params)` export in
  `resources/js/i18n/index.ts` (parameterized `t()`, backed by the new
  `resources/js/i18n/locales/{en,ar}/validation.ts` domain) — validators
  call it internally; callers just pass the field's already-translated
  `label` string, no new per-field i18n keys needed.
- Direct `FormField`/etc bindings become `:error="clientErrors.x ||
  form.errors.x"`; components handing a whole `errors` object to a shared
  fields component (`CategoryFormFields`/`ProductFormFields`/
  `AddressFormFields`) become `:errors="{ ...clientErrors, ...form.errors }"`
  (server wins on conflict). Reset a form's `attempted` ref wherever its
  `clearErrors()`/`reset()` already gets called (modal open/close), so
  reopening an edit modal doesn't show stale validation state.
- New forms/fields follow the same pattern from the start — add the field's
  rules to that component's `rules` map and a matching test case (see
  `docs/testing.md`), don't ship a new required/format-constrained field
  with client-side validation only on the backend.

## PHPStan/Larastan conventions (this repo specifically)

Full detail in [docs/architecture.md](docs/architecture.md) — the essentials:

- Level 7. Every Eloquent relation method needs a generic-typed `@return`
  PHPDoc (`@return BelongsTo<Category, $this>`, `@return HasMany<ProductImage,
  $this>`, etc.), and every model with `use HasFactory;` needs
  `/** @use HasFactory<ItsFactory> */` right above that line. A plain
  `: BelongsTo`/`: HasMany` return type with no generic PHPDoc passes PHP
  itself fine but fails Larastan's `missingType.generics` check — apply the
  pattern to every new relation on every new model, not just the ones
  PHPStan happens to flag today.
- `composer types:check` already runs `phpstan analyse --memory-limit=1G` —
  PHPStan crashes with an OOM fatal error under PHP CLI's stock 128M default
  on this codebase. Pass the same flag if running `phpstan`/`vendor/bin/phpstan`
  directly instead of through Composer.
- Faker's locale-specific provider methods (`en_US\Address::secondaryAddress()`,
  `::state()`, etc.) aren't in the base `Faker\Generator` class's `@method`
  PHPDoc, so PHPStan flags them as undefined even though they work fine at
  runtime. **Do not** "fix" this with a PHPStan `stubFiles` entry
  re-declaring `Faker\Generator` — a stub for an already-autoloaded class
  replaces its reflection instead of merging with it, breaking every other
  (correctly-recognized) Faker method across every factory at once. Instead,
  call the flagged method's provider class statically
  (`\Faker\Provider\en_US\Address::state()`), bypassing `$this->faker`'s
  magic proxy for just that call — leave commonly-recognized methods
  (`name()`, `city()`, `postcode()`, ...) called through `$this->faker` as-is.

## Testing conventions (this repo specifically)

Full detail in [docs/testing.md](docs/testing.md) — the essentials:

- **Every file created or modified needs a test added or updated in the same
  pass** — a new Vue component gets a new `*.test.ts`, a changed component
  gets its existing test file updated to cover the change, a new/changed
  controller action or model gets the matching Pest/unit test. Don't defer
  this to a follow-up and don't treat a file as done until the test for it
  exists and passes. This is the general form of every specific rule below
  (models, admin controllers, shopper-facing controllers, Vue components) —
  those spell out the pattern per area, this line covers anything not
  explicitly listed.
- **Cookies in `encryptCookies(except: [...])`** (`appearance`, `sidebar_state`,
  `locale`) need the unencrypted Pest helpers — `withUnencryptedCookie()` to
  send one, `assertCookie($name, $value, encrypted: false)` to check one.
  Plain `withCookie()`/`assertCookie()` assume encryption and throw a
  decryption error on a raw value like `'ar'`.
- **Guard relationship tests with unrelated (noise) data.** A test that only
  creates the data it expects back can pass even if a relationship silently
  returns *everything* instead of filtering correctly. Create an unrelated row
  through the same relationship (another category's child, another user's
  address, etc.) and assert the result excludes it. Pure attribute-cast tests
  (querying by primary key) don't need this.
- **Frontend: prefer `findComponent(Component)` over `findComponent({ name: 'X' })`.**
  A component with an empty `<script setup></script>` (or none) gets no
  inferred name, so name-string matching silently returns an empty wrapper —
  no error, just a wrapper that looks "not found." Import the component and
  match by reference instead.
- **Frontend: default to `mount()`, not `shallowMount()`.** Only shallow-mount
  when a test purely asserts prop pass-through to a child component; anything
  that needs real form interaction, clicks, or slot content needs a full mount.
- **Frontend: reuse the `resources/js/tests/setup.ts` harness** (`useForm`
  mock + `getMockForm()` for seeding validation errors, `usePage` override +
  reset pattern, the global `route()` wiring, `renderStubDefaultSlot`) rather
  than re-mocking `@inertiajs/vue3`/`@/i18n` per test file.
- **Frontend: check that child components receive the right props, not just
  that the right text ends up on the page** — e.g. `Head`'s `title`, a
  `ConfirmationDialog`'s full prop set, a stubbed child's actual received
  prop. See [docs/testing.md](docs/testing.md) for the full pattern and two
  related gotchas: `.props('x')` only works for a component's *declared*
  props (`PrimaryButton` and friends forward `disabled`/etc. via `$attrs`
  instead — use `.attributes('x')`), and an inline `global.stubs` object
  needs an explicit `name` field before `findComponent({ name: 'X' })` can
  match it.
- **Frontend: every static text label a page/component renders — every
  `t('namespace.key')` call in its `<template>`, not just the ones a happy-path
  test happens to touch — needs an assertion that it actually shows up in
  `wrapper.text()`.** Don't stop at the strings a feature test needs to
  verify behavior (a status badge, a validation message); a heading, a
  section label, a button's own text, an empty-state message all count too.
  For a page with several such labels, add one dedicated test asserting the
  full set together (see `'renders all static text labels on the page'` in
  [Show.test.ts](resources/js/tests/pages/Account/Orders/Show.test.ts) for the
  pattern) rather than leaving any of them uncovered. Apply this in the same
  pass as adding or changing the template — don't defer it, and don't treat a
  component as fully tested just because *some* of its text is asserted
  elsewhere in the file.
- **A `.vue`/`.ts` file already having a matching `*.test.ts` is not proof its
  coverage is current — every change to a file needs the equivalent change in
  its test file, in the same pass.** `ShopAuthBanner.vue` gained a `cart.index`
  `DropdownLink` between the addresses and order-history links, but
  `ShopAuthBanner.test.ts`'s `'renders the ... dropdown links'` test kept
  asserting a length of 3 and never checked the new link — the gap went
  unnoticed because *a* test file existed and the other six tests in the file
  still passed. Before treating a component's test coverage as complete, diff
  the component's actual template/script against what the test file asserts —
  line by line, the same "don't infer coverage from the test file's
  existence" rule already stated above for a model's `$casts`/relationships
  against its `<Model>Test.php` — don't infer coverage from unrelated tests
  in the file passing.
- **Every admin CRUD endpoint — every page render AND every mutating
  action — needs its own non-admin-forbidden test, co-located in that
  resource's test file.** This applies to *all* of `index`/`create`/`edit`
  (`GET`) and `store`/`update`/`destroy` (`POST`/`PATCH`/`DELETE`), for every
  admin controller, not just the ones a reviewer happens to flag — when
  adding a new admin resource or a new action on an existing one, add the
  matching forbidden test in the same pass, don't leave it for later.
  `AdminMiddlewareTest`'s `admin_routes` dataset gives a generic "guest
  redirected / non-admin forbidden / admin gets 200" gate for param-less
  admin `GET` routes (add new `index`/`create`-style routes to that
  dataset) — but that dataset **does not substitute** for the per-resource
  tests below, it only covers what it structurally can't skip:
  - It only asserts `assertOk()`, not which Inertia component came back or
    which props it received.
  - It can't reach routes needing a route-bound model (`edit`,
    `update`, `destroy`, or any `store` needing a related record) since its
    entries are bare route-name strings with no params.
  - It only covers `GET` — `store`/`update`/`destroy` aren't in it at all.

  So each admin resource's own test file (e.g. `ProductControllerTest`,
  `CategoryControllerTest`, `AdminControllerTest`) needs, in addition to the
  happy-path tests:
  - Per page (`index`/`create`/`edit`): an admin-rendered test asserting
    `assertJsonPath('component', 'Admin/X/Y')` plus the key prop (e.g.
    `props.product.id`), **and** a `non-admin cannot list X` /
    `non-admin cannot view the X create or edit pages` test asserting
    `assertForbidden()` on those same `GET` routes.
  - Per mutating action (`store`/`update`/`destroy`): a
    `non-admin cannot create update or delete X` test asserting
    `assertForbidden()` on each, plus a DB assertion that nothing changed
    (`assertDatabaseHas`/`assertDatabaseMissing` on the untouched record).

  See [ProductControllerTest](tests/Feature/Admin/ProductControllerTest.php)
  and [CategoryControllerTest](tests/Feature/Admin/CategoryControllerTest.php)
  for the full pattern applied to one resource.

  This isn't limited to resources with a full `index`/`create`/`edit`/
  `store`/`update`/`destroy` set — it's **every route any admin controller
  exposes**. A single-action controller with no CRUD shape at all (e.g.
  `DashboardController`'s lone `GET /admin/dashboard`) still needs its own
  `non-admin cannot view the dashboard` test in `DashboardControllerTest`,
  same as a controller missing just one action's coverage (e.g.
  `AdminController` had `store`/`promote`/`revoke` covered but was missing
  `create` — go back and check the *full* action list against the test file
  before assuming existing coverage is complete, don't just pattern-match on
  whether *a* non-admin test exists in the file).
- **Every admin `index` that calls `->paginate()` needs a test proving it's
  actually paginating, not just returning everything in one response.** All
  five admin listing endpoints (`Product`, `Category`, `User`, `Order`,
  `Admin`) call `->paginate(15)`, and every existing happy-path test only
  creates 1-2 records — that count would pass identically whether the
  controller used `paginate(15)` or a plain `get()`, so it silently proves
  nothing about pagination itself. Add a test per resource that creates more
  than the page size (e.g. 20 records — enough to exceed `paginate(15)`) and
  asserts the *first page* doesn't contain all of them:
  `assertJsonCount(15, 'props.X.data')` plus `assertJsonPath('props.X.total',
  20)` and `assertJsonPath('props.X.per_page', 15)` (Laravel's
  `LengthAwarePaginator::toArray()` puts `total`/`per_page`/`current_page`/
  `last_page` at the top level alongside `data`, not nested under a `meta`
  key). Watch for helpers that add their own row to the same table —
  `actingAsAdmin()` creates a `User` row, so a `UserControllerTest` seeding
  20 more must assert `total` 21, and an `AdminControllerTest` test seeding
  19 more admins (plus the one from `actingAsAdmin()`) asserts `total` 20.
  Apply the same test to any *new* admin `index` action that paginates, at
  the same time the action is added.
- **A shopper-facing owned-resource controller (`CartController`,
  `CheckoutController`) needs the full matrix, not just the happy path per
  action**: guest-redirect, cross-user isolation (acting as one user must
  never read/mutate another user's cart/order/address — create a second
  user's data as noise and assert it's untouched), every `FormRequest`
  validation/authorization rule (required fields, invalid enum values, an
  `address_id`/foreign key that doesn't exist *and* one that exists but
  belongs to someone else), and every documented business-rule branch in the
  controller itself (e.g. `CheckoutController::store`'s empty-cart abort,
  insufficient-stock abort for both a plain product and a variant, the
  stock-decrement side effect, the `product_snapshot`/
  `shipping_address_snapshot` contents, multi-item total summation, and
  `stripeReturn`'s session-id-mismatch and already-paid idempotency guards).
  See [CartControllerTest](tests/Feature/CartControllerTest.php) and
  [CheckoutControllerTest](tests/Feature/CheckoutControllerTest.php) for the
  pattern — when adding a new branch to either controller, add its test in
  the same pass rather than only covering the new code's happy path.
- **Every model relationship and cast needs a `tests/Unit/Models/<Model>Test.php`
  test, added in the same pass as the model change** — not deferred, not
  left to feature-test coverage to catch incidentally. This project has one
  test file per model (`CategoryTest`, `ProductTest`, `UserTest`, ...) and
  they were falling behind: `Order`/`OrderItem` shipped with zero test
  files, and `User::orders()` was added as a bare relation with no test
  asserting it resolves or filters correctly.
  - **New model** → new `tests/Unit/Models/<Model>Test.php` covering every
    relationship method (one test per `belongsTo`/`hasMany`/etc.) and every
    cast in `$casts`/`casts()`.
  - **New relationship or cast on an existing model** → add the matching
    test to that model's existing test file in the same change, don't wait
    for a reviewer to notice the gap.
  - **A model already having a `<Model>Test.php` file is not proof its
    coverage is current** — `Order` shipped an `OrderTest.php` covering
    `user()`/`status`/`total`, but `orderItems()` and the `payment_method`/
    `payment_status`/`paid_at`/`shipping_address_snapshot` casts were added
    to the model later without a matching test update, and the gap went
    unnoticed because *a* test file existed. Before treating a model's test
    coverage as complete, diff the model's actual `$casts`/`casts()` array
    and relationship methods against what the test file asserts — line by
    line, not by skimming for "does a test exist for this model."
  - Relationship tests always include **unrelated (noise) data** — see the
    "Guard relationship tests with unrelated data" rule above; a relation
    test without a second, unrelated parent/owner in the setup can pass even
    when the relation silently returns every row instead of filtering.
  - Cast tests write with the *raw* un-cast value (e.g. `'stock' => '42'`,
    `'is_primary' => 1`, `'status' => 'completed'`) and re-fetch a fresh
    model instance (`Model::find($id)` or `->fresh()`) before asserting the
    cast type/value — asserting against the in-memory instance from
    `factory()->create()` can pass even if the cast is missing, since Eloquent
    may already hold the value in the shape you passed it.
  - A model method that mutates state beyond a simple attribute set (e.g.
    `ProductImage::makePrimary()`, `Address::makeDefault()`) gets the same
    unit-test treatment as a relationship: one test for the direct effect,
    one for "unsets the previous holder of this flag among siblings," one
    for "does not affect an unrelated sibling group" — see
    `AddressTest`'s `makeDefault` tests or `ProductImageTest`'s
    `makePrimary` tests for the three-test shape to copy.
- **A backed enum that gains a business-logic method (not just cases) needs
  its own `tests/Unit/Enums/<Enum>Test.php`** — e.g. `OrderStatus::
  allowedTransitions()`/`canTransitionTo()` (added alongside admin order
  editing) has `tests/Unit/Enums/OrderStatusTest.php` covering every
  transition and every terminal state. An enum with no methods (just cases,
  cast on a model) doesn't need this — there's no logic to test beyond the
  cast itself, which the owning model's test already covers.
- **A new class under `app/Services/*` needs a
  `tests/Unit/Services/<...>/<Class>Test.php`**, mirroring the
  `app/Services/` path — e.g. `app/Services/Stripe/RefundCreator.php` maps
  to `tests/Unit/Services/Stripe/RefundCreatorTest.php`. Mock third-party
  SDK clients the same way `RefundCreatorTest` mocks `StripeClient`: its
  properties aren't directly mockable, so stub the specific property via a
  small subclass overriding `__get()`, rather than trying to mock the SDK
  client itself.

## Browser (Playwright) end-to-end testing (this repo specifically)

Full detail in [docs/testing.md](docs/testing.md)'s "Browser (Playwright)
end-to-end testing" section — the essentials:

- Pest hits routes directly and asserts on the JSON/Inertia response; it
  doesn't prove the *Vue page* renders correctly or that a real browser can
  click through a full flow. `tests/e2e/*.spec.ts` (Playwright) is a
  **required, not optional** companion — every user-facing feature/page
  needs a spec exercising its primary flow(s), added in the same pass as the
  feature, not deferred. One spec file per feature area (`auth.spec.ts`,
  `cart-checkout.spec.ts`, `admin-orders.spec.ts`, etc. — see
  `docs/testing.md` for the full existing set).
- **Scope**: happy-path flows through the real UI, not a re-litigation of
  Pest's authorization/edge-case matrix — that's what the Pest suite's
  per-resource `non-admin cannot ...` tests are for.
- **Fixtures**: `database/seeders/E2eSeeder.php` (deterministic data, run via
  `--class=E2eSeeder`) — add a **new, distinct** seeded record rather than
  repurposing an existing one when a spec needs to *mutate* shared state.
- **Environment**: `.env.e2e` + `database/e2e.sqlite`, prepared by
  `tests/e2e/prepare-db.mjs` inside `playwright.config.ts`'s `webServer`
  command (must happen there, not in `globalSetup`, which runs too late).
- **Run**: `npm run test:e2e` (or `npx playwright test tests/e2e/x.spec.ts`
  for one file). CI runs it after `composer ci:check` in
  `.github/workflows/tests.yml`.
- **Shared helpers**: `tests/e2e/helpers.ts` exports `login()` and seeded-user
  credential constants — import from there, don't redeclare per spec file.
- Recurring gotchas worth knowing before you hit them again (substring-match
  text selectors, scoping same-labeled buttons/dialogs, a stacked table
  cell's text joining with no whitespace, a type-hinted service dependency
  resolving even down an unused code path): see `docs/testing.md` for the
  full list with examples.

