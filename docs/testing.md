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
  Unit/Enums/                    # Pest unit tests for enum methods (e.g. OrderStatus's transition graph)
  Unit/Services/                 # Pest unit tests for app/Services/* (e.g. Stripe/RefundCreator)

resources/js/tests/
  setup.ts                       # global Vitest setup (see below)
  utils.ts                       # shared fixtures (defaultProducts, defaultOrder, ...) and
                                  # test-authoring harnesses (see "Shared fixtures & harnesses" below)
  lib/                           # slugify(), cn() unit tests
  composables/                   # useFormValidation, useEditableForm, useCartSubtotal, ...
  componenets/                   # note: repo's existing typo, kept for consistency
    shop/                        # shop-specific components (ProductCard, CatalogLayout, ...)
    common/                      # shared/generic components (Modal, ShopAuthBanner, buttons, ...)
    admin/                       # admin-only composites (DataTable, *FormFields, SlugField, ...)
    ui/                          # shadcn-vue primitives (Table, Badge)
  pages/
    Auth/                        # Login, Register, ForgotPassword, ResetPassword, ...
    Account/                     # Addresses, Orders, Orders/Show
    Cart/, Checkout/             # cart & checkout pages
    Products/, Categories/       # shop pages
    Admin/                       # Dashboard, Products, Categories, Users, Admins, Orders
  Layouts/                       # ShopLayout, AdminLayout, GuestLayout

tests/e2e/                       # Playwright specs — see "Browser (Playwright)
                                  # end-to-end testing" below
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
- **Shared test helpers live in `tests/Pest.php`**, as plain global
  functions (not custom `expect()->extend()` matchers) — reach for one of
  these before writing another one-off admin-forbidden/pagination/slug
  assertion by hand:
  - `makeAdmin(): User` (an admin *not* acted-as, for "another admin exists"
    noise data) and `actingAsAdmin()` (a thin wrapper around it that also
    acts as the created admin).
  - `assertIndexPaginates(routeName, propKey, seed, expectedTotal = 20,
    actingAs = null, perPage = 15)` — the generic version of the
    "every admin `index` needs a pagination test" pattern described in
    `AGENTS.md`'s testing conventions.
  - `assertAdminIndexRenders(...)` / `assertAdminIndexFiltersBy(...)` —
    Inertia-component/row-count and filtered-row-count assertions for an
    admin index route; `assertAdminIndexRenders` returns the `TestResponse`
    for further chaining.
  - `assertNonAdminCannotView(routeName)` (GET-only 403 check) /
    `assertNonAdminForbidden(verb, url, payload = [])` (arbitrary
    verb+URL, e.g. a `refund` POST) / `assertNonAdminCannotMutate(resource,
    Model $instance)` (checks store/update/destroy all 403 and the row is
    untouched, assuming conventional `admin.{resource}.*` route names) /
    `assertNonAdminCannotViewCreateOrEditPages(resource, instance)` — the
    generic versions of the per-resource "non-admin cannot ..." tests
    `AGENTS.md` requires for every admin action.
  - `assertAdminCanRenderCreatePage` / `assertAdminCanRenderEditPage` —
    Inertia-component + list/own-prop assertions for the two page types.
  - `assertAdminCanUpdateForeignKeyOnResource(resource, table, foreignKey,
    instance, newRelated)` — covers both setting and clearing an FK to null.
  - `assertAdminCanDeleteResource` / `assertAdminCannotDeleteResourceInUse(resource,
    instance, errorKey)` — the delete-guard pair for
    `GuardsRelatedDeletes`-backed `destroy()` actions (see
    [docs/architecture.md](architecture.md)).
  - `assertScopedChildNotFoundForWrongParent(parent, child, requests)` — a
    404 matrix for `scopeBindings()`-nested routes (e.g.
    `admin.products.images.destroy` with an image belonging to a *different*
    product) — see `docs/architecture.md`'s note on
    `ProductImageController`/`ProductVariantController`'s scoped bindings.
  - `assertSlugIsAutoGeneratedAndDeduplicated(modelClass, storeClosure,
    updateClosure)` — the full slug lifecycle in one call: generate, dedupe
    (`-1`, `-2`), regenerate on clear, preserve on an unrelated rename.
  - `assertBelongsToResolvesCorrectOwner` /
    `assertHasManyResolvesCorrectOwner(ownerClass, relatedClass, foreignKey,
    relation)` — the formalized version of the "guard relationship tests
    with unrelated data" pattern just above; prefer these over a hand-rolled
    noise-row assertion for a plain `belongsTo`/`hasMany` relation.
  - `makeScopedFlagRow` + `assertExclusiveFlagMarksSelf` /
    `assertExclusiveFlagUnsetsPreviousHolder` /
    `assertExclusiveFlagScopedToOwner` — the three-test shape for a
    `HasExclusiveFlag`-backed method (`Address::makeDefault()`,
    `ProductImage::makePrimary()` — see `docs/architecture.md`), replacing
    the hand-written trio described in `AGENTS.md`'s testing conventions.
  - `userWithAddress(): [User, Address]`, `createCartItem(user, overrides =
    [])`, `createCartWithItems(user, itemCount = 1, quantity = 2)`,
    `stripeOrderInState(order, overrides = [])` — cart/checkout/Stripe
    fixture builders.
  - `assertForeignUserCannotAccessResource(...)` /
    `assertGuestCannotAccessResource(...)` — the generic cross-user-isolation
    and guest-redirect checks `AGENTS.md` requires for shopper-owned
    resources (`CartController`, `CheckoutController`, addresses, orders).
