# Testing

How this project is tested, the conventions in use, and the frontend test
harness — with enough detail that you don't have to reverse-engineer it from
the test files themselves.

## Commands

```bash
# Backend (Pest)
php artisan test --compact

# Frontend (Vitest)
npx vitest run
```

Narrower runs:

```bash
# One backend test file
php artisan test tests/Unit/Models/ProductTest.php --compact

# One backend test by name
php artisan test --filter=test_user_can_update_an_address --compact

# One frontend test file
npx vitest run resources/js/tests/pages/Auth/Login.test.ts

# Frontend, watch mode
npx vitest

# Frontend, one test by name
npx vitest run -t "renders validation errors when present"
```

CI / pre-PR checks:

```bash
php artisan test --compact
npx vitest run --reporter=dot
npm run types:check
npm run lint:check
vendor/bin/pint --dirty --format agent   # after touching PHP files
```

This project uses **npm** (see `package-lock.json`) — not pnpm, despite a
leftover `pnpm-workspace.yaml` in the repo root.

## Directory layout

```
tests/
  Feature/                       # Pest feature tests (HTTP, Inertia responses)
  Unit/Models/                   # Pest unit tests (relationships, casts)

resources/js/tests/
  setup.ts                       # global Vitest setup (see below)
  utils.ts                       # small shared fixtures (e.g. defaultProducts)
  componenets/                   # note: repo's existing typo, kept for consistency
    shop/                        # shop-specific components (ProductCard, CatalogLayout, ...)
    common/                      # shared/generic components (Modal, Dropdown, buttons, ...)
  pages/
    Auth/                        # Login, Register, ForgotPassword, ResetPassword, ...
    Account/                     # Addresses, Orders
    Products/, Categories/       # shop pages
  Layouts/                       # ShopLayout, GuestLayout
```

## Backend (Pest) conventions

- **Style**: functional Pest style (`test('...', function () { ... })` / `expect()`)
  is the dominant convention and is used for every `tests/Unit/` file and most
  of `tests/Feature/`. `AccountTest.php` and `ProfileTest.php` are the deliberate
  exception — they're written as PHPUnit test classes, and new tests added to
  those files should match that existing style rather than converting them.
- **Database**: `tests/Pest.php` binds `RefreshDatabase` to *both* the `Feature`
  and `Unit` suites, so unit tests that touch the database (relationships,
  casts) work without extra setup per file.
- **Factories**: every model has a factory under `database/factories/`,
  including `AddressFactory`. Always build test data through factories rather
  than raw `Model::create()`.
- **Guard relationship tests with unrelated (noise) data.** A relationship test
  that only creates the data it expects to get back can pass even if the
  relationship silently returns *everything* instead of filtering correctly
  (e.g. a missing `where`/foreign key match). The pattern used throughout
  `tests/Unit/Models/` is: create an unrelated row through the *same*
  relationship (another category's child, another product's image, another
  user's address, etc.) and assert the result excludes it. See `CategoryTest`,
  `ProductTest`, `ProductVariantTest`, `ProductImageTest`, `AddressTest`, and
  `UserTest` for examples. Pure attribute-cast tests (which query by primary
  key, e.g. `Model::find($id)`) don't need this — there's no filtering to get
  wrong.

## Frontend (Vitest) conventions

- **`mount()` vs `shallowMount()`**: default to `mount()` — a full render is
  needed whenever a test interacts with real form fields, clicks, or slot
  content. `shallowMount()` is only used for the three shop pages
  (`Products/Index`, `Products/Show`, `Categories/Show`) whose tests solely
  assert that props are passed through correctly to `CatalogLayout`/
  `ProductGallery`.
- **Prefer `findComponent(Component)` over `findComponent({ name: 'X' })`.**
  A `<script setup>` block with real content (imports, logic) gets a component
  name inferred by the Vue compiler, which name-string matching relies on. A
  component with an **empty** `<script setup></script>` (or no script block at
  all — e.g. `MutedText`, `SuccessText`, `DangerButton`) does **not** get an
  inferred name, and `findComponent({ name: 'X' })` then silently returns an
  empty wrapper — no error, just a wrapper whose `.exists()` is `false` and
  whose other methods throw if you try to use them. Importing the actual
  component and matching by reference avoids this trap entirely and works
  regardless of whether a name was inferred.

## The `setup.ts` test harness

`resources/js/tests/setup.ts` is Vitest's global setup file (wired in via
`vitest.config.ts`) and mocks `@inertiajs/vue3` and `@/i18n` for every test in
the suite. Nothing here needs to be re-mocked per file.

