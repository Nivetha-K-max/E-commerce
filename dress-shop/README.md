# Dress Shop Website — Catalog + WhatsApp Ordering

A simple storefront for a retail shop: customers browse products and new
arrivals, then order directly on WhatsApp. The shop owner manages products
through a password-protected admin page — no more typing prices or
screenshotting stock into individual chats.

## What's inside

```
dress-shop/
├── backend/     Spring Boot API (products, image uploads, admin login)
└── frontend/    React + Tailwind storefront + admin dashboard
```

## How it works

- **Customers** see the catalog and a "New Arrivals" section. Tapping
  "Order on WhatsApp" opens WhatsApp with a pre-filled message naming the
  product and price — no backend order system needed, WhatsApp stays the
  fulfillment channel the shop is already used to.
- **Shop owner** logs into `/admin`, adds a product (name, price, category,
  photo, in-stock/new-arrival toggles) in under a minute, and it's live on
  the site immediately.

---

## 1. Backend setup (Spring Boot)

**Requirements:** Java 17+, Maven, MySQL running locally (or a cloud MySQL instance).

```bash
cd backend
```

1. Create a MySQL database (or let the app create it — see `application.properties`).
2. Open `src/main/resources/application.properties` and update:
   - `spring.datasource.username` / `password` — your MySQL credentials
   - `admin.username` / `admin.password` — the shop owner's admin login
   - `admin.token` — replace with any long random string (this secures admin actions)
   - `cors.allowed-origin` — your frontend URL (`http://localhost:5172` for local dev)
3. Run it:
   ```bash
   ./mvnw spring-boot:run
   ```
   The API starts on `http://localhost:8080`.

**Key endpoints:**
| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/products` | All products (optional `?category=`) | Public |
| GET | `/api/products/new-arrivals` | New arrivals only | Public |
| POST | `/api/products` | Create product | Admin token |
| PUT | `/api/products/{id}` | Update product | Admin token |
| DELETE | `/api/products/{id}` | Delete product | Admin token |
| POST | `/api/upload` | Upload a product photo | Admin token |
| POST | `/api/auth/login` | Get admin token | Public (checked against username/password) |

---

## 2. Frontend setup (React)

**Requirements:** Node.js 18+.

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8080/api
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX     # shop owner's number, country code, no + or spaces
VITE_SHOP_NAME=U99
```

Run it locally:
```bash
npm run dev
```
Visit `http://localhost:5172`. Admin login is at `http://localhost:5172/admin/login`
(use the `admin.username` / `admin.password` you set in the backend).

---

## 3. Deploying (free tiers)

**Backend → Render or Railway**
1. Push the `backend/` folder to a GitHub repo (or the whole project — Render lets you set a root directory).
2. Create a new Web Service, point it at the repo, root directory `backend`.
3. Add a MySQL database (Render/Railway both offer one-click MySQL) and copy its connection details into environment variables that match `application.properties` (or edit the file directly before deploying).
4. Set `server.base-url` to the deployed backend's public URL once you have it, and redeploy — this is what makes uploaded image links work correctly.
5. Set `cors.allowed-origin` to your frontend's deployed URL.

**Frontend → Vercel or Netlify**
1. Push `frontend/` to GitHub (or same repo, set root directory to `frontend`).
2. Import the project in Vercel/Netlify.
3. Set the same environment variables from `.env` in their dashboard (`VITE_API_URL` should point to your deployed backend, e.g. `https://your-backend.onrender.com/api`).
4. Deploy. You'll get a free `.vercel.app` or `.netlify.app` URL (or connect a custom domain later).

---

## 4. Handing this off to the shop owner

Once deployed, all they need is:
1. The website link (share on WhatsApp/Instagram).
2. Their admin login (`/admin/login`) to add new stock — takes about a minute per item.
3. Their own WhatsApp number is already wired into every "Order" button, so orders land exactly where they already check.

## Notes on scope

This is intentionally an MVP: no payments, no order tracking, no customer
accounts — WhatsApp remains the ordering and fulfillment layer, which is
what the shop already trusts. Payments/inventory/order-history can be added
later as a v2 once the shop owner sees value from this version.

---

## 5. Adding product images

**Option A — Upload via admin form (recommended)**
1. Open the admin dashboard (`/admin`).
2. Click **+ Add New Product**, fill in the details, then click **Choose File** and pick a JPG/PNG/WEBP (max 5 MB).
3. The image is uploaded to `backend/src/main/resources/uploads/` and the URL is auto-filled.

**Option B — Paste a URL**
In the admin form, paste any public image URL (e.g. from your own hosting or a CDN) into the "Or paste image URL" field.

**Option C — Local images in the repo**
Drop photos into `frontend/public/images/` and use `/images/filename.jpg` as the image URL in the admin form.
These are served directly by the Vite dev server (and by Vercel/Netlify in production).

> **Deployment note:** Render's free tier has ephemeral storage — files uploaded to the backend are lost on redeploy.
> For production, use Option B (external URL) or Option C (bundled with frontend), or swap the upload endpoint to S3/Cloudinary.

---

## 6. Seeding sample products

With the backend running, from the project root:
```bash
node seed.js
```
This adds one sample product per category so you can see the catalog immediately.
