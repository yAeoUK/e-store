# Operations

Deployment and environment operations notes.

Sections
- Deployment steps (recommended: `composer run build`, `php artisan migrate`)
- Environment variables and secure storage
- Backups and database migrations
- Monitoring and logs (where to find `storage/logs`)

Deployment and build commands

```bash
# Install PHP deps on the server
composer install --no-dev --optimize-autoloader

# Install JS deps and build assets — do NOT use --omit=dev here: the build
# tooling (vite, vue-tsc, etc.) lives in devDependencies, so a dev-inclusive
# install is required for `npm run build` to work at all.
npm install
npm run build
# Optional: shrink node_modules afterward if it ships to the server
npm prune --omit=dev

# Run database migrations in production
php artisan migrate --force

# Cache config, routes and views
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage symlink (if needed) — not currently needed: nothing in this
# app uses the Storage facade or serves uploaded files yet. Keep this step
# ready for whenever a feature adds file uploads.
php artisan storage:link

# Restart queue workers after deploy
php artisan queue:restart
```

`QUEUE_CONNECTION=database` by default and local dev runs a queue listener via
`composer dev`, but there's no queue worker supervision (Supervisor/systemd
unit, etc.) documented or configured anywhere in this repo. If a feature ever
dispatches a queued job/notification in production, a persistent worker
process needs to be set up before `queue:restart` above means anything.

Rollback / maintenance notes

- Use `php artisan down` / `php artisan up` for maintenance windows.
