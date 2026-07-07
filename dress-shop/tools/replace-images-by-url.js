#!/usr/bin/env node
const fetch = globalThis.fetch || require('node-fetch')
const API = 'http://localhost:8080/api'
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin123'

// URLs you provided to replace
const TARGET_URLS = [
  'https://picsum.photos/seed/product-14/600/800',
  'https://picsum.photos/seed/product-6/600/800',
  'https://picsum.photos/seed/product-1/600/800',
  'https://picsum.photos/seed/product-3/600/800',
]

// Keep in sync with frontend/src/constants/categoryImages.js
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

async function login(){
  const r = await fetch(`${API}/auth/login`, {
    method:'POST', headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS })
  })
  if(!r.ok) throw new Error('Login failed: '+await r.text())
  return (await r.json()).token
}

async function run(){
  try{
    const token = await login()
    console.log('Logged in')
    const res = await fetch(`${API}/products`)
    if(!res.ok) throw new Error('Failed to fetch products')
    const products = await res.json()

    const toUpdate = products.filter(p => p.imageUrl && TARGET_URLS.includes(p.imageUrl.trim()))
    console.log('Found', toUpdate.length, 'products with target images')
    const updated = []
    for(const p of toUpdate){
      const newImg = CATEGORY_IMAGES[p.category] || ''
      if(!newImg){
        console.warn('No category image for', p.category, '— skipping id=', p.id)
        continue
      }
      const prodRes = await fetch(`${API}/products/${p.id}`)
      if(!prodRes.ok){ console.warn('Failed to fetch product', p.id); continue }
      const prod = await prodRes.json()
      prod.imageUrl = newImg
      const put = await fetch(`${API}/products/${p.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(prod)
      })
      if(put.ok){
        updated.push({ id: p.id, name: p.name, category: p.category })
        console.log('Updated id=', p.id, '-> category image')
      } else {
        console.warn('Failed to update id=', p.id)
      }
    }
    console.log('Done. Updated', updated.length, 'products')
  }catch(e){ console.error(e); process.exit(1) }
}

run()
