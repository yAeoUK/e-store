# API Reference

**This project does not have a JSON/REST API.** There is no `routes/api.php`,
no API controllers, and no OpenAPI spec to generate — every route in
`routes/web.php` and `routes/auth.php` returns either an Inertia page response
(server-rendered Vue, not JSON for a decoupled client) or a redirect. If a
generic "API reference" folder was expected here from a different project
template, it doesn't apply to this codebase; don't add an OpenAPI spec unless
a real JSON API is actually introduced.

Where to look instead:

- **Route list**: `php artisan route:list` (or filter with `--path=`,
  `--name=`) is the source of truth for what endpoints exist.
- **Request/response shapes**: each Inertia page's props are defined at the
  `Inertia::render('Page/Name', [...])` call site in the corresponding
  controller (e.g. `app/Http/Controllers/ProductController.php`,
  `app/Http/Controllers/Account/AddressController.php`) — there's no separate
  schema to keep in sync.
- **Behavior/contracts**: the `tests/Feature/` Pest tests exercise every
  route's request validation and response shape and are the most reliable,
  currently-accurate reference for how an endpoint behaves — see
  [docs/testing.md](../testing.md).

If this project ever grows a real API (e.g. a mobile client or third-party
integration needing JSON), that's when `routes/api.php`, API Resources, and an
OpenAPI spec would become relevant — see the "APIs & Eloquent Resources"
guidance in `AGENTS.md` for the convention to follow at that point.
