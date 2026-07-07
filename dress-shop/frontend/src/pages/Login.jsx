import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { customerLogin } from '../api'
import { useUserAuth } from '../context/UserAuthContext'
import { useToast } from '../context/ToastContext'

const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'U99'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useUserAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const data = await customerLogin({ email: form.email, password: form.password })
      login(data)
      toast('Welcome back! 👋')
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password'
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '', general: '' }))
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-card-hover overflow-hidden flex">

        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between bg-hero-gradient p-10 w-80 flex-shrink-0">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-rose-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">U</span>
              </div>
              <span className="font-display text-xl font-bold text-white">{SHOP_NAME}</span>
            </Link>
            <h2 className="font-display text-3xl text-white leading-tight mb-3">
              Login &<br />get started
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Access your wishlist, track orders, and enjoy a personalised shopping experience.
            </p>
          </div>
          <div className="space-y-3">
            {['Browse freely without login', 'Save wishlist across devices', 'Faster online checkout'].map(t => (
              <div key={t} className="flex items-center gap-2 text-white/60 text-xs">
                <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-rose-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">U</span>
            </div>
            <span className="font-display text-xl font-bold text-charcoal">{SHOP_NAME}</span>
          </div>

          <h1 className="font-display text-2xl text-charcoal mb-1">Welcome back</h1>
          <p className="text-muted text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/register" state={{ from }} className="text-rose font-medium hover:underline">Register</Link>
          </p>

          {errors.general && (
            <div className="bg-rose/5 border border-rose/20 text-rose text-sm px-4 py-3 rounded-xl mb-5">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                className={`w-full bg-cream border rounded-xl px-4 py-3 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose transition-all ${errors.email ? 'border-rose' : 'border-taupe'}`}
              />
              {errors.email && <p className="text-rose text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Enter your password"
                className={`w-full bg-cream border rounded-xl px-4 py-3 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose transition-all ${errors.password ? 'border-rose' : 'border-taupe'}`}
              />
              {errors.password && <p className="text-rose text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-gradient text-white font-semibold py-3.5 rounded-xl shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Logging in…
                </span>
              ) : 'Login'}
            </button>
          </form>

          <p className="text-xs text-muted text-center mt-6">
            By continuing, you agree to our terms of service.
          </p>
          <div className="mt-4 pt-4 border-t border-taupe text-center">
            <Link to="/" className="text-xs text-muted hover:text-charcoal transition-colors">
              ← Continue browsing without login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
