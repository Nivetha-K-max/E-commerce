import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { buildOrderLink } from '../utils/whatsapp'

export default function Wishlist() {
  const { items, toggle } = useWishlist()
  const { addToCart } = useCart()
  const toast = useToast()

  if (items.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-20">
      <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-taupe" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h2 className="font-display text-2xl text-charcoal mb-2">Your wishlist is empty</h2>
      <p className="text-muted text-sm mb-8 text-center max-w-xs">Tap the heart on any product to save it here.</p>
      <Link to="/" className="inline-flex items-center gap-2 bg-rose-gradient text-white font-semibold px-6 py-3 rounded-full shadow-btn hover:shadow-lg transition-all">
        Browse Catalog
      </Link>
    </div>
  )

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-charcoal">My Wishlist</h1>
          <p className="text-muted text-sm mt-1">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group bg-white rounded-2xl overflow-hidden flex flex-col shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-[3/4] bg-cream overflow-hidden">
                <Link to={`/products/${item.id}`}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted/30">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </Link>
                <button
                  onClick={() => { toggle(item); toast('Removed from wishlist') }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#C9184A" stroke="#C9184A" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-3.5 flex flex-col gap-1 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-rose/70">{item.category}</p>
                <Link to={`/products/${item.id}`} className="text-sm font-medium text-charcoal hover:text-rose transition-colors line-clamp-2">{item.name}</Link>
                <p className="font-display font-semibold text-charcoal mt-auto pt-1">₹{item.price.toLocaleString('en-IN')}</p>
                {item.inStock ? (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { addToCart(item); toast(`"${item.name}" added to cart`) }}
                      className="flex-1 bg-charcoal text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-charcoal/90 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <a
                      href={buildOrderLink(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-rose-gradient text-white text-xs font-semibold py-2.5 rounded-xl text-center shadow-btn hover:shadow-lg transition-all"
                    >
                      Buy Now
                    </a>
                  </div>
                ) : (
                  <button disabled className="mt-2 w-full bg-taupe text-muted text-xs font-medium py-2.5 rounded-xl cursor-not-allowed">
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
