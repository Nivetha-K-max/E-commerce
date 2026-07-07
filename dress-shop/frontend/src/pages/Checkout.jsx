import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { items, totalPrice } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [items.length, navigate])

  const handlePayNow = () => navigate('/payment')

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-14">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose/80 mb-2">Secure Checkout</p>
          <h1 className="font-display text-3xl text-charcoal">Complete your order</h1>
          <p className="text-muted text-sm mt-1">Fast, secure online payment. No COD and no returns.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
            <div className="rounded-2xl border border-rose/20 bg-rose/5 p-4 mb-6">
              <p className="text-sm font-semibold text-charcoal">Payment notice</p>
              <p className="text-sm text-muted mt-1">Cash on Delivery (COD) is not available. Only online payments are accepted. No refunds or returns.</p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-taupe/60 p-4">
                <p className="text-sm font-semibold text-charcoal mb-3">Order summary</p>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm text-muted">
                      <span>{item.name} × {item.qty}</span>
                      <span className="font-medium text-charcoal">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-taupe/60 p-4">
                <p className="text-sm font-semibold text-charcoal mb-3">Payment method</p>
                <div className="flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Online payment</p>
                    <p className="text-xs text-muted">Secure card / UPI / net banking</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">Recommended</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
              <h2 className="font-display text-xl text-charcoal mb-4">Amount to pay</h2>
              <div className="flex justify-between text-sm text-muted mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-muted mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-taupe pt-3 mt-3 flex justify-between font-semibold text-charcoal">
                <span>Total</span>
                <span className="font-display text-xl">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <button
                onClick={handlePayNow}
                className="mt-6 w-full bg-rose-gradient text-white font-semibold py-3.5 rounded-2xl shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Pay Now →
              </button>
              <Link to="/cart" className="mt-3 block w-full border border-taupe text-charcoal text-sm font-medium py-3 rounded-2xl hover:border-charcoal transition-colors text-center">
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
