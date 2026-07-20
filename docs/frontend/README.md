# Frontend Guidelines

Guidance for Inertia + Vue code in `resources/js`.

Contents
- Folder structure overview (`pages`, `components`, `tests`)
- Component conventions and prop validation
- Using Inertia: `Inertia::render`, lazy-loading, and routing
- State management patterns (if any)

Tips
- Add skeletons for deferred props and client-side loading states.

Quick links to source

- Inertia + Vue bootstrap (`createInertiaApp`): [resources/js/app.ts](../resources/js/app.ts#L7-L18)
- Blade layout (Vite + Inertia includes): [resources/views/app.blade.php](../resources/views/app.blade.php#L1-L40)

Pages

- Products index (`applyFilters` handler): [resources/js/pages/Products/Index.vue](../resources/js/pages/Products/Index.vue#L15-L20)
- Product detail (uses `ProductGallery`): [resources/js/pages/Products/Show.vue](../resources/js/pages/Products/Show.vue#L45-L45)

Components

- Catalog layout (category + filters slots): [resources/js/components/shop/CatalogLayout.vue](../resources/js/components/shop/CatalogLayout.vue#L35-L39)
- Product card (image & title): [resources/js/components/shop/ProductCard.vue](../resources/js/components/shop/ProductCard.vue#L31-L31) and [resources/js/components/shop/ProductCard.vue](../resources/js/components/shop/ProductCard.vue#L45-L45)
- Product gallery (`selectedImage` & `images`): [resources/js/components/shop/ProductGallery.vue](../resources/js/components/shop/ProductGallery.vue#L16-L24)
- Product gallery (main image render): [resources/js/components/shop/ProductGallery.vue](../resources/js/components/shop/ProductGallery.vue#L33-L38)
- Product filters (`applyFilters` + form): [resources/js/components/shop/ProductFilters.vue](../resources/js/components/shop/ProductFilters.vue#L20-L27) and [resources/js/components/shop/ProductFilters.vue](../resources/js/components/shop/ProductFilters.vue#L31-L36)
- Category navigation (header and list): [resources/js/components/shop/CategoryNavigation.vue](../resources/js/components/shop/CategoryNavigation.vue#L16-L16) and [resources/js/components/shop/CategoryNavigation.vue](../resources/js/components/shop/CategoryNavigation.vue#L19-L23)

If you prefer different anchors or additional files linked here, tell me which ones and I'll add them.
