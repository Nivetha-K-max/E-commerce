import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { buildOrderLink } from '../utils/whatsapp'

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-card">
      <div className="aspect-[3/4] shimmer" />
      <div className="p-3 sm:p-4 flex flex-col gap-2">
        <div className="h-3 w-16 shimmer rounded-full" />
        <div className="h-4 w-3/4 shimmer rounded-full" />
        <div className="h-5 w-1/3 shimmer rounded-full mt-1" />
        <div className="h-11 w-full shimmer rounded-xl mt-2" />
      </div>
    </div>
  )
}

export default function ProductCard({ product }) {
  const { name, price, imageUrl, category, inStock, isNewArrival } = product
  const { addToCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const toast = useToast()
  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast(`"${name}" added to cart`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist ♥')
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden flex flex-col shadow-card active:scale-[0.98] transition-all duration-200 hover:shadow-card-hover">

      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative aspect-[3/4] bg-cream overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!inStock ? 'opacity-40 grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream">
            <span className="text-5xl">👗</span>
          </div>
        )}

        {/* Dark gradient bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Price on image bottom — visible always on mobile */}
        <div className="absolute bottom-2 left-3">
          <span className="text-white font-bold text-base drop-shadow-md">₹{price.toLocaleString('en-IN')}</span>
        </div>

        {/* Badges */}
        {isNewArrival && (
          <span className="absolute top-2 left-2 z-10 bg-rose text-white text-[10px] font-bold px-2 py-1 rounded-lg">NEW</span>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="bg-white text-charcoal text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}

        {/* Wishlist — large touch target */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"
            fill={wishlisted ? '#C9184A' : 'none'} stroke={wishlisted ? '#C9184A' : '#6B7280'} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-rose/80 truncate">{category}</p>
        <h3 className="text-sm sm:text-base font-semibold text-charcoal leading-snug line-clamp-2 min-h-[2.5rem]">
          <Link to={`/products/${product.id}`} className="hover:text-rose transition-colors">{name}</Link>
        </h3>

        {/* CTA buttons — full width, large touch targets */}
        {inStock ? (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 bg-charcoal text-white text-xs sm:text-sm font-semibold py-3 rounded-xl active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Cart
            </button>
            <a
              href={buildOrderLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 bg-rose text-white text-xs sm:text-sm font-semibold py-3 rounded-xl active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.348l-.37-.22-3.762.896.952-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Buy
            </a>
          </div>
        ) : (
          <button disabled className="mt-2 w-full bg-taupe/60 text-muted text-sm font-medium py-3 rounded-xl cursor-not-allowed">
            Unavailable
          </button>
        )}
      </div>
    </div>
  )
}
