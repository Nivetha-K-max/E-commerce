import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useUserAuth } from '../context/UserAuthContext'
import { placeOrder } from '../api'

const UPI_ID   = import.meta.env.VITE_UPI_ID   || '9003753632@ybl'
const UPI_NAME = import.meta.env.VITE_UPI_NAME  || 'U99 Fashion'
const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'U99'

// Generate a short order reference
function makeRef() {
  return 'U99' + Date.now().toString(36).toUpperCase().slice(-6)
}

export default function Payment() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useUserAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [ref]        = useState(makeRef)
  const [confirmed,  setConfirmed]  = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [copied,     setCopied]     = useState(false)
  const timerRef = useRef(null)

  // Guard: if cart is empty, go back to cart
  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true })
    else if (!user?.token) navigate('/login', { replace: true, state: { from: '/payment' } })
  }, [items.length, user, navigate])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // UPI deep-link (works on mobile to open any UPI app)
  const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent('Order ' + ref)}`

  // QR code image via free public API — encodes the UPI deep link
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(upiLink)}`

  // Per-app deep links (Android intent / iOS universal)
  const appLinks = [
    {
      name: 'Google Pay',
      color: 'bg-white border border-taupe',
      textColor: 'text-charcoal',
      logo: (
        <svg viewBox="0 0 48 48" className="w-6 h-6">
          <path fill="#4285F4" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.2 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13 17.8 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
          <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 019.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 000 24c0 3.9.9 7.5 2.7 10.7l7.8-6z"/>
          <path fill="#EA4335" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.3-7.7 2.3-6.2 0-11.5-4.2-13.4-9.8l-7.8 6C6.6 42.6 14.6 48 24 48z"/>
        </svg>
      ),
      href: `gpay://upi/pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent('Order ' + ref)}`,
    },
    {
      name: 'PhonePe',
      color: 'bg-[#5f259f]',
      textColor: 'text-white',
      logo: (
        <svg viewBox="0 0 48 48" className="w-6 h-6" fill="white">
          <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm7.5 28.5h-4v-8.2l-8.5 8.2H15V15.5h4v8.2l8.5-8.2H31.5v17z"/>
        </svg>
      ),
      href: `phonepe://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent('Order ' + ref)}`,
    },
    {
      name: 'Paytm',
      color: 'bg-[#00BAF2]',
      textColor: 'text-white',
      logo: (
        <svg viewBox="0 0 48 48" className="w-6 h-6" fill="white">
          <path d="M8 12h32v4H8zm0 8h20v4H8zm0 8h14v4H8z"/>
        </svg>
      ),
      href: `paytmmp://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent('Order ' + ref)}`,
    },
    {
      name: 'BHIM',
      color: 'bg-[#00529C]',
      textColor: 'text-white',
      logo: (
        <svg viewBox="0 0 48 48" className="w-6 h-6" fill="white">
          <path d="M24 6C14.1 6 6 14.1 6 24s8.1 18 18 18 18-8.1 18-18S33.9 6 24 6zm0 4c7.7 0 14 6.3 14 14s-6.3 14-14 14S10 31.7 10 24 16.3 10 24 10zm-2 6v16h4V16h-4z"/>
        </svg>
      ),
      href: `bhim://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent('Order ' + ref)}`,
    },
  ]

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleConfirm = async () => {
    if (!confirmed) return
    setSubmitting(true)
    try {
      const orderPayload = {
        items: items.map(i => ({ productId: i.id, quantity: i.qty })),
        deliveryAddress: user?.address || '',
      }
      await placeOrder(orderPayload, user?.token)
      clearCart()
      toast('Order placed! Thank you for shopping with ' + SHOP_NAME + ' 🎉')
      navigate('/order-confirmation', { replace: true, state: { ref, amount: totalPrice } })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to place order. Please contact support.'
      toast(msg)
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose/80 mb-2">Step 3 of 3</p>
          <h1 className="font-display text-3xl text-charcoal">Complete Payment</h1>
          <p className="text-muted text-sm mt-1">Scan the QR code or tap your UPI app to pay.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">

          {/* Left — QR + UPI apps */}
          <div className="flex flex-col gap-4">

            {/* QR Card */}
            <div className="bg-white rounded-3xl shadow-card p-6 flex flex-col items-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Scan with any UPI app</p>

              <div className="relative">
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  width={220}
                  height={220}
                  className="rounded-2xl border border-taupe/40"
                />
                {/* Centre logo overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center border border-taupe/30">
                    <span className="font-display font-bold text-rose text-xs">UPI</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 bg-cream rounded-xl px-4 py-2.5 w-full max-w-xs">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-0.5">UPI ID</p>
                  <p className="text-sm font-bold text-charcoal truncate">{UPI_ID}</p>
                </div>
                <button
                  onClick={copyUpiId}
                  className="flex-shrink-0 text-xs font-semibold text-rose hover:text-rose/70 transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              <p className="text-xs text-muted mt-3 text-center">
                Pay exactly <span className="font-bold text-charcoal">₹{totalPrice.toLocaleString('en-IN')}</span> to complete your order.
              </p>
            </div>

            {/* UPI App shortcuts — mobile only (deep links) */}
            <div className="bg-white rounded-3xl shadow-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Or open your UPI app directly</p>
              <div className="grid grid-cols-4 gap-3">
                {appLinks.map(app => (
                  <a
                    key={app.name}
                    href={app.href}
                    className={`flex flex-col items-center gap-2 ${app.color} rounded-2xl p-3 active:scale-95 transition-transform`}
                  >
                    {app.logo}
                    <span className={`text-[10px] font-semibold ${app.textColor} text-center leading-tight`}>{app.name}</span>
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-muted text-center mt-3">App links work on mobile devices only</p>
            </div>
          </div>

          {/* Right — order summary + confirmation */}
          <div className="flex flex-col gap-4">

            {/* Order summary */}
            <div className="bg-white rounded-3xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg text-charcoal">Order Summary</h2>
                <span className="text-xs font-mono font-semibold text-muted bg-cream px-2.5 py-1 rounded-lg">{ref}</span>
              </div>
              <div className="flex flex-col gap-2 max-h-44 overflow-y-auto no-scrollbar mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-9 h-11 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-charcoal truncate">{item.name}</p>
                      <p className="text-[10px] text-muted">₹{item.price.toLocaleString('en-IN')} × {item.qty}</p>
                    </div>
                    <p className="text-xs font-semibold text-charcoal flex-shrink-0">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-taupe pt-3 space-y-1.5">
                <div className="flex justify-between text-sm text-muted">
                  <span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-muted">
                  <span>Shipping</span><span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-charcoal text-base pt-1 border-t border-taupe">
                  <span>Total</span>
                  <span className="font-display text-xl">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Confirmation card */}
            <div className="bg-white rounded-3xl shadow-card p-6">
              <p className="text-sm font-semibold text-charcoal mb-1">After paying</p>
              <p className="text-xs text-muted mb-5 leading-relaxed">
                Once your UPI payment is successful, tick the box below and click <strong>Confirm Order</strong>.
              </p>

              <label className="flex items-start gap-3 cursor-pointer mb-5 group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={e => setConfirmed(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${confirmed ? 'bg-rose border-rose' : 'border-taupe group-hover:border-rose/50'}`}>
                    {confirmed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-charcoal/80 leading-snug">
                  I have successfully completed the UPI payment of <span className="font-bold text-charcoal">₹{totalPrice.toLocaleString('en-IN')}</span>
                </span>
              </label>

              <button
                onClick={handleConfirm}
                disabled={!confirmed || submitting}
                className="w-full bg-rose-gradient text-white font-semibold py-3.5 rounded-2xl shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Placing order…
                  </>
                ) : 'Confirm Order'}
              </button>

              <Link to="/checkout" className="mt-3 block w-full border border-taupe text-charcoal text-sm font-medium py-3 rounded-2xl hover:border-charcoal transition-colors text-center">
                ← Back to Checkout
              </Link>
            </div>

            {/* Notice */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-800 mb-1">⚠️ Important</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Only click <strong>Confirm Order</strong> after your UPI app shows a successful payment. COD is not available. No refunds or returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
