const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const { adminAuth } = require('../middleware/auth')

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = process.env.UPLOAD_DIR || './uploads'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = { 'image/png': '.png', 'image/webp': '.webp' }[file.mimetype] || '.jpg'
    cb(null, uuidv4() + ext)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only JPG, PNG, or WEBP images are allowed'))
  },
})

// POST /api/upload — admin only
router.post('/', adminAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload failed' })
    if (!req.file) return res.status(400).json({ message: 'No file provided' })
    const imageUrl = `${process.env.SERVER_BASE_URL}/uploads/${req.file.filename}`
    return res.json({ imageUrl })
  })
})

module.exports = router
