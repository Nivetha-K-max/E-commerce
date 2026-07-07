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

const TRACK_STEPS = [
  {
    key: 'PENDING',
    label: 'Order Placed',
    desc: 'Your order has been received and is awaiting confirmation.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 'CONFIRMED',
    label: 'Order Confirmed',
    desc: 'We have confirmed your order and are preparing it for dispatch.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    key: 'SHIPPED',
    label: 'Shipped',
    desc: 'Your order is on its way to your delivery address.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    key: 'DELIVERED',
    label: 'Delivered',
    desc: 'Your order has been delivered. Enjoy your purchase!',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
]

function TrackingTimeline({ status }) {
  if (status === 'CANCELLED') {
    return (
      <div className="mt-4 pt-4 border-t border-taupe flex items-center gap-3 text-rose">
        <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold">Order Cancelled</p>
          <p className="text-xs text-muted mt-0.5">This order has been cancelled.</p>
        </div>
      </div>
    )
  }

  const currentIndex = TRACK_STEPS.findIndex(s => s.key === status)

  return (
    <div className="mt-4 pt-4 border-t border-taupe">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Order Tracking</p>
      <div className="flex flex-col gap-0">
        {TRACK_STEPS.map((step, idx) => {
          const done    = idx < currentIndex
          const active  = idx === currentIndex
          const pending = idx > currentIndex
          const isLast  = idx === TRACK_STEPS.length - 1

          return (
            <div key={step.key} className="flex gap-3">
              {/* Icon + connector line */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  done    ? 'bg-emerald-500 text-white' :
                  active  ? 'bg-rose text-white ring-4 ring-rose/20' :
                            'bg-cream text-taupe'
                }`}>
                  {step.icon}
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-6 my-1 rounded-full ${done ? 'bg-emerald-400' : 'bg-taupe/50'}`} />
                )}
              </div>

              {/* Text */}
              <div className={`pb-1 ${isLast ? '' : 'mb-1'} pt-1`}>
                <p className={`text-sm font-semibold leading-tight ${
                  done ? 'text-emerald-700' : active ? 'text-charcoal' : 'text-muted'
                }`}>
                  {step.label}
                  {active && <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-rose bg-rose/10 px-2 py-0.5 rounded-full">Current</span>}
                </p>
                {(done || active) && (
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{step.desc}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Orders() {
  const { user } = useUserAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    if (!user?.token) { navigate('/login', { state: { from: '/orders' } }); return }
    getMyOrders(user.token)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [user, navigate])

  const toggleTrack = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

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

              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted">Order #{order.id}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-taupe text-muted'}`}>
                  {order.status}
                </span>
              </div>

              {/* Items */}
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
                    <p className="text-sm font-semibold text-charcoal flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer row */}
              <div className="border-t border-taupe pt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted truncate max-w-[50%]">📍 {order.deliveryAddress}</p>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="font-display font-semibold text-charcoal">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  <button
                    onClick={() => toggleTrack(order.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      expanded[order.id]
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-white text-charcoal border-taupe hover:border-charcoal'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {expanded[order.id] ? 'Hide' : 'Track Order'}
                  </button>
                </div>
              </div>

              {/* Tracking timeline — toggled */}
              {expanded[order.id] && <TrackingTimeline status={order.status} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
