const jwt = require('jsonwebtoken')

// Verifies customer JWT — attaches customerId to req
function customerAuth(req, res, next) {
  const header = req.headers['authorization']
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Invalid token' })
  try {
    const payload = jwt.verify(header.substring(7), process.env.JWT_SECRET)
    req.customerId = payload.sub
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

// Verifies admin Bearer token
function adminAuth(req, res, next) {
  const header = req.headers['authorization']
  if (!header || header !== `Bearer ${process.env.ADMIN_TOKEN}`)
    return res.status(401).json({ message: 'Admin access required' })
  next()
}

module.exports = { customerAuth, adminAuth }
