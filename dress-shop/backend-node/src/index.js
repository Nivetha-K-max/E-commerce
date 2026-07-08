require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

// CORS
app.use(cors({
  origin: process.env.CORS_ALLOWED_ORIGIN || process.env.CORS || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded images
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads')
app.use('/uploads', express.static(uploadDir))

// Routes
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/customer', require('./routes/customer'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders',   require('./routes/orders'))
app.use('/api/upload',   require('./routes/upload'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Something went wrong. Please try again later.' })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
