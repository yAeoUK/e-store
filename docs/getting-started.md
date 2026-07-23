# Getting Started

Quick setup for a developer environment.

Prerequisites
- PHP 8.5
- Composer
- Node.js & npm

## Fastest path

The repo already ships one-shot Composer scripts that do the manual steps
below for you (see `composer.json` → `scripts`):

```bash
# First-time setup: installs PHP + JS deps, copies .env, generates the app
# key, runs migrations, and builds frontend assets.
composer setup

# Day-to-day local dev: runs the PHP server, a queue listener, and the Vite
# dev server together (via `concurrently`).
composer dev
```

If you'd rather run each step yourself (e.g. to skip the queue listener, or
to understand what `composer setup` is doing), see the manual steps below.

## Manual setup

1. Install PHP dependencies

```bash
composer install
```

2. Install JS dependencies

```bash
npm install
# Run the dev server for assets (Vite)
npm run dev
```

Environment
- Copy `.env.example` to `.env` and run `php artisan key:generate`.
- The default database is **SQLite** (`DB_CONNECTION=sqlite`) — no separate
  database server to install or configure. `database/database.sqlite` already
  exists and is committed to the repo, so migrations can be run immediately.
- Run migrations and seed sample data (creates a `test@example.com` user via
  `DatabaseSeeder`, plus catalog data via `CatalogSeeder`):

```bash
php artisan migrate --seed
```

Running tests

```bash
# PHP tests (Pest via Artisan)
php artisan test --compact

# JS tests (Vitest)
npx vitest run
```

See [docs/testing.md](testing.md) for conventions and the frontend test
harness.

Next steps
- Document common troubleshooting steps (Vite manifest errors, permissions).

Useful commands

```bash
# Format changed JS files
npm run format

# Fix lint issues
npm run lint

# Typecheck the frontend
npm run types:check

# PHP static analysis (Larastan/PHPStan)
composer types:check

# PHP code style (Pint), whole codebase
composer lint          # fix
composer lint:check    # check only, no changes

# Build production assets
npm run build

# Serve the Laravel app locally (only the web server — prefer `composer dev`
# if you also need the queue listener and Vite running)
php artisan serve --host=127.0.0.1 --port=8000

# Recreate DB and seed (local development)
php artisan migrate:fresh --seed
```
