import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { token } = await login(username, password)
      localStorage.setItem('adminToken', token)
      navigate('/admin')
    } catch (err) {
      setError('Incorrect username or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-charcoal text-center mb-1">Admin Login</h1>
        <p className="font-body text-sm text-charcoal/60 text-center mb-8">Manage your catalog and stock</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-body text-charcoal/80 mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-taupe rounded-sm px-3 py-2.5 font-body text-charcoal bg-white focus:border-teal"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-body text-charcoal/80 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-taupe rounded-sm px-3 py-2.5 font-body text-charcoal bg-white focus:border-teal"
            />
          </div>

          {error && <p className="text-maroon text-sm font-body">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-charcoal text-ivory font-body font-medium py-2.5 rounded-sm hover:bg-charcoal/90 transition-colors disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