- **Mocking the Stripe SDK**: `StripeClient`'s properties (`->refunds`,
  `->checkout`, ...) aren't directly mockable — `RefundCreatorTest` stubs
  `->refunds` via a small `FakeStripeClientForRefund extends StripeClient`
  that overrides `__get('refunds')` to return a Mockery double. Copy this
  subclass-with-`__get`-override shape for any new Stripe API surface that
  needs mocking, rather than trying to mock `StripeClient` directly.

## Frontend (Vitest) conventions

- **`mount()` vs `shallowMount()`**: default to `mount()` — a full render is
  needed whenever a test interacts with real form fields, clicks, or slot
  content. `shallowMount()` is only used for the two shop pages
  (`Products/Index`, `Categories/Show`) whose tests solely assert that props
  are passed through correctly to `CatalogLayout`. `Products/Show` uses a full
  `mount()` — its gallery markup is inline (see below), not a separate
  component to shallow-render around.
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
- **`resources/js/tests/utils.ts` is now a shared fixture *and* harness
  library, not just "a couple of default fixtures."** Beyond fixture
  builders (`defaultAddress`, `defaultAddressSnapshot`, `defaultOrderItem`,
  `defaultOrder`, `defaultFilters`, `defaultCategories`,
  `adminCategoryRefs`, alongside the original `defaultProducts`), it exports
  reusable **test-authoring harnesses** that collapse a repeated `it()`-block
  pattern shared across multiple component test files —
  `createFieldsHarness`/`testLabeledFieldContract` (the shared
  `FormField`/`SelectField`/`TextareaField` contract),
  `testStatusBadgeWrapperContract`, `testDeleteConfirmationFlow`/
  `testConfirmationDialogFlow`, `testRendersEditLink`,
  `testRendersIndexLayout`, `testAdminResourceFormLayout`,
  `testSlugNotAutoSyncedOnEdit`/`testAutoSlugFromNameOnCreate`/
  `testAutoSlugSourceProp`, `testErrorsAssignedToFormFields`,
  `testRendersLabels`, `testServerErrorFlash`, `testSubmitsToUpdateRoute`,
  `testBindsProductMiscFieldsToForm`, `expectBlocksSubmissionWithClientError`,
  `expectRendersPageTitle`, plus small mount helpers (`pageWith`/
  `pageWithUrl` for building a `usePage()` mock, `findButton`,
  `testEmitsSubmitOnFormSubmit`). Check here before writing another
  near-identical assertion block for a component that already fits one of
  these shapes (a labeled field, a status badge wrapper, a delete/confirm
  dialog flow, an admin index page's layout, ...).
  - **Gotcha**: a field's "required" asterisk is a CSS `::after` pseudo-element
    (`after:content-['*']`), not a text node — `testLabeledFieldContract`
    asserts on the class containing that content string, not
    `wrapper.text()).toContain('*')`, which would never match.
- **Testing client-side form validation** (see
  [docs/frontend/README.md](frontend/README.md)'s "Form validation" section
  for the feature itself): every form with client rules needs a test that
  leaves a required/invalid field as-is, triggers a submit, and asserts two
  things — the mocked form's `post`/`patch`/`put`/`delete` was never actually
  invoked (`getMockForm(index).lastPostUrl` stays `undefined`, since the mock
  sets that field the moment `post`/etc. is called), and the matching
  `validation.*` message renders (e.g. `wrapper.text()).toContain('validation.required')`
  — `@/i18n`'s `t`/`tp` are both globally mocked to return the raw key
  unmodified, so asserting the literal `validation.xxx` string is correct and
  expected, not a placeholder that needs fixing). Existing happy-path submit
  tests (valid fixture values, asserting `routeMock`/`lastPostUrl` *was*
  called) don't need new assertions — client rules only reject what the
  backend would already reject, so a valid fixture never trips them.

## Browser (Playwright) end-to-end testing

Pest feature tests hit routes directly and assert on the JSON/Inertia
response; they do not prove the *Vue page* actually renders correctly, that
a button's click handler is wired to the right form, or that a real browser
can click through a full flow. `tests/e2e/*.spec.ts` (Playwright) exists for
exactly that gap, and is a **required, not optional** companion to Pest
coverage — every user-facing feature/page needs a spec exercising its
primary flow(s) in a real browser, added in the same pass as the feature,
not deferred to a follow-up.

- **One spec file per feature area** — `auth.spec.ts`, `profile.spec.ts`,
  `catalog.spec.ts`, `addresses.spec.ts`, `cart-checkout.spec.ts`,
  `admin-products.spec.ts`, `admin-categories.spec.ts`, `admin-users.spec.ts`,
  `admin-orders.spec.ts`, `admin-admins.spec.ts`, `admin-dashboard.spec.ts`
  are the existing set. Add a new file for a genuinely new area, extend an
  existing one for a new action within an area already covered.
- **Scope: happy-path flows through the real UI, not a re-litigation of
  Pest's authorization/edge-case matrix.** Playwright specs answer "does
  clicking through this actually work," not "does every 403/422 case
  work" — that's what the Pest suite's per-resource `non-admin cannot ...`
  tests are for. Don't duplicate that matrix in Playwright; do add a flow
  for every route a real user/admin can reach through the UI (list, create,
  edit, delete, and any sub-panel like image/variant management).
- **Fixtures**: `database/seeders/E2eSeeder.php` is the dedicated seeder for
  this suite (run via `--class=E2eSeeder`, never the default
  `DatabaseSeeder`) — deterministic emails/slugs/SKUs, not random factory
  output, so specs can select on fixed values. Add new fixtures there in the
  same pass as a new spec that needs them, and add a **new, distinct**
  seeded user/record rather than repurposing an existing one when a test
  needs to *mutate* shared state (see `ADDRESS_OWNER` vs the
  `cart-checkout.spec.ts` customer, or `ORDER_HISTORY_CUSTOMER` vs the
  checkout-flow customer) — two specs mutating the same seeded row is a
  cross-file ordering hazard, not a simplification.
- **Environment**: `.env.e2e` + `database/e2e.sqlite` (gitignored, created
  fresh every run) — entirely separate from your local dev DB. Playwright's
  `webServer` in `playwright.config.ts` runs `tests/e2e/prepare-db.mjs`
  (creates the sqlite file, `migrate:fresh`, seeds `E2eSeeder`) **before**
  `artisan serve` starts. **This ordering matters**: Playwright starts
  `webServer` and waits for it to respond *before* running any configured
  `globalSetup` — DB preparation that depends on the app already being
  correctly seeded must happen inside `webServer.command` itself, not in
  `globalSetup` (which runs too late, after the health-check either passes
  against an unseeded DB or times out).
- **Run locally**: `npm run test:e2e` (add a path argument to run one file
  while iterating, e.g. `npx playwright test tests/e2e/auth.spec.ts`). CI
  runs the full suite via `.github/workflows/tests.yml` after the existing
  `composer ci:check` step, installing Chromium via
  `npx playwright install --with-deps chromium` first.
- **Shared helpers**: `tests/e2e/helpers.ts` exports `login()`, the
  seeded-user credential constants, and a growing set of scoping/flow
  helpers — import from there, don't redeclare per spec file:
  `formWithField(page, label)` (locates the `<form>` containing a given
  labeled field, for a page with more than one independent form — see the
  admin order Show page gotcha below), `confirmDialog(page, name)` (clicks a
  named button inside `page.locator('dialog')`), `rowWithText(page, text,
  tag = 'tr')`, `filterBy(page, label, value)` (fill a filter field then
  click "Confirm"), `deleteViaDialog(...)`, plus the auth-flow helpers
  `registerUser()`/`loginExpectingFailure()`/`logout()`.
- **Gotchas that recur** (each cost real debugging time writing this
  suite — don't rediscover them):
  - **Playwright's `getByText`/`getByRole` default to substring matching.**
    "Default" matches inside "Set as default"; "E2E Category" matches
    inside "E2E Category Two" *and* as another row's Parent-column cell (a
    `<td>` wrapping a link still exposes the link's text as the cell's own
    accessible name). Pass `{ exact: true }`, scope to a specific row/cell
    (`page.locator('tr', { hasText: ... })`), or use `.first()` when a weak
    "this renders somewhere" check is all that's needed.
  - **A page with two forms that each have a same-labeled submit button**
    (e.g. `Profile/Edit.vue`'s "Update Profile Information" and "Update
    Password" forms both have a "Save" button) **must be scoped per-form**
    — `page.locator('form', { has: page.getByLabel('Current Password') })`
    then `.getByRole('button', { name: 'Save' })` off that scoped locator —
    or the click can silently submit the *other* form, and the test still
    "passes" its `"Saved."` assertion while never doing what it thought it
    did.
  - **`ProductVariantManager.vue`'s "Add Variant" form and its "Edit
    Variant" modal render simultaneously once a variant is being edited**
    (the add form never unmounts) — every field label (SKU/Price/Stock/
    Options/Active) is duplicated on screen at that moment. Scope all
    edit-modal interactions to `page.locator('dialog')`.
  - **Two `<dialog>`-based components can coexist in the DOM at once**
    (e.g. an edit `Modal` plus a delete `ConfirmationDialog` on the same
    page) but only the currently-open one has its slot content mounted, so
    `page.locator('dialog').getByRole(...)` still resolves uniquely in
    practice — you don't need to hunt for a more specific selector than
    `dialog` itself.
  - **A confirmation dialog's own trigger button can still be "in" the
    page (just visually behind the overlay) when its confirm button shares
    the same text** — e.g. the "Log Out" dropdown item and the
    `ConfirmationDialog`'s "Log Out" confirm button. Scope the second click
    to the dialog (`page.locator('dialog').getByRole('button', { name:
    'Log Out' })`), don't assume the first matching element is the right
    one.
  - **A stacked two-line table cell (e.g. Admin Orders' "Payment" column:
    payment method text above a status badge) can join with no whitespace
    between the lines when read via `allTextContents()`**, breaking a
    `\bWord\b`-style regex across that seam. Prefer a plain substring
    match (relying on case-sensitivity to disambiguate, e.g. `"Paid"` vs
    `"Unpaid"`) over a word-boundary regex when asserting on joined cell
    text.
  - **A shared module-level counter for generating unique test data (e.g.
    a fresh email per test) is not reliably safe across tests** — derive
    uniqueness from Playwright's own `testInfo.testId` instead. A collision
    here doesn't fail loudly at the point of the mistake; it surfaces as a
    confusing "email already taken" failure in a *different*, seemingly
    unrelated test.
  - **`Admin/Orders/Show.vue` has three independent forms/actions on one
    page** (status change, admin note, refund) — the same same-labeled
    "Save" trap as `Profile/Edit.vue` above applies, which is exactly what
    `formWithField(page, label)` exists to solve: it walks up from a labeled
    field to its enclosing `<form>`, so `formWithField(page,
    'Status').getByRole('button', { name: 'Save' })` can't accidentally
    submit the admin-note form instead. The refund action isn't a form at
    all — it's a button behind a `ConfirmationDialog`, scoped the same way
    as any other dialog confirm (`confirmDialog(page, 'Refund')`).
  - **A fresh, dedicated seeded customer exists per order-editing spec.**
    `E2eSeeder` seeds a separate **"E2E Order Management Customer"**
    (`e2e-order-management@example.com`, with a Pending/Unpaid and a
    Processing/Paid order) distinct from the "E2E Order History Customer"
    used by the read-only order-history spec — the same "add a new,
    distinct fixture rather than repurposing one a *mutating* spec needs"
    rule as `ADDRESS_OWNER`/the cart-checkout customer described in
    "Fixtures" above: a spec that changes an order's status/note/payment
    state would otherwise corrupt the fixed counts another spec depends on.
  - **Any controller method with a type-hinted service dependency is
    resolved via the container on *every* call, even down a code path
    that never ends up using it** (e.g. `CheckoutController::store(...,
    CheckoutSessionCreator $c)` resolves `$c` — and therefore Stripe's
    `StripeClient` singleton — even for a `cod` order that never touches
    Stripe). If that dependency's constructor needs real config
    (`STRIPE_SECRET`, etc.), `.env.e2e` needs *some* non-null placeholder
    value or every checkout in the suite 500s regardless of payment
    method — this is a real footgun for any environment missing that
    config, not just the e2e suite.

## The `setup.ts` test harness

`resources/js/tests/setup.ts` is Vitest's global setup file (wired in via
`vitest.config.ts`) and mocks `@inertiajs/vue3` and `@/i18n` for every test in
the suite. Nothing here needs to be re-mocked per file.

- **`HTMLDialogElement` stub** — a `beforeEach` stubs
  `HTMLDialogElement.prototype.showModal`/`.close` as `vi.fn()`. jsdom has no
  native `<dialog>` support, so any component calling `showModal()`/`close()`
  (`Modal.vue` and everything built on it — `ConfirmationDialog`,
  `EditFormModal`, ...) throws in a test without this stub. `routeMock` is
  also `.mockClear()`-ed here every test, so an individual test file no
  longer needs to do it itself before asserting call counts.
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
