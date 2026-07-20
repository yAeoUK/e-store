# Testing

How to run tests and testing conventions.

Commands

```bash
php artisan test --compact
pnpm test
```

Frameworks
- PHP: Pest (features & units)
- JS: Vitest for component/unit tests

Guidance
- Use factories for models in tests. See `database/factories`.
- Keep tests deterministic and fast.

Examples

- Run a single PHP test class or method:

```bash
php artisan test --filter=MyFeatureTest
```

- Run a single JS test by name (Vitest):

```bash
pnpm test -- -t "renders heading"
```

- Run tests in watch mode (JS):

```bash
pnpm test -- --watch
```

CI tips

- Run `php artisan test --compact` and `pnpm test -- --reporter=dot` in CI.
