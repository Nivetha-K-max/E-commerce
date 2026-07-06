# TODO

- [x] Verify existing image storage approach (frontend uses `product.imageUrl`; backend saves uploads to `backend/src/main/resources/uploads`).
- [x] Add ability to paste/test image URLs or uploaded images into the product data (admin UI / ProductForm).
- [x] Create/confirm a local folder for images in the project (`frontend/public/images/` — see README inside).
- [x] Update README with instructions: how to paste/attach images, upload them via `/api/upload`, and set `imageUrl` on products.
- [x] Add a seed/sample products script (`seed.js` at project root — run with `node seed.js` while backend is running).
- [x] Add missing JWT dependency to `pom.xml` (jjwt-api/impl/jackson 0.12.6).
- [x] Add `jwt.secret` to `application.properties`.
- [x] Add `OrderController` — place order, my orders, admin list, status update.
- [x] Add `Orders.jsx` page (customer order history).
- [x] Wire `/orders` route in `App.jsx` and add "My Orders" to user dropdown in Navbar.
- [x] Update `seed.js` to replace Jeggings + Shorts with 10 products each (remove 5), and use your pasted Google image URLs for those categories.

