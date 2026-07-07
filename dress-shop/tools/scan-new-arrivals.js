#!/usr/bin/env node
const fetch = globalThis.fetch || require('node-fetch')
const API = 'http://localhost:8080/api'

async function run(){
  try{
    const newRes = await fetch(`${API}/products?new=1`)
    if(!newRes.ok) throw new Error('Failed to fetch new arrivals: '+newRes.status)
    const newArr = await newRes.json()
    const allRes = await fetch(`${API}/products`)
    if(!allRes.ok) throw new Error('Failed to fetch all products: '+allRes.status)
    const all = await allRes.json()

    const freq = {}
    for(const p of all){ const img = (p.imageUrl||'').trim(); freq[img] = (freq[img]||0)+1 }

    const keywords = ['tree','forest','fork','spoon','utensil','plate','food','kitchen','beach','stair','stairs','fence','rock','sea','ocean']
    const flagged = []
    const uniq = new Map()

    for(const p of newArr){
      const img = (p.imageUrl||'').trim()
      if(!uniq.has(img)) uniq.set(img,[])
      uniq.get(img).push(p)
      const lower = img.toLowerCase()
      for(const k of keywords){ if(lower.includes(k)){ flagged.push({product:p, reason:k, freq:freq[img]||0}); break } }
    }

    console.log('New Arrivals count:', newArr.length)
    console.log('Unique images in New Arrivals:', uniq.size)
    console.log('\n-- Unique images and usages --')
    for(const [img,list] of uniq.entries()){
      console.log('\nIMAGE:', img||'<empty>')
      console.log('Used by:')
      for(const x of list) console.log('  ', x.id, '"'+x.name+'"', '(', x.category, ')')
      console.log('Total occurrences across DB:', freq[img]||0)
    }

    if(flagged.length){
      console.log('\n-- Flagged images by keyword --')
      for(const f of flagged) console.log(`${f.product.id}:${f.product.name} (${f.product.category}) -> reason='${f.reason}', url=${f.product.imageUrl}, occurrences=${f.freq}`)
    } else console.log('\nNo flagged images found by keyword list')
  }catch(e){ console.error(e); process.exit(1) }
}

run()
