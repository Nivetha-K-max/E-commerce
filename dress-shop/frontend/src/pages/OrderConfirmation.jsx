import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'U99'
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919003753632'

export default function OrderConfirmation() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  // If someone lands here directly without going through payment, redirect home
  useEffect(() => {
    if (!state?.ref) navigate('/', { replace: true })
  }, [state, navigate])

  if (!state?.ref) return null

  const { ref, amount } = state

  const waText = `Hi! I just completed my UPI payment for order *${ref}* (₹${Number(amount).toLocaleString('en-IN')}). Please confirm my order. Thank you!`

  return (
    <div className="bg-ivory min-h-screen flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md text-center">

        {/* Success icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 mb-2">Payment Received</p>
        <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-3">Order Placed!</h1>
        <p className="text-muted text-sm leading-relaxed mb-6 max-w-sm mx-auto">
          Thank you for shopping with <strong>{SHOP_NAME}</strong>. Your order has been received and will be confirmed shortly.
        </p>

        {/* Order ref + amount */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">Order Reference</span>
            <span className="font-mono font-bold text-charcoal text-sm">{ref}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">Amount Paid</span>
            <span className="font-display font-bold text-charcoal text-lg">₹{Number(amount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* WhatsApp confirmation nudge */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-emerald-800 mb-1">Speed up your delivery</p>
          <p className="text-xs text-emerald-700 leading-relaxed mb-3">
            Send us your order reference on WhatsApp so we can confirm and dispatch faster.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.348l-.37-.22-3.762.896.952-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Confirm on WhatsApp
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-gradient text-white font-semibold px-6 py-3.5 rounded-2xl shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="flex-1 inline-flex items-center justify-center gap-2 border border-taupe text-charcoal font-medium px-6 py-3.5 rounded-2xl hover:border-charcoal transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
