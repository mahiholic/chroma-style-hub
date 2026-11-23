# Dynamic Category Management and Product Sections

## Goal
Allow admins to create and manage categories, assign products to one category, and let customers browse each category without unrelated products appearing.

## User-facing changes
- Add an admin **Manage Categories** page with add, edit, activate/deactivate, image upload, and safe deletion. Categories with products cannot be deleted until those products are reassigned.
- Update product management to use the live category list and support multiple product images, sizes, colors, and stock status.
- Make the storefront category strip and category pages read active categories and show only products assigned to the selected category. Keep existing Men, Women, and Accessories entry points working.
- Show category imagery and product image galleries on the relevant customer pages.

## Data and access
- Add a `categories` table with unique slugs, optional images, and active status; add a restricted category relationship plus image, size, and color arrays to products.
- Seed categories matching the existing Men, Women, and Accessories data and backfill existing products without removing the legacy category field.
- Allow public reads of active categories and active products; restrict category changes and product management to admins. Prevent category deletion while products reference it.

## Validation
- Add a focused test that proves category results contain only products assigned to the selected category.
- Verify admin category/product screens, category image and product image uploads, and customer category browsing at desktop and mobile sizes.