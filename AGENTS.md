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

## Reuse before writing new UI

- Before writing a `<button>`, `<input>`, a modal/dropdown, or repeating a
  Tailwind class string, check `resources/js/components/*.vue` (top level,
  not `shop/`) for an existing component that already does it — see
  [docs/design-system/README.md](docs/design-system/README.md) for the full
  inventory (buttons, inputs, `Modal`, `Dropdown`, `ConfirmationDialog`,
  typography wrappers, etc.) and the shared Tailwind class tokens in
  `resources/js/components/classNames.js`.
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
  `AddressPolicy` (`view`/`update`/`delete`) is the app's first and — so far
  — only Policy; use it as the template if a second owned-resource needs the
  same treatment. Call it via `$this->authorize('ability', $model)` in a
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

