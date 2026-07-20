# Project Documentation

This `docs/` directory contains the canonical project documentation. Use the files here to onboard contributors, explain architecture, and host reference material.

Contents:
- `getting-started.md` — Local development and quickstart
- `contributing.md` — PR, branch and coding conventions
- `api/` — API reference and OpenAPI artifacts
- `architecture.md` — System overview and DB schema notes
- `frontend/` — Inertia + Vue patterns and frontend guidelines
- `design-system/` — Tailwind tokens and component guidance
- `testing.md` — How to run tests and CI guidance
- `operations.md` — Deployment, env, backups

How to use
- Keep documentation concise and example-driven.
- Link important pages from the project `README.md`.
- Prefer small, focused pages over one large file.

Next steps
- Fill each file with project-specific commands and examples.

Linked resources

The repository already contains the following important files and folders — quick links:

- Project metadata: [composer.json](../composer.json), [package.json](../package.json)
- Environment sample: [.env.example](../.env.example)
- Change log: [CHANGELOG.md](../CHANGELOG.md)
- App bootstrap: [bootstrap/app.php](../bootstrap/app.php)
- Configuration: [config/](../config/)
- Database migrations: [database/migrations/](../database/migrations/)
- Model factories: [database/factories/](../database/factories/)
- Frontend source: [resources/js/](../resources/js/)
- Frontend styles: [resources/css/app.css](../resources/css/app.css)
- Blade layout: [resources/views/app.blade.php](../resources/views/app.blade.php)
- Tests: [tests/](../tests/)

Line-range quick links

- App bootstrap (main configuration): [bootstrap/app.php](bootstrap/app.php#L1-L30)
- Frontend entry (Inertia bootstrap): [resources/js/app.ts](resources/js/app.ts#L1-L40)
- Blade layout (Inertia/Vite includes): [resources/views/app.blade.php](resources/views/app.blade.php#L1-L40)
- Products migration (schema): [database/migrations/2026_07_19_000001_create_products_table.php](database/migrations/2026_07_19_000001_create_products_table.php#L1-L60)
- Environment sample top (important vars): [.env.example](.env.example#L1-L30)
- Package scripts and deps: [package.json](package.json#L1-L120)

If you want, I can add more specific links (line ranges) into individual docs pages or generate an index page per area.