- **`Head`** — a trivial stub (`<div><slot /></div>`) that forwards attrs, so
  `wrapper.findComponent(Head).attributes('title')` works for asserting page
  titles.
- **`Link`** — a stub declaring only `href` as a component prop
  (`<a :href="href"><slot /></a>`). Any other attribute passed to it (`method`,
  `as`, etc.) is **not** a declared prop, but Vue's automatic attribute
  fallthrough still places it on the rendered `<a>` element — so assert those
  via `wrapper.findComponent(Link).attributes('method')`, not `.props('method')`.
- **`router.get` / `router.post`** — plain `vi.fn()`s. They persist call
  history across tests within the same file (and are shared module-level
  state), so any test asserting on call counts should `.mockClear()` them in a
  `beforeEach`.
- **`useForm(initial)`** — returns a `reactive()` object that mimics Inertia's
  real form helper closely enough for component tests:
  - `post`/`get` synchronously call `options.onFinish?.()` — no need to await
    a real network round-trip.
  - `reset(...fields)` restores the named fields (or *all* fields, if called
    with no arguments) back to their values at the time `useForm()` was called.
  - `errors` starts as `{}` and `processing` starts as `false`.
- **`getMockForm()`** — exported alongside `useForm`. It returns the most
  recently created mock form instance, so a test can seed validation errors
  *after* mounting a page and confirm they render:

  ```ts
  const wrapper = mount(Register);

  getMockForm().errors = { email: 'The email field is required.' };
  await wrapper.vm.$nextTick();

  expect(wrapper.findComponent(InputError).props('message'))
      .toBe('The email field is required.');
  ```

  This is what makes validation-error-rendering tests possible even though none
  of the Auth/Account pages expose their `form` via `defineExpose`.
- **`usePage()`** — a `vi.fn()` defaulting to an anonymous user
  (`{ props: { auth: { user: null } } }`). Override it per test with
  `vi.mocked(usePage).mockReturnValue({ props: { auth: { user: {...} } } })`,
  and reset it back to the anonymous default in `afterEach` — it's shared
  module state, so an override in one test otherwise leaks into the next.
- **Global `route()`** — Ziggy's `route()` helper is normally installed by
  `app.use(ZiggyVue)` at runtime; in tests it's stubbed two ways from the same
  `routeMock` export so both call sites work:
  - `globalThis.route` — resolves plain script-level calls, e.g. inside a
    page's `submit()` handler (`form.post(route('login'), ...)`).
  - `config.global.config.globalProperties.route` — resolves *template*-level
    calls, e.g. `GuestLayout`'s `<Link :href="route('home')">`, since those
    compile to `_ctx.route(...)` and need a Vue app-level global property, not
    just a bare global function.

  Import `routeMock` from `../../setup` (adjust the relative path to your
  file's depth) to assert which route name a component requested, and
  `.mockClear()` it in `beforeEach` if you're asserting call counts.
- **`config.global.renderStubDefaultSlot = true`** — `@vue/test-utils`
  defaults this to `false`. Left at the default, `shallowMount()` auto-stubs
  every child component *and never renders their default slot content* — which
  silently breaks any test relying on a nested component inside an
  auto-stubbed parent's slot (e.g. `CatalogLayout` passed into `ShopLayout`'s
  default slot in `Products/Index.vue`). This one-line override restored 10
  pre-existing tests that were failing for this exact reason before it was
  added — if you see a `shallowMount()` test where `findComponent(...).exists()`
  is unexpectedly `false` for something that's clearly in the template, check
  this setting first before assuming the component is broken.
