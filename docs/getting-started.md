# Getting Started

Quick setup for a developer environment.

Prerequisites
- PHP 8.5
- Composer
- Node.js & pnpm

Install

1. Install PHP dependencies

```bash
composer install
```

2. Install JS dependencies

```bash
pnpm install
# Run the dev server for assets (Vite)
pnpm run dev
```

Environment
- Copy `.env.example` to `.env` and update database and app URL.
- Run migrations and seed sample data:

```bash
php artisan migrate --seed
```

Running tests

```bash
# PHP tests (Pest via Artisan)
php artisan test --compact

# JS tests (Vitest)
pnpm test
```

Next steps
- Document common troubleshooting steps (Vite manifest errors, permissions).

Useful commands

```bash
# Format changed JS files
pnpm run format

# Fix lint issues
pnpm run lint

# Typecheck the frontend
pnpm run types:check

# Build production assets
pnpm run build

# Serve the Laravel app locally
php artisan serve --host=127.0.0.1 --port=8000

# Recreate DB and seed (local development)
php artisan migrate:fresh --seed
```
