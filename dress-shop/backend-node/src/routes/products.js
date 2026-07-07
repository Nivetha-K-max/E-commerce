const router = require('express').Router()
const pool = require('../config/db')
const { adminAuth } = require('../middleware/auth')

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, inStock, minPrice, maxPrice } = req.query
    let query = 'SELECT * FROM products WHERE 1=1'
    const params = []

    if (category) { query += ' AND LOWER(category) = LOWER(?)'; params.push(category) }
    if (search) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(category) LIKE ?)'
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`)
    }
    if (inStock === 'true') { query += ' AND in_stock = 1' }
    if (minPrice) { query += ' AND price >= ?'; params.push(parseFloat(minPrice)) }
    if (maxPrice) { query += ' AND price <= ?'; params.push(parseFloat(maxPrice)) }

    const sortMap = {
      price_asc: 'price ASC',
      price_desc: 'price DESC',
      name_asc: 'name ASC',
    }
    query += ` ORDER BY ${sortMap[sort] || 'created_at DESC'}`

    const [rows] = await pool.query(query, params)
    return res.json(rows.map(toDto))
  } catch (err) {
    console.error('Get products error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

// GET /api/products/new-arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE is_new_arrival = 1 ORDER BY created_at DESC'
    )
    return res.json(rows.map(toDto))
  } catch (err) {
    console.error('New arrivals error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' })
    return res.json(toDto(rows[0]))
  } catch (err) {
    console.error('Get product error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

// POST /api/products — admin only
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, price, imageUrl, category, inStock, stockQuantity, isNewArrival, description, active } = req.body
    if (!name || !price || !category)
      return res.status(400).json({ message: 'Name, price and category are required' })
    const [result] = await pool.query(
      `INSERT INTO products (name, price, image_url, category, in_stock, stock_quantity, is_new_arrival, description, active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, price, imageUrl || null, category, inStock !== false ? 1 : 0,
       stockQuantity || null, isNewArrival ? 1 : 0, description || null, active !== false ? 1 : 0]
    )
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId])
    return res.status(201).json(toDto(rows[0]))
  } catch (err) {
    console.error('Create product error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

// PUT /api/products/:id — admin only
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, price, imageUrl, category, inStock, stockQuantity, isNewArrival, description, active } = req.body
    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id])
    if (existing.length === 0) return res.status(404).json({ message: 'Product not found' })

    await pool.query(
      `UPDATE products SET name=?, price=?, image_url=?, category=?, in_stock=?,
       stock_quantity=?, is_new_arrival=?, description=?, active=? WHERE id=?`,
      [name, price, imageUrl || null, category, inStock ? 1 : 0,
       stockQuantity || null, isNewArrival ? 1 : 0, description || null, active !== false ? 1 : 0, req.params.id]
    )
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    return res.json(toDto(rows[0]))
  } catch (err) {
    console.error('Update product error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

// DELETE /api/products/:id — admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id])
    if (existing.length === 0) return res.status(404).json({ message: 'Product not found' })
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
    return res.status(204).send()
  } catch (err) {
    console.error('Delete product error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

function toDto(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.image_url,
    category: p.category,
    inStock: p.in_stock === 1,
    active: p.active === 1,
    stockQuantity: p.stock_quantity,
    isNewArrival: p.is_new_arrival === 1,
    description: p.description,
    createdAt: p.created_at,
  }
}

module.exports = router
