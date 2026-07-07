#!/usr/bin/env node
const fetch = globalThis.fetch || require('node-fetch')
const API = 'http://localhost:8080/api'
const ADMIN_USER = 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD

if (!ADMIN_PASS) {
  console.error('Set ADMIN_PASSWORD before running this script.')
  process.exit(1)
}

async function login() {
  const r = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS })
  })
  if (!r.ok) throw new Error('Login failed: ' + await r.text())
  return (await r.json()).token
}

async function run() {
  try {
    const token = await login()
    console.log('Logged in')
    const res = await fetch(`${API}/products`)
    if (!res.ok) throw new Error('Failed to fetch products')
    const products = await res.json()

    // group by category -> imageUrl
    const byCat = {}
    for (const p of products) {
      const img = p.imageUrl ? p.imageUrl.trim() : ''
      if (!byCat[p.category]) byCat[p.category] = {}
      if (!byCat[p.category][img]) byCat[p.category][img] = []
      byCat[p.category][img].push(p)
    }

    const toDelete = []
    for (const [cat, imgs] of Object.entries(byCat)) {
      for (const [img, list] of Object.entries(imgs)) {
        if (!img) continue // skip empty images
        if (list.length <= 1) continue
        // sort to keep the earliest-created — heuristic: keep lowest id
        list.sort((a,b)=>a.id - b.id)
        // keep first, delete rest
        const keep = list[0]
        const rest = list.slice(1)
        for (const r of rest) toDelete.push(r)
      }
    }

    console.log('Found', toDelete.length, 'duplicate products to delete')
    let deleted = 0
    for (const p of toDelete) {
      const d = await fetch(`${API}/products/${p.id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      })
      if (d.ok) {
        deleted++
        console.log('Deleted id=', p.id, 'name="'+p.name+'" category='+p.category)
      } else {
        console.warn('Failed to delete id=', p.id)
      }
    }

    console.log('Done. Deleted', deleted, 'products')
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

run()
