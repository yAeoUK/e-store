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
  lib/                           # slugify(), cn() unit tests
  componenets/                   # note: repo's existing typo, kept for consistency
    shop/                        # shop-specific components (ProductCard, CatalogLayout, ...)
    common/                      # shared/generic components (Modal, Dropdown, buttons, ...)
    admin/                       # admin-only composites (DataTable, *FormFields, SlugField, ...)
    ui/                          # shadcn-vue primitives (Table, Badge)
  pages/
    Auth/                        # Login, Register, ForgotPassword, ResetPassword, ...
    Account/                     # Addresses, Orders
    Products/, Categories/       # shop pages
    Admin/                       # Dashboard, Products, Categories, Users, Admins, Orders
  Layouts/                       # ShopLayout, AdminLayout, GuestLayout
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
- **Testing cookies that are in the `encryptCookies(except: [...])` list**
  (`appearance`, `sidebar_state`, `locale`) needs the *unencrypted* variants of
  Pest's cookie helpers, not the defaults: `withUnencryptedCookie($name, $value)`
  to send one, and `assertCookie($name, $value, encrypted: false)` to check
  one on the response. Plain `withCookie()`/`assertCookie()` assume the cookie
  *is* encrypted and will try to decrypt a raw value like `'ar'`, throwing
  `Illuminate\Encryption\Encrypter`'s "The payload is invalid." — see
  `tests/Feature/LocaleTest.php` for a working example.
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
  - Exception: a **custom `global.stubs` object** you write inline (e.g.
    `{ template: '<div data-test="x" />', props: ['product'] }`, used in
    `CatalogLayout.test.ts` to stub `ProductCard`/`ProductFilters`/
    `CategoryNavigation`) has no name at all unless you add one — there's no
    real component to import a reference from, since you wrote the stub
    yourself. Give it an explicit `name: 'ProductCard'` field if you want to
    `findComponent({ name: 'ProductCard' })` it later; otherwise you're stuck
    with a `[data-test="..."]` DOM selector, which can't assert on props.
- **Check that child components actually receive the props you think they
  do — don't stop at "the right text is on the page."** A page can render
  correct-looking text while silently passing the wrong prop to a child (or
  no prop at all) if the child falls back to some other source for its
  display text. Concretely: assert `wrapper.findComponent(Head).attributes('title')`
  for every page's `<Head :title>` (every Auth page test does this — a few
  other pages didn't, and it went unnoticed because the *page* still rendered
  fine); assert a `ConfirmationDialog`'s full prop set
  (`title`/`message`/`confirmLabel`/`danger`/`processing`), not just `show`;
  assert a stubbed child's actual received prop
  (`wrapper.findComponent({name:'CatalogLayout'}).props('categories')`)
  instead of just its existence. This applies with the same weight whether
  the child is a shared component (`FormField`, `ConfirmationDialog`) or a
  page-local one (`AddressFormFields`) — check the direct child's own props,
  and trust that child's *own* test file (if it has one) to verify what it
  does with them internally, rather than reaching two components deep from
  the page test.
- **`.props('x')` only works for a component's *declared* props.** Several
  components here (`PrimaryButton`, `SecondaryButton`, `DangerButton`,
  `TextLink`) have no `defineProps` at all and rely on `v-bind="$attrs"` to
  forward whatever the caller passes (`disabled`, `type`, ...) straight to
  the native element. `wrapper.findComponent(PrimaryButton).props('disabled')`
  silently returns `undefined` even when `:disabled="true"` was passed and is
  visibly working — use `.attributes('disabled')` instead (present/`''` when
  true, `undefined` when false, since Vue omits falsy boolean attrs
  entirely). If you're not sure whether a prop is declared, check the
  component's `defineProps`/`defineModel` calls before choosing which API to
  assert with.
- **Reactive proxies aren't reference-equal to the plain object you built.**
  `useForm()`'s mocked `form.errors` (or any prop sourced from a `reactive()`
  object) is a Proxy wrapping whatever you assigned — `expect(form.errors).toBe(rawErrorsObject)`
  fails even though the content is identical, because `toBe` is `Object.is`
  reference equality and the proxy is a different object. Use `.toEqual()`
  for object/array props sourced from reactive state; reserve `.toBe()` for
  primitives or values you're certain aren't proxied.

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
  - `post` synchronously calls `options.onSuccess?.()` then `options.onFinish?.()`;
    `patch` does the same; `get` calls only `options.onFinish?.()` — no need
    to await a real network round-trip either way.
  - `clearErrors()` resets `errors` back to `{}`.
  - `reset(...fields)` restores the named fields (or *all* fields, if called
    with no arguments) back to their values at the time `useForm()` was called.
  - `errors` starts as `{}` and `processing` starts as `false`.
- **`getMockForm(index = 0)`** — exported alongside `useForm`. Returns the
  mock form instance from the `index`-th `useForm()` call (in call order)
  made by the currently-mounted component, reset before every test — so a
  test can seed validation errors *after* mounting a page and confirm they
  render. Defaults to the first form, which is all any single-form page needs;
  pass an explicit index for a component that calls `useForm()` more than
  once (e.g. `Account/Addresses.vue` has a create `form` and an edit
  `editForm` — `getMockForm(0)`/`getMockForm(1)` respectively, in the order
  they're declared in the component's `<script setup>`):

  ```ts
  const wrapper = mount(Register);

  getMockForm().errors = { email: 'The email field is required.' };
  await wrapper.vm.$nextTick();

  expect(wrapper.findAllComponents(FormField)[1].props('error'))
      .toBe('The email field is required.');
  ```

  This is what makes validation-error-rendering tests possible even though none
  of the Auth/Account pages expose their `form` via `defineExpose`. It also
  works for `processing`: `getMockForm().processing = true` then assert
  `wrapper.findComponent(PrimaryButton).attributes('disabled')` is defined —
  the mock doesn't toggle `processing` itself during a `post`/`patch` call
  (it just invokes the callback options), but directly setting it still
  proves the template's `:disabled="form.processing"` wiring is correct.
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
