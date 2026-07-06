import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { customerRegister } from '../api'
import { useUserAuth } from '../context/UserAuthContext'
import { useToast } from '../context/ToastContext'

const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'U99'

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    address: '', city: '', pincode: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useUserAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.pincode.trim()) e.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const data = await customerRegister({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: `${form.address}, ${form.city} - ${form.pincode}`,
      })
      login(data)
      toast('Account created! Welcome to ' + SHOP_NAME + ' 🎉')
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.'
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '', general: '' }))
  }

  const Field = ({ label, name, type = 'text', placeholder, half }) => (
    <div className={half ? 'flex-1 min-w-0' : ''}>
      <label className="block text-xs font-semibold text-charcoal mb-1.5">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={set(name)}
        placeholder={placeholder}
        className={`w-full bg-cream border rounded-xl px-4 py-3 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose transition-all ${errors[name] ? 'border-rose' : 'border-taupe'}`}
      />
      {errors[name] && <p className="text-rose text-xs mt-1">{errors[name]}</p>}
    </div>
  )

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
              Create your<br />account
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Join {SHOP_NAME} to save your wishlist, manage orders, and get a personalised experience.
            </p>
          </div>
          <div className="space-y-3">
            {['Free to register', 'Save wishlist & cart', 'Faster WhatsApp ordering', 'Manage delivery address'].map(t => (
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
        <div className="flex-1 p-8 sm:p-10 overflow-y-auto max-h-screen">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-rose-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">U</span>
            </div>
            <span className="font-display text-xl font-bold text-charcoal">{SHOP_NAME}</span>
          </div>

          <h1 className="font-display text-2xl text-charcoal mb-1">Create account</h1>
          <p className="text-muted text-sm mb-6">
            Already have an account?{' '}
            <Link to="/login" state={{ from }} className="text-rose font-medium hover:underline">Login</Link>
          </p>

          {errors.general && (
            <div className="bg-rose/5 border border-rose/20 text-rose text-sm px-4 py-3 rounded-xl mb-5">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Full Name" name="name" placeholder="Your full name" />

            <div className="flex gap-3">
              <Field label="Email address" name="email" type="email" placeholder="you@example.com" half />
              <Field label="Phone number" name="phone" placeholder="10-digit mobile" half />
            </div>

            <div className="flex gap-3">
              <Field label="Password" name="password" type="password" placeholder="Min. 6 characters" half />
              <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" half />
            </div>

            <div className="pt-2 border-t border-taupe">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Delivery Address</p>
              <div className="flex flex-col gap-3">
                <Field label="Street Address" name="address" placeholder="House no., street, area" />
                <div className="flex gap-3">
                  <Field label="City" name="city" placeholder="City" half />
                  <Field label="Pincode" name="pincode" placeholder="6-digit pincode" half />
                </div>
              </div>
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
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-muted text-center mt-4">
            By registering, you agree to our terms of service.
          </p>
          <div className="mt-3 pt-3 border-t border-taupe text-center">
            <Link to="/" className="text-xs text-muted hover:text-charcoal transition-colors">
              ← Continue browsing without account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
