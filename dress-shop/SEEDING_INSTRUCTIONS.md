# Seeding / Updating Products (Jeggings + Shorts)

This repo has a `seed.js` that seeds **195 products (15 per category)** into the running backend.

## What you asked to do
- Update products for categories:
  - **Jeggings**
  - **Shorts**
- Use the Google image URLs you pasted.
- Remove **5 products** from those categories (so only 10 products remain) before re-seeding.

## How to proceed
1. Stop any running seed scripts.
2. Ensure backend is running locally:
   - `http://localhost:8080`
3. Delete existing seeded products for affected categories (optional but recommended):
   - easiest: manually delete from DB, OR add a dedicated delete/cleanup script (not included yet).
4. Run the updated seed script:
   - `node seed.js`

## Note
The current `seed.js` in this repo still uses a single placeholder image per category.
You need a code update to:
- replace `CATEGORY_IMAGES` + per-product image assignment for Jeggings and Shorts
- implement “remove 5 products” for those categories.

