import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function Cart() {
  const { items, removeFromCart, updateQty, clearCart, totalPrice } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  const handleRemove = (item) => {
    removeFromCart(item.id)
    toast(`"${item.name}" removed`)
  }

  if (items.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-20">
      <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-taupe" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h2 className="font-display text-2xl text-charcoal mb-2">Your cart is empty</h2>
      <p className="text-muted text-sm mb-8 text-center max-w-xs">Add some items from the catalog to get started.</p>
      <Link to="/" className="inline-flex items-center gap-2 bg-rose-gradient text-white font-semibold px-6 py-3 rounded-full shadow-btn hover:shadow-lg transition-all">
        Continue Shopping
      </Link>
    </div>
  )

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-charcoal">Your Cart</h1>
            <p className="text-muted text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={clearCart} className="text-sm text-muted hover:text-rose transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-shadow">
                <Link to={`/products/${item.id}`} className="flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-24 object-cover rounded-xl" />
                  ) : (
                    <div className="w-20 h-24 bg-cream rounded-xl flex items-center justify-center text-muted/40">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-rose/70">{item.category}</p>
                  <Link to={`/products/${item.id}`} className="font-medium text-charcoal hover:text-rose transition-colors line-clamp-2 text-sm">
                    {item.name}
                  </Link>
                  <p className="font-display font-semibold text-charcoal mt-auto">
                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    <span className="text-xs text-muted font-normal ml-1.5">₹{item.price.toLocaleString('en-IN')} each</span>
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center bg-cream rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-taupe transition-colors text-lg font-light"
                      >−</button>
                      <span className="w-8 text-center text-sm font-semibold text-charcoal">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-taupe transition-colors text-lg font-light"
                      >+</button>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-xs text-muted hover:text-rose transition-colors"
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <h2 className="font-display text-xl text-charcoal mb-4">Order Summary</h2>
              <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto no-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm text-muted">
                    <span className="truncate mr-2">{item.name} × {item.qty}</span>
                    <span className="flex-shrink-0 font-medium text-charcoal">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-taupe pt-3 flex justify-between font-semibold text-charcoal mb-5">
                <span>Total</span>
                <span className="font-display text-xl">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="rounded-2xl border border-rose/20 bg-rose/5 p-3 mb-3 text-sm text-muted">
                Cash on Delivery (COD) is not available. Only online payments are accepted. No refunds or returns.
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="flex items-center justify-center gap-2 w-full bg-rose-gradient text-white font-semibold py-3.5 rounded-2xl shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all text-center mb-3"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/"
                className="block w-full border border-taupe text-charcoal text-sm font-medium py-3 rounded-2xl hover:border-charcoal transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
