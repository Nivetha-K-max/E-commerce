# Master Prompt: Boutique Dress Shop Website (Catalog + WhatsApp Ordering)

Use this prompt if you want to regenerate, extend, or rebuild this project
from scratch in a future Claude conversation.

---

## Prompt

Build a full-stack website for a local dress/clothing retail shop that
currently manages all orders manually over WhatsApp (typing prices,
screenshotting stock photos, confirming orders one by one). The goal is to
replace the manual catalog/broadcast work with a real website, while
keeping WhatsApp as the actual ordering and fulfillment channel (the shop
owner is comfortable with WhatsApp and shouldn't have to change that part).

**Tech stack:**
- Frontend: React (Vite) + Tailwind CSS, hosted free on Vercel/Netlify
- Backend: Spring Boot (Java 17, Maven) + MySQL, hosted free on Render/Railway
- No payment gateway, no order database — orders are placed via `wa.me`
  pre-filled WhatsApp links, keeping WhatsApp as the source of truth for
  fulfillment

**Product data model:**
- name, price, imageUrl, category, inStock (boolean), isNewArrival (boolean),
  description (optional), createdAt

**Fixed category list (shop's real collections, used everywhere — filter
chips, admin dropdown — instead of free text, to avoid typos/duplicates):**
Kurtis Set, Palazzo Pant, Jeggings, Leggings, Western Top, Maxi, Party Wear,
Skirts, Night Suit, Night Pants, Shorts, T Shirt, Crop T Shirt

**Public site requirements:**
- Hero section introducing the shop
- "New Arrivals" section (products flagged `isNewArrival`)
- Full catalog grid, filterable by category (chips, horizontally scrollable
  on mobile since there are 13+ categories)
- Each product card: photo, name, category, price, "Order on WhatsApp"
  button that opens WhatsApp with a pre-filled message naming the product
  and price; out-of-stock products show a disabled state instead of the
  order button
- Loading state uses skeleton cards (not spinner text)
- Empty/error states are calm and give the customer a fallback (a general
  WhatsApp inquiry link)

**Admin requirements:**
- Password-protected admin page (single shop-owner account, not multi-user)
- Add/edit/delete products
- Upload a product photo (stored on the backend's local disk, served
  statically — no third-party image CDN needed for MVP)
- Category is a dropdown (not free text) sourced from the fixed list above
- Toggle in-stock / new-arrival per product

**Backend requirements:**
- REST API: public GET endpoints for catalog + new arrivals, admin-only
  POST/PUT/DELETE (protected by a simple bearer token issued on login —
  no need for full Spring Security/JWT complexity for a single admin user)
- Image upload endpoint (validates file type + 5MB size limit)
- CORS configured for the frontend's origin
- Clean validation error responses (400 with field-level messages)

**Design direction:**
- Boutique/textile-inspired palette: ivory background, charcoal text,
  saffron gold + deep teal + maroon accents — avoid the generic
  cream-background + terracotta-accent look and avoid numbered-step
  clichés unless the content is actually sequential
- Display serif (Fraunces) for headings, clean sans (Work Sans) for body
- One restrained signature motif tying back to the shop's world (a
  thread/weave-style SVG divider between sections; a folded-corner "New"
  tag on product cards, like a fabric swatch label)
- Fully responsive down to mobile, visible keyboard focus states,
  `prefers-reduced-motion` respected

**Deliverable format:** a downloadable zip containing `backend/` and
`frontend/` as separate buildable projects, plus a README covering local
setup, environment variables, and deployment steps for Render/Railway +
Vercel/Netlify.

---

## Notes for extending this project later

- To add real payments: introduce an `Order` entity + Razorpay/Stripe
  integration as a v2 — don't retrofit it into the WhatsApp-link flow,
  keep both paths available since not every customer wants to pay online.
- To add customer accounts/order history: would need real auth (JWT) to
  replace the current single-admin-token approach.
- To scale image handling: swap local disk storage for Cloudinary or S3 if
  the shop's product catalog grows large or the backend host has ephemeral
  storage (Render's free tier disk is NOT persistent across deploys — keep
  this in mind before going live long-term).
