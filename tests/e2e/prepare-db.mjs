import { execSync } from 'node:child_process';
import { closeSync, existsSync, openSync } from 'node:fs';

// Playwright starts `webServer` and waits for it to respond before running
// `globalSetup`, so the e2e sqlite DB has to be created, migrated, and
// seeded here - ahead of `artisan serve` - not in globalSetup.
const dbPath = 'database/e2e.sqlite';

if (!existsSync(dbPath)) {
    closeSync(openSync(dbPath, 'w'));
}

execSync('php artisan key:generate --env=e2e --force --ansi', {
    stdio: 'inherit',
});
execSync('php artisan migrate:fresh --env=e2e --force --ansi', {
    stdio: 'inherit',
});
execSync('php artisan db:seed --env=e2e --class=E2eSeeder --force --ansi', {
    stdio: 'inherit',
});
