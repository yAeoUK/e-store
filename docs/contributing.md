# Contributing

Guidelines for contributing to this repository.

Branching and workflow
- Use feature branches: `feature/`, `fix/`, `chore/`.
- Rebase small changes, squash where appropriate.

Code style
- PHP: format with Pint, and keep static analysis (Larastan/PHPStan) clean —
  see commands below.
- JS: follow existing ESLint/Prettier config.
- Reuse the shared component library (`resources/js/components/*.vue`) and the
  class tokens in `classNames.ts` instead of writing new raw markup or
  repeating Tailwind class strings — see [docs/design-system/README.md](design-system/README.md).

Formatting and checks

- PHP style (Pint) — two ways to run it depending on context:

```bash
# AI-agent / editing-session convention: only touches files you've changed
vendor/bin/pint --dirty --format agent

# Whole-codebase, via the project's own Composer scripts
composer lint          # fix
composer lint:check    # check only, no changes (used in CI)
```

- PHP static analysis (Larastan/PHPStan) — not run by `pint`, easy to miss:

```bash
composer types:check
```

- Format JS files with Prettier:

```bash
npm run format
npm run format:check   # check only, no changes
```

- Lint/typecheck JS/TS:

```bash
npm run lint
npm run types:check
```

Pull requests
- Provide a concise description and link related issues.
- Add tests for functional changes.

Checks to run before opening a PR

The repo's own aggregate scripts are the quickest way to run everything at
once:

```bash
composer test       # config:clear, pint --test, phpstan, php artisan test
composer ci:check    # the above, plus npm run lint:check/format:check/types:check
```

**`composer ci:check` does not run the frontend test suite** — it covers JS
lint/format/types but not Vitest. Run that separately:

```bash
npx vitest run
```

So a full pre-PR check is:

```bash
composer ci:check
npx vitest run
```

`composer ci:check` passes cleanly end-to-end as of the TypeScript
migration/PHPStan cleanup pass (every `.vue` file is `lang="ts"`, every
Eloquent relation has generic PHPDoc, PHPStan runs at
`--memory-limit=1G` — see [docs/architecture.md](architecture.md) for why).
Treat any failure here as a real regression to fix, not more pre-existing
debt to file away — there isn't any left.

Commit messages
- Use present-tense, brief summaries.

Review
- Run tests locally and ensure formatting/static-analysis checks pass.
