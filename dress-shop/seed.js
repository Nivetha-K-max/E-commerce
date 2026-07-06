#!/usr/bin/env node
/**
 * Seed script — adds 195 sample products (15 per category) to the running backend.
 * Product names and categories sourced from Fashion_Google_Image_Search_Links_195.xlsx
 *
 * Usage:
 *   node seed.js
 *
 * Requires the backend running on http://localhost:8080
 */

const API = 'http://localhost:8080/api'
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin123'

// One representative Unsplash image per category (same as categoryImages.js)
const CATEGORY_IMAGES = {
  'Kurtis Set':   'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80',
  'Palazzo Pant': 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=400&q=80',
  'Jeggings':     'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80',
  'Leggings':     'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80',
  'Western Top':  'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&q=80',
  'Maxi':         'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
  'Party Wear':   'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80',
  'Skirts':       'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80',
  'Night Suit':   'https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=400&q=80',
  'Night Pants':  'https://images.unsplash.com/photo-1617952236317-0bd127407984?w=400&q=80',
  'Shorts':       'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80',
  'T Shirt':      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  'Crop T Shirt': 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80',
}

// 195 products — names derived from search terms in the xlsx, prices randomised per category
const PRODUCTS = [
  // Kurtis Set (rows 1-15)
  { name: 'Cotton Kurtis Set', category: 'Kurtis Set', price: 699 },
  { name: 'Printed Kurtis Set', category: 'Kurtis Set', price: 749 },
  { name: 'Embroidered Kurtis Set', category: 'Kurtis Set', price: 999 },
  { name: 'Anarkali Kurtis Set', category: 'Kurtis Set', price: 1099 },
  { name: 'Straight Kurtis Set', category: 'Kurtis Set', price: 799 },
  { name: 'Office Wear Kurtis Set', category: 'Kurtis Set', price: 849 },
  { name: 'Floral Kurtis Set', category: 'Kurtis Set', price: 749 },
  { name: 'Designer Kurtis Set', category: 'Kurtis Set', price: 1299 },
  { name: 'Rayon Kurtis Set', category: 'Kurtis Set', price: 699 },
  { name: 'Linen Kurtis Set', category: 'Kurtis Set', price: 899 },
  { name: 'Ethnic Kurtis Set', category: 'Kurtis Set', price: 949 },
  { name: 'Festival Kurtis Set', category: 'Kurtis Set', price: 1099 },
  { name: 'Summer Kurtis Set', category: 'Kurtis Set', price: 649 },
  { name: 'Chikankari Kurtis Set', category: 'Kurtis Set', price: 1199 },
  { name: 'Plus Size Kurtis Set', category: 'Kurtis Set', price: 799 },

  // Palazzo Pant (rows 16-30)
  { name: 'Cotton Palazzo Pant', category: 'Palazzo Pant', price: 449 },
  { name: 'Printed Palazzo Pant', category: 'Palazzo Pant', price: 499 },
  { name: 'Black Palazzo Pant', category: 'Palazzo Pant', price: 399 },
  { name: 'White Palazzo Pant', category: 'Palazzo Pant', price: 399 },
  { name: 'Linen Palazzo Pant', category: 'Palazzo Pant', price: 549 },
  { name: 'Wide Leg Palazzo Pant', category: 'Palazzo Pant', price: 499 },
  { name: 'High Waist Palazzo Pant', category: 'Palazzo Pant', price: 549 },
  { name: 'Ethnic Palazzo Pant', category: 'Palazzo Pant', price: 599 },
  { name: 'Casual Palazzo Pant', category: 'Palazzo Pant', price: 399 },
  { name: 'Office Palazzo Pant', category: 'Palazzo Pant', price: 499 },
  { name: 'Floral Palazzo Pant', category: 'Palazzo Pant', price: 449 },
  { name: 'Designer Palazzo Pant', category: 'Palazzo Pant', price: 699 },
  { name: 'Summer Palazzo Pant', category: 'Palazzo Pant', price: 399 },
  { name: 'Solid Palazzo Pant', category: 'Palazzo Pant', price: 349 },
  { name: 'Party Palazzo Pant', category: 'Palazzo Pant', price: 599 },

  // Jeggings (rows 31-45)
  { name: 'Black Jeggings', category: 'Jeggings', price: 349 },
  { name: 'Blue Jeggings', category: 'Jeggings', price: 349 },
  { name: 'High Waist Jeggings', category: 'Jeggings', price: 399 },
  { name: 'Stretch Jeggings', category: 'Jeggings', price: 349 },
  { name: 'Ankle Jeggings', category: 'Jeggings', price: 329 },
  { name: 'Plus Size Jeggings', category: 'Jeggings', price: 399 },
  { name: 'Casual Jeggings', category: 'Jeggings', price: 299 },
  { name: 'Skinny Jeggings', category: 'Jeggings', price: 349 },
  { name: 'Denim Look Jeggings', category: 'Jeggings', price: 399 },
  { name: 'Cotton Jeggings', category: 'Jeggings', price: 299 },
  { name: 'White Jeggings', category: 'Jeggings', price: 349 },
  { name: 'Grey Jeggings', category: 'Jeggings', price: 349 },
  { name: 'Office Jeggings', category: 'Jeggings', price: 399 },
  { name: 'Fashion Jeggings', category: 'Jeggings', price: 449 },
  { name: 'Women Jeggings', category: 'Jeggings', price: 299 },

  // Leggings (rows 46-60)
  { name: 'Cotton Leggings', category: 'Leggings', price: 249 },
  { name: 'Black Leggings', category: 'Leggings', price: 249 },
  { name: 'White Leggings', category: 'Leggings', price: 249 },
  { name: 'Ankle Leggings', category: 'Leggings', price: 229 },
  { name: 'Full Length Leggings', category: 'Leggings', price: 269 },
  { name: 'Printed Leggings', category: 'Leggings', price: 299 },
  { name: 'High Waist Leggings', category: 'Leggings', price: 299 },
  { name: 'Gym Leggings', category: 'Leggings', price: 349 },
  { name: 'Casual Leggings', category: 'Leggings', price: 229 },
  { name: 'Ethnic Leggings', category: 'Leggings', price: 279 },
  { name: 'Plus Size Leggings', category: 'Leggings', price: 299 },
  { name: 'Grey Leggings', category: 'Leggings', price: 249 },
  { name: 'Maroon Leggings', category: 'Leggings', price: 249 },
  { name: 'Navy Leggings', category: 'Leggings', price: 249 },
  { name: 'Stretch Leggings', category: 'Leggings', price: 269 },

  // Western Top (rows 61-75)
  { name: 'Casual Western Top', category: 'Western Top', price: 399 },
  { name: 'Printed Western Top', category: 'Western Top', price: 449 },
  { name: 'Floral Western Top', category: 'Western Top', price: 449 },
  { name: 'Solid Western Top', category: 'Western Top', price: 349 },
  { name: 'Crop Western Top', category: 'Western Top', price: 399 },
  { name: 'Full Sleeve Western Top', category: 'Western Top', price: 499 },
  { name: 'Party Western Top', category: 'Western Top', price: 599 },
  { name: 'Office Western Top', category: 'Western Top', price: 549 },
  { name: 'Ruffle Western Top', category: 'Western Top', price: 499 },
  { name: 'Peplum Western Top', category: 'Western Top', price: 549 },
  { name: 'Black Western Top', category: 'Western Top', price: 349 },
  { name: 'White Western Top', category: 'Western Top', price: 349 },
  { name: 'Summer Western Top', category: 'Western Top', price: 399 },
  { name: 'Trendy Western Top', category: 'Western Top', price: 499 },
  { name: 'Designer Western Top', category: 'Western Top', price: 699 },

  // Maxi (rows 76-90)
  { name: 'Floral Maxi Dress', category: 'Maxi', price: 799 },
  { name: 'Black Maxi Dress', category: 'Maxi', price: 749 },
  { name: 'Party Maxi Dress', category: 'Maxi', price: 999 },
  { name: 'Cotton Maxi Dress', category: 'Maxi', price: 699 },
  { name: 'Printed Maxi Dress', category: 'Maxi', price: 749 },
  { name: 'Sleeveless Maxi', category: 'Maxi', price: 699 },
  { name: 'Full Sleeve Maxi', category: 'Maxi', price: 799 },
  { name: 'Boho Maxi', category: 'Maxi', price: 899 },
  { name: 'Summer Maxi', category: 'Maxi', price: 649 },
  { name: 'Designer Maxi', category: 'Maxi', price: 1199 },
  { name: 'Red Maxi Dress', category: 'Maxi', price: 849 },
  { name: 'Blue Maxi Dress', category: 'Maxi', price: 799 },
  { name: 'Casual Maxi', category: 'Maxi', price: 649 },
  { name: 'Long Maxi Dress', category: 'Maxi', price: 749 },
  { name: 'Wrap Maxi Dress', category: 'Maxi', price: 849 },

  // Party Wear (rows 91-105)
  { name: 'Gown Party Wear', category: 'Party Wear', price: 1499 },
  { name: 'Sequin Party Wear Dress', category: 'Party Wear', price: 1699 },
  { name: 'Cocktail Party Wear Dress', category: 'Party Wear', price: 1299 },
  { name: 'Black Party Wear Dress', category: 'Party Wear', price: 1199 },
  { name: 'Red Party Wear Dress', category: 'Party Wear', price: 1299 },
  { name: 'Designer Party Wear', category: 'Party Wear', price: 1999 },
  { name: 'Western Party Wear', category: 'Party Wear', price: 1099 },
  { name: 'Long Gown Party Wear', category: 'Party Wear', price: 1799 },
  { name: 'Short Party Wear Dress', category: 'Party Wear', price: 999 },
  { name: 'Evening Party Wear Dress', category: 'Party Wear', price: 1399 },
  { name: 'Floral Party Wear', category: 'Party Wear', price: 1099 },
  { name: 'Net Party Wear Dress', category: 'Party Wear', price: 1299 },
  { name: 'Wedding Guest Party Wear', category: 'Party Wear', price: 1599 },
  { name: 'Stylish Party Wear', category: 'Party Wear', price: 1199 },
  { name: 'Women Party Wear', category: 'Party Wear', price: 999 },

  // Skirts (rows 106-120)
  { name: 'Mini Skirt', category: 'Skirts', price: 449 },
  { name: 'Midi Skirt', category: 'Skirts', price: 499 },
  { name: 'Maxi Skirt', category: 'Skirts', price: 599 },
  { name: 'Pleated Skirt', category: 'Skirts', price: 549 },
  { name: 'Denim Skirt', category: 'Skirts', price: 499 },
  { name: 'Black Skirt', category: 'Skirts', price: 399 },
  { name: 'Floral Skirt', category: 'Skirts', price: 499 },
  { name: 'Pencil Skirt', category: 'Skirts', price: 549 },
  { name: 'A-Line Skirt', category: 'Skirts', price: 499 },
  { name: 'Cotton Skirt', category: 'Skirts', price: 399 },
  { name: 'Printed Skirt', category: 'Skirts', price: 449 },
  { name: 'Long Skirt', category: 'Skirts', price: 599 },
  { name: 'Casual Skirt', category: 'Skirts', price: 349 },
  { name: 'Party Skirt', category: 'Skirts', price: 649 },
  { name: 'High Waist Skirt', category: 'Skirts', price: 549 },

  // Night Suit (rows 121-135)
  { name: 'Cotton Night Suit', category: 'Night Suit', price: 499 },
  { name: 'Printed Night Suit', category: 'Night Suit', price: 549 },
  { name: 'Satin Night Suit', category: 'Night Suit', price: 699 },
  { name: 'Shorts Set Night Suit', category: 'Night Suit', price: 549 },
  { name: 'Full Sleeve Night Suit', category: 'Night Suit', price: 599 },
  { name: 'Summer Night Suit', category: 'Night Suit', price: 449 },
  { name: 'Winter Night Suit', category: 'Night Suit', price: 699 },
  { name: 'Cute Night Suit', category: 'Night Suit', price: 499 },
  { name: 'Women Night Suit', category: 'Night Suit', price: 499 },
  { name: 'Floral Night Suit', category: 'Night Suit', price: 549 },
  { name: 'Button Night Suit', category: 'Night Suit', price: 599 },
  { name: 'Soft Night Suit', category: 'Night Suit', price: 449 },
  { name: 'Plus Size Night Suit', category: 'Night Suit', price: 599 },
  { name: 'Pajama Night Suit', category: 'Night Suit', price: 499 },
  { name: 'Designer Night Suit', category: 'Night Suit', price: 799 },

  // Night Pants (rows 136-150)
  { name: 'Cotton Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Printed Night Pants', category: 'Night Pants', price: 329 },
  { name: 'Check Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Soft Night Pants', category: 'Night Pants', price: 279 },
  { name: 'Women Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Pajama Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Black Night Pants', category: 'Night Pants', price: 279 },
  { name: 'Grey Night Pants', category: 'Night Pants', price: 279 },
  { name: 'Floral Night Pants', category: 'Night Pants', price: 329 },
  { name: 'Wide Leg Night Pants', category: 'Night Pants', price: 349 },
  { name: 'Summer Night Pants', category: 'Night Pants', price: 279 },
  { name: 'Winter Night Pants', category: 'Night Pants', price: 349 },
  { name: 'Stretch Night Pants', category: 'Night Pants', price: 299 },
  { name: 'Casual Night Pants', category: 'Night Pants', price: 269 },
  { name: 'Comfortable Night Pants', category: 'Night Pants', price: 299 },

  // Shorts (rows 151-165)
  { name: 'Denim Shorts', category: 'Shorts', price: 449 },
  { name: 'Cotton Shorts', category: 'Shorts', price: 349 },
  { name: 'Black Shorts', category: 'Shorts', price: 349 },
  { name: 'High Waist Shorts', category: 'Shorts', price: 399 },
  { name: 'Gym Shorts', category: 'Shorts', price: 299 },
  { name: 'Casual Shorts', category: 'Shorts', price: 299 },
  { name: 'Printed Shorts', category: 'Shorts', price: 349 },
  { name: 'Summer Shorts', category: 'Shorts', price: 299 },
  { name: 'Running Shorts', category: 'Shorts', price: 349 },
  { name: 'White Shorts', category: 'Shorts', price: 349 },
  { name: 'Blue Shorts', category: 'Shorts', price: 349 },
  { name: 'Cargo Shorts', category: 'Shorts', price: 499 },
  { name: 'Fashion Shorts', category: 'Shorts', price: 449 },
  { name: 'Women Shorts', category: 'Shorts', price: 299 },
  { name: 'Sports Shorts', category: 'Shorts', price: 349 },

  // T Shirt (rows 166-180)
  { name: 'Oversized T-Shirt', category: 'T Shirt', price: 349 },
  { name: 'Graphic T-Shirt', category: 'T Shirt', price: 399 },
  { name: 'Printed T-Shirt', category: 'T Shirt', price: 349 },
  { name: 'Black T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'White T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'Cotton T-Shirt', category: 'T Shirt', price: 279 },
  { name: 'Casual T-Shirt', category: 'T Shirt', price: 279 },
  { name: 'Round Neck T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'V-Neck T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'Striped T-Shirt', category: 'T Shirt', price: 349 },
  { name: 'Plain T-Shirt', category: 'T Shirt', price: 249 },
  { name: 'Full Sleeve T-Shirt', category: 'T Shirt', price: 349 },
  { name: 'Half Sleeve T-Shirt', category: 'T Shirt', price: 299 },
  { name: 'Trendy T-Shirt', category: 'T Shirt', price: 399 },
  { name: 'Women T-Shirt', category: 'T Shirt', price: 279 },

  // Crop T Shirt (rows 181-195)
  { name: 'Oversized Crop T-Shirt', category: 'Crop T Shirt', price: 349 },
  { name: 'Graphic Crop T-Shirt', category: 'Crop T Shirt', price: 399 },
  { name: 'Printed Crop T-Shirt', category: 'Crop T Shirt', price: 349 },
  { name: 'Black Crop T-Shirt', category: 'Crop T Shirt', price: 299 },
  { name: 'White Crop T-Shirt', category: 'Crop T Shirt', price: 299 },
  { name: 'Cotton Crop T-Shirt', category: 'Crop T Shirt', price: 279 },
  { name: 'Casual Crop T-Shirt', category: 'Crop T Shirt', price: 279 },
  { name: 'Ribbed Crop T-Shirt', category: 'Crop T Shirt', price: 329 },
  { name: 'Full Sleeve Crop T-Shirt', category: 'Crop T Shirt', price: 349 },
  { name: 'Half Sleeve Crop T-Shirt', category: 'Crop T Shirt', price: 299 },
  { name: 'Striped Crop T-Shirt', category: 'Crop T Shirt', price: 349 },
  { name: 'Anime Crop T-Shirt', category: 'Crop T Shirt', price: 399 },
  { name: 'Gym Crop T-Shirt', category: 'Crop T Shirt', price: 299 },
  { name: 'Trendy Crop T-Shirt', category: 'Crop T Shirt', price: 399 },
  { name: 'Solid Crop T-Shirt', category: 'Crop T Shirt', price: 249 },
]

// Mark first 3 of each category as new arrivals
const NEW_ARRIVAL_NAMES = new Set(
  Object.keys(CATEGORY_IMAGES).flatMap(cat =>
    PRODUCTS.filter(p => p.category === cat).slice(0, 3).map(p => p.name)
  )
)

async function seed() {
  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  })
  if (!loginRes.ok) {
    console.error('Login failed. Check ADMIN_USER/ADMIN_PASS and that the backend is running.')
    process.exit(1)
  }
  const { token } = await loginRes.json()
  console.log('Logged in as admin.\n')

  let added = 0
  for (const p of PRODUCTS) {
    const product = {
      name: p.name,
      price: p.price,
      category: p.category,
      imageUrl: CATEGORY_IMAGES[p.category],
      inStock: true,
      isNewArrival: NEW_ARRIVAL_NAMES.has(p.name),
    }
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(product),
    })
    if (res.ok) {
      const saved = await res.json()
      console.log(`  ✓ [${p.category}] ${saved.name}`)
      added++
    } else {
      console.warn(`  ✗ ${p.name}: ${await res.text()}`)
    }
  }

  console.log(`\nDone. ${added}/${PRODUCTS.length} products seeded.`)
}

seed().catch(err => { console.error(err); process.exit(1) })
