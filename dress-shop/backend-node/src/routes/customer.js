const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const { customerAuth } = require('../middleware/auth')

function generateToken(id, email) {
  return jwt.sign({ sub: id, email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function buildResponse(customer, token) {
  return {
    token,
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address || '',
  }
}

// POST /api/customer/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body || {}

    // Validation
    if (!name || !name.trim())
      return res.status(400).json({ message: 'Name is required' })
    if (!email || !email.trim())
      return res.status(400).json({ message: 'Email is required' })
    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ message: 'Enter a valid email address' })
    if (!phone || !phone.trim())
      return res.status(400).json({ message: 'Phone number is required' })
    if (!/^\+?[0-9]{10,15}$/.test(phone.trim()))
      return res.status(400).json({ message: 'Enter a valid phone number' })
    if (!password)
      return res.status(400).json({ message: 'Password is required' })
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const normalizedEmail = email.trim().toLowerCase()

    // Duplicate check
    const [existing] = await pool.query(
      'SELECT id FROM customers WHERE LOWER(email) = ?', [normalizedEmail]
    )
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, phone, password, address, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name.trim(), normalizedEmail, phone.trim(), hashed, address ? address.trim() : '']
    )

    const token = generateToken(result.insertId, normalizedEmail)
    return res.status(201).json(buildResponse(
      { id: result.insertId, name: name.trim(), email: normalizedEmail, phone: phone.trim(), address: address || '' },
      token
    ))
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

// POST /api/customer/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' })

    const [rows] = await pool.query(
      'SELECT * FROM customers WHERE LOWER(email) = ?', [email.trim().toLowerCase()]
    )
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid email or password' })

    const customer = rows[0]
    const match = await bcrypt.compare(password, customer.password)
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' })

    const token = generateToken(customer.id, customer.email)
    return res.json(buildResponse(customer, token))
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
})

module.exports = router
