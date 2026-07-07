import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { CATEGORY_IMAGES } from '../constants/categoryImages'
import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'

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
  const displayImage = imageUrl || CATEGORY_IMAGES[category] || null
  const { addToCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const toast = useToast()
  const navigate = useNavigate()
  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast(`"${name}" added to cart`)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    addToCart(product)
    toast(`"${name}" added to cart`)
    navigate('/checkout')
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist ♥')
  }

  return (
    <Card className="group relative overflow-hidden flex flex-col active:scale-[0.98] hover:token-card-hover">
      <Link to={`/products/${product.id}`} className="block relative aspect-[3/4] bg-cream overflow-hidden flex-shrink-0">
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!inStock ? 'opacity-40 grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream">
            <span className="text-5xl">👗</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute bottom-2 left-3">
          <span className="text-white font-bold text-base drop-shadow-md">
            ₹{Number(price ?? 0).toLocaleString('en-IN')}
          </span>
        </div>

        {isNewArrival && (
          <Badge className="absolute top-2 left-2 z-10 bg-rose text-white text-[10px]">NEW</Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="bg-white text-charcoal text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}

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

      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-rose/80 truncate">{category}</p>
        <h3 className="text-sm sm:text-base font-semibold text-charcoal leading-snug line-clamp-2 min-h-[2.5rem]">
          <Link to={`/products/${product.id}`} className="hover:text-rose transition-colors">{name}</Link>
        </h3>

        {inStock ? (
          <div className="flex gap-2 mt-2">
            <Button onClick={handleAddToCart} className="flex-1" variant="secondary">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add
            </Button>
            <Button onClick={handleBuyNow} className="flex-1" variant="primary">
              Buy
            </Button>
          </div>
        ) : (
          <button disabled className="mt-2 w-full bg-taupe/60 text-muted text-sm font-medium py-3 rounded-xl cursor-not-allowed">
            Unavailable
          </button>
        )}
      </div>
    </Card>
  )
}

