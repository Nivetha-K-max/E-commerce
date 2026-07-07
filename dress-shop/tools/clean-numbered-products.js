#!/usr/bin/env node
const fetch = globalThis.fetch || require('node-fetch');
const API = 'http://localhost:8080/api';
const ADMIN_USER = 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASS) {
  console.error('Set ADMIN_PASSWORD before running this script.');
  process.exit(1);
}

(async function(){
  try{
    const loginRes = await fetch(`${API}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:ADMIN_USER,password:ADMIN_PASS})});
    if(!loginRes.ok){
      console.error('Login failed', await loginRes.text());
      process.exit(1);
    }
    const {token} = await loginRes.json();
    console.log('Logged in. Token obtained.');

    const res = await fetch(`${API}/products`);
    if(!res.ok){ console.error('Failed to fetch products', await res.text()); process.exit(1); }
    const products = await res.json();

    const regex = /\b\d+\b/; // match any standalone number
    const toDelete = products.filter(p => regex.test(p.name));
    console.log(`Found ${toDelete.length} products with numbers to delete.`);
    for(const p of toDelete){
      const del = await fetch(`${API}/products/${p.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
      if(del.status===204) console.log(`Deleted id=${p.id} name="${p.name}"`);
      else console.warn(`Failed to delete id=${p.id} name="${p.name}" status=${del.status}`);
    }
    console.log('Done.');
  }catch(e){
    console.error(e);
    process.exit(1);
  }
})();
