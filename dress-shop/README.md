# U99 Dress Shop — Full-Stack E-Commerce

A production-ready clothing storefront with customer accounts, wishlist, cart, online UPI payment, order history, and an admin dashboard for catalog management.

```
dress-shop/
├── backend/     Spring Boot REST API (Java 17, MySQL, JWT)
└── frontend/    React + Tailwind CSS storefront + admin dashboard
```

---

## Features

### Customer-facing
- **Browse catalog** — filter by category, size, price, in-stock; sort by newest / price / name
- **New Arrivals** — dedicated section for freshly added products
- **Product detail** — image zoom, related products, stock status
- **Wishlist** — save items across sessions (localStorage)
- **Shopping cart** — add, remove, update quantities; persisted in localStorage
- **Checkout** — order summary with free shipping
- **Online payment** — UPI QR code + deep links for GPay, PhonePe, Paytm, BHIM
- **Order placement** — order saved to database after payment confirmation
- **Order history** — view all past orders with live tracking timeline
- **Customer accounts** — register, login, JWT-authenticated sessions

### Admin
- **Admin login** — token-based authentication, separate from customer auth
- **Product management** — add, edit, delete products; bulk in-stock toggle
- **Image upload** — upload product photos (JPG/PNG/WEBP, max 5 MB) or paste a URL
- **Order management** — view all orders, update order status (PENDING → CONFIRMED → SHIPPED → DELIVERED / CANCELLED)

---

## 1. Backend setup (Spring Boot)

**Requirements:** Java 17+, Maven, MySQL.

```bash
cd backend
cp .env.example .env   # fill in your values
```

Set the following environment variables (see `.env.example`):

| Variable | Description |
|---|---|
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_TOKEN` | Long random string — Bearer token for admin API calls |
| `JWT_SECRET` | ≥32-char secret for signing customer JWTs |
| `CORS_ALLOWED_ORIGIN` | Frontend URL (default: `http://localhost:5172`) |

Run:
```bash
./mvnw spring-boot:run
```
API starts on `http://localhost:8080`.

### Key endpoints

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/products` | List products (filterable) | Public |
| GET | `/api/products/new-arrivals` | New arrivals | Public |
| GET | `/api/products/{id}` | Single product | Public |
| POST | `/api/products` | Create product | Admin token |
| PUT | `/api/products/{id}` | Update product | Admin token |
| DELETE | `/api/products/{id}` | Delete product | Admin token |
| POST | `/api/upload` | Upload product image | Admin token |
| POST | `/api/auth/login` | Admin login → token | Public |
| POST | `/api/customer/register` | Customer registration | Public |
| POST | `/api/customer/login` | Customer login → JWT | Public |
| POST | `/api/orders` | Place order | Customer JWT |
| GET | `/api/orders/my` | Customer's order history | Customer JWT |
| GET | `/api/orders` | All orders | Admin token |
| PATCH | `/api/orders/{id}/status` | Update order status | Admin token |

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
VITE_SHOP_NAME=U99
VITE_UPI_ID=your-upi-id@bank
VITE_UPI_NAME=U99 Fashion
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX   # for post-order WhatsApp confirmation nudge
```

Run:
```bash
npm run dev
```
Visit `http://localhost:5172`. Admin panel is at `/admin/login`.

---

## 3. Deploying

### Backend → Render / Railway
1. Push the repo to GitHub.
2. Create a Web Service, set root directory to `backend`.
3. Add a MySQL database and set all environment variables from `.env.example`.
4. Set `server.base-url` to the deployed backend URL (for uploaded image links).
5. Set `CORS_ALLOWED_ORIGIN` to your frontend's deployed URL.

### Frontend → Vercel / Netlify
1. Import the repo, set root directory to `frontend`.
2. Add environment variables from `.env.example` in the dashboard.
3. Set `VITE_API_URL` to your deployed backend URL.

> **Note:** Render's free tier has ephemeral storage — uploaded images are lost on redeploy. For production, use an external URL (paste into admin form) or swap the upload endpoint to S3/Cloudinary.

---

## 4. Adding product images

**Option A — Upload via admin form (recommended for local/paid hosting)**
Open `/admin`, click **+ Add New Product**, fill in details, then choose a JPG/PNG/WEBP file (max 5 MB).

**Option B — Paste a URL**
Paste any public image URL into the "Or paste image URL" field in the admin form.

**Option C — Bundle with frontend**
Drop images into `frontend/public/images/` and use `/images/filename.jpg` as the URL.

---

## 5. Seeding sample products

With the backend running:
```bash
node seed.js
```
Adds one sample product per category so the catalog is immediately populated.
