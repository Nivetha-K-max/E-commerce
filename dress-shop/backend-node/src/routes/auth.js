const router = require('express').Router()

// POST /api/auth/login — admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password are required' })
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD)
    return res.json({ token: process.env.ADMIN_TOKEN })
  return res.status(401).json({ message: 'Invalid username or password' })
})

module.exports = router
