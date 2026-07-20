# Architecture

High-level overview of the system.

Sections to include
- System diagram (services, third-party integrations)
- Database schema overview and important tables
- Migrations and seeding strategy
- Key domain models and relationships

Include ER diagrams or links to generated diagrams where possible.

Source links

Below are direct links to migrations and model definitions referenced in this document. Use these links to quickly inspect table structure and model relationships.

- Categories migration: [database/migrations/2026_07_19_000000_create_categories_table.php](database/migrations/2026_07_19_000000_create_categories_table.php#L1-L60)
- Products migration: [database/migrations/2026_07_19_000001_create_products_table.php](database/migrations/2026_07_19_000001_create_products_table.php#L1-L60)
- Product images migration: [database/migrations/2026_07_19_000002_create_product_images_table.php](database/migrations/2026_07_19_000002_create_product_images_table.php#L1-L60)
- Product variants migration: [database/migrations/2026_07_19_000003_create_product_variants_table.php](database/migrations/2026_07_19_000003_create_product_variants_table.php#L1-L80)

Models

- Category model: [app/Models/Category.php](app/Models/Category.php#L1-L120)
- Product model: [app/Models/Product.php](app/Models/Product.php#L1-L200)
- ProductImage model: [app/Models/ProductImage.php](app/Models/ProductImage.php#L1-L120)
- ProductVariant model: [app/Models/ProductVariant.php](app/Models/ProductVariant.php#L1-L160)

If you'd like, I can add inline references from sections above to the exact line ranges that show relationships or important fields.

Inline schema references

Products

- `category_id` column (foreign key) in the products migration: [database/migrations/2026_07_19_000001_create_products_table.php](database/migrations/2026_07_19_000001_create_products_table.php#L1-L60)
- `category()` relation on the `Product` model: [app/Models/Product.php](app/Models/Product.php#L1-L200)
- Images and primary image relations: [app/Models/Product.php](app/Models/Product.php#L1-L200) (see `images()` and `primaryImage()`)
- Variants relation and `sku`/`options` fields: [app/Models/ProductVariant.php](app/Models/ProductVariant.php#L1-L160) and [database/migrations/2026_07_19_000003_create_product_variants_table.php](database/migrations/2026_07_19_000003_create_product_variants_table.php#L1-L80)

Categories

- Categories table definition (parent/child relation): [database/migrations/2026_07_19_000000_create_categories_table.php](database/migrations/2026_07_19_000000_create_categories_table.php#L1-L60)
- `parent()` / `children()` relations on the `Category` model: [app/Models/Category.php](app/Models/Category.php#L1-L120)

Images

- Product images table and fields: [database/migrations/2026_07_19_000002_create_product_images_table.php](database/migrations/2026_07_19_000002_create_product_images_table.php#L1-L60)
- `ProductImage` model and `product()` relation: [app/Models/ProductImage.php](app/Models/ProductImage.php#L1-L120)
