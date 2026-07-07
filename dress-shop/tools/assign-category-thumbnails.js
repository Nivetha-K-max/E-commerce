#!/usr/bin/env node
const fetch = globalThis.fetch || require('node-fetch')
const API = 'http://localhost:8080/api'
const ADMIN_USER = 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD

if (!ADMIN_PASS) {
  console.error('Set ADMIN_PASSWORD before running this script.')
  process.exit(1)
}

// Keep in sync with frontend src/constants/categoryImages.js
const CATEGORY_IMAGES = {
  'Kurtis Set':   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOZKwRU7yoQqWWIvrwN4ljw1YiIf1glBZfhQQt6Wfapw&s=10',
  'Palazzo Pant': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnjymJinBnWf6ZkqtcCROf-2JKY983CNSxDiOV4y-yQ&s=10',
  'Jeggings':     'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80',
  'Leggings':     'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80',
  'Western Top':  'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&q=80',
  'Maxi':         'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
  'Party Wear':   'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80',
  'Skirts':       'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80',
  'Night Suit':   'https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=400&q=80',
  'Night Pants':  'https://images.unsplash.com/photo-1617952236317-0bd127407984?w=400&q=80',
  'Shorts':       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp-RdP1eH221VmF6AOMonNpTYNh08akvLcgVVKNE5jsg&s=10',
  'T Shirt':      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvtInYQPpAWuNIli9qnbRpX3DF7CqkaC8-WQEAiMNblQ&s=10',
  'Crop T Shirt': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkuKV6Hbu5T_6K_0zE5eq4vhUyq50jIP-7az4qWEwt2g&s=10',
}

async function run() {
  try {
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
    })
    if (!loginRes.ok) throw new Error('Login failed: ' + await loginRes.text())
    const { token } = await loginRes.json()
    console.log('Logged in')

    const res = await fetch(`${API}/products`)
    if (!res.ok) throw new Error('Failed to fetch products')
    const products = await res.json()

    const byCategory = {}
    for (const p of products) {
      if (!byCategory[p.category]) byCategory[p.category] = []
      byCategory[p.category].push(p)
    }

    const updates = []
    for (const [cat, url] of Object.entries(CATEGORY_IMAGES)) {
      const list = byCategory[cat]
      if (!list || list.length === 0) continue
      // choose first product in list (products are returned newest-first)
      const first = list[0]
      if (first.imageUrl === url) {
        console.log(`Category ${cat}: first product already has category image (id=${first.id})`)
        continue
      }
      // fetch full product
      const prodRes = await fetch(`${API}/products/${first.id}`)
      if (!prodRes.ok) { console.warn(`Failed to fetch product ${first.id}`); continue }
      const prod = await prodRes.json()
      prod.imageUrl = url
      const put = await fetch(`${API}/products/${first.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(prod),
      })
      if (put.ok) {
        console.log(`Updated product id=${first.id} category=${cat} -> set category thumbnail`)
        updates.push(first.id)
      } else {
        console.warn(`Failed to update product id=${first.id} category=${cat}`)
      }
    }

    console.log('Done. Updated', updates.length, 'products')
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

run()
