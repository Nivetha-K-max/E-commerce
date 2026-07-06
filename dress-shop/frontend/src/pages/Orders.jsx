import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyOrders } from '../api'
import { useUserAuth } from '../context/UserAuthContext'

const STATUS_STYLES = {
  PENDING:   'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  SHIPPED:   'bg-purple-50 text-purple-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-rose/10 text-rose',
}

export default function Orders() {
  const { user } = useUserAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.token) { navigate('/login', { state: { from: '/orders' } }); return }
    getMyOrders(user.token)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [user, navigate])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-5 py-16 flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-card">
          <div className="h-4 w-32 shimmer rounded-full mb-3" />
          <div className="h-3 w-48 shimmer rounded-full mb-2" />
          <div className="h-3 w-24 shimmer rounded-full" />
        </div>
      ))}
    </div>
  )

  if (orders.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-20">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="font-display text-2xl text-charcoal mb-2">No orders yet</h2>
      <p className="text-muted text-sm mb-8 text-center max-w-xs">Your order history will appear here after you place an order.</p>
      <Link to="/products" className="inline-flex items-center gap-2 bg-rose-gradient text-white font-semibold px-6 py-3 rounded-full shadow-btn">
        Browse Catalog
      </Link>
    </div>
  )

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
        <h1 className="font-display text-3xl text-charcoal mb-8">My Orders</h1>
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted">Order #{order.id}</p>
                  <p className="text-xs text-muted mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-taupe text-muted'}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-12 bg-cream rounded-lg flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-charcoal truncate">{item.productName}</p>
                      <p className="text-xs text-muted">₹{item.price.toLocaleString('en-IN')} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-charcoal flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-taupe pt-3 flex items-center justify-between">
                <p className="text-xs text-muted truncate max-w-[60%]">📍 {order.deliveryAddress}</p>
                <p className="font-display font-semibold text-charcoal">₹{order.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
