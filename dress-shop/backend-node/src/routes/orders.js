const router = require('express').Router()
const pool = require('../config/db')
const { customerAuth, adminAuth } = require('../middleware/auth')

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

// POST /api/orders — place order (customer)
router.post('/', customerAuth, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { items, deliveryAddress } = req.body || {}

    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: 'Order must have at least one item' })

    // Get customer
    const [customers] = await conn.query('SELECT * FROM customers WHERE id = ?', [req.customerId])
    if (customers.length === 0)
      return res.status(404).json({ message: 'Customer not found' })
    const customer = customers[0]

    const address = (deliveryAddress && deliveryAddress.trim()) || customer.address
    if (!address || !address.trim())
      return res.status(400).json({ message: 'Delivery address is required' })

    // Validate all items
    let total = 0
    const resolvedItems = []

    for (const item of items) {
      const productId = item.productId
      const qty = item.quantity

      if (!productId || !Number.isInteger(qty) || qty <= 0)
        return res.status(400).json({ message: 'Each item must have a valid productId and quantity greater than zero' })

      const [products] = await conn.query('SELECT * FROM products WHERE id = ?', [productId])
      if (products.length === 0)
        return res.status(400).json({ message: 'One or more products are no longer available' })

      const product = products[0]
      if (!product.active)
        return res.status(400).json({ message: `${product.name} is no longer available` })
      if (!product.in_stock)
        return res.status(400).json({ message: `${product.name} is out of stock` })
      if (product.stock_quantity !== null && qty > product.stock_quantity)
        return res.status(400).json({ message: `Only ${product.stock_quantity} item(s) available for ${product.name}` })

      total += product.price * qty
      resolvedItems.push({ product, qty, size: item.size || null })
    }

    if (total <= 0)
      return res.status(400).json({ message: 'Order total must be greater than zero' })

    // Save order
    await conn.beginTransaction()
    const [orderResult] = await conn.query(
      'INSERT INTO orders (customer_id, total_amount, delivery_address, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [req.customerId, total, address.trim(), 'PENDING']
    )
    const orderId = orderResult.insertId

    for (const { product, qty, size } of resolvedItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url, size) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [orderId, product.id, product.name, product.price, qty, product.image_url || '', size]
      )
    }

    await conn.commit()
    return res.status(201).json({ orderId, total })
  } catch (err) {
    await conn.rollback()
    console.error('Place order error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  } finally {
    conn.release()
  }
})

// GET /api/orders/my — customer's own orders
router.get('/my', customerAuth, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [req.customerId]
    )
    const result = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id])
      return toDto(order, items)
    }))
    return res.json(result)
  } catch (err) {
    console.error('My orders error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

// GET /api/orders — all orders (admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC')
    const result = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id])
      return toDto(order, items)
    }))
    return res.json(result)
  } catch (err) {
    console.error('All orders error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

// PATCH /api/orders/:id/status — update status (admin)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body || {}
    if (!status || !VALID_STATUSES.includes(status))
      return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` })

    const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id])
    if (existing.length === 0) return res.status(404).json({ message: 'Order not found' })

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id])
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id])
    const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id])
    return res.json(toDto(updated[0], items))
  } catch (err) {
    console.error('Update status error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

function toDto(order, items) {
  return {
    id: order.id,
    status: order.status,
    totalAmount: order.total_amount,
    deliveryAddress: order.delivery_address,
    createdAt: order.created_at,
    items: items.map(i => ({
      productId: i.product_id,
      productName: i.product_name,
      price: i.price,
      quantity: i.quantity,
      imageUrl: i.image_url || '',
      size: i.size || null,
    })),
  }
}

module.exports = router
