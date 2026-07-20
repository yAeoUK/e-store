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

# Install JS deps and build assets
pnpm install --production
pnpm run build

# Run database migrations in production
php artisan migrate --force

# Cache config, routes and views
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage symlink (if needed)
php artisan storage:link

# Restart queue workers after deploy
php artisan queue:restart
```

Rollback / maintenance notes

- Use `php artisan down` / `php artisan up` for maintenance windows.
