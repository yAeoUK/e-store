# Contributing

Guidelines for contributing to this repository.

Branching and workflow
- Use feature branches: `feature/`, `fix/`, `chore/`.
- Rebase small changes, squash where appropriate.

Code style
- PHP: run `vendor/bin/pint --format` before commits.
- JS: follow existing ESLint/Prettier config.

Formatting and checks
- Run Pint on changed PHP files (project convention):

```bash
vendor/bin/pint --dirty --format agent
```

- Format JS files with Prettier:

```bash
pnpm run format
```

- Lint JS/TS:

```bash
pnpm run lint
pnpm run types:check
```

Pull requests
- Provide a concise description and link related issues.
- Add tests for functional changes.

Checks to run before opening a PR

- Run the test suites:

```bash
php artisan test --compact
pnpm test
```

- Ensure formatting and linting pass (see commands above).

Commit messages
- Use present-tense, brief summaries.

Review
- Run tests locally and ensure formatting checks pass.
