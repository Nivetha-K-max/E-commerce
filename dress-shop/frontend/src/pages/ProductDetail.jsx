import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, getProducts } from '../api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { buildOrderLink } from '../utils/whatsapp'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [zoomed, setZoomed] = useState(false)
  const { addToCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const toast = useToast()

  useEffect(() => {
    setLoading(true)
    setProduct(null)
    setRelated([])
    getProduct(id)
      .then(async (p) => {
        setProduct(p)
        const rel = await getProducts({ category: p.category }).catch(() => [])
        setRelated(rel.filter(r => r.id !== p.id).slice(0, 4))
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[3/4] bg-taupe/30 rounded-3xl" />
        <div className="flex flex-col gap-4 pt-4">
          <div className="h-3 w-24 bg-taupe/30 rounded-full" />
          <div className="h-10 w-3/4 bg-taupe/40 rounded-xl" />
          <div className="h-4 w-full bg-taupe/30 rounded-full" />
          <div className="h-4 w-2/3 bg-taupe/30 rounded-full" />
          <div className="h-8 w-1/4 bg-taupe/40 rounded-xl mt-4" />
          <div className="flex gap-3 mt-4">
            <div className="h-12 flex-1 bg-taupe/30 rounded-2xl" />
            <div className="h-12 flex-1 bg-taupe/30 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="max-w-md mx-auto text-center py-28 px-5">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="font-display text-2xl text-charcoal mb-2">Product not found</h2>
      <p className="text-muted mb-6">This item may have been removed or the link is incorrect.</p>
      <Link to="/" className="inline-flex items-center gap-2 bg-rose-gradient text-white font-semibold px-6 py-3 rounded-full shadow-btn">
        Back to Catalog
      </Link>
    </div>
  )

  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = () => {
    addToCart(product)
    toast(`"${product.name}" added to cart`)
  }

  const handleWishlist = () => {
    toggle(product)
    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist ♥')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast('Link copied!')
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-8">
          <Link to="/" className="hover:text-rose transition-colors">Home</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="hover:text-rose transition-colors cursor-pointer">{product.category}</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-charcoal/80 truncate max-w-[180px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Image */}
          <div
            className={`relative bg-cream rounded-3xl overflow-hidden cursor-zoom-in ${zoomed ? 'cursor-zoom-out' : ''} shadow-card`}
            onClick={() => setZoomed(v => !v)}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full object-cover transition-transform duration-700 ${zoomed ? 'scale-150' : 'scale-100'} ${!product.inStock ? 'opacity-50 grayscale' : ''}`}
              />
            ) : (
              <div className="aspect-[3/4] flex items-center justify-center text-muted/30">
                <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-charcoal/80 text-white text-sm font-medium px-5 py-2.5 rounded-full backdrop-blur-sm">Out of Stock</span>
              </div>
            )}
            {product.isNewArrival && (
              <span className="badge-new absolute top-4 left-4">New Arrival</span>
            )}
            <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
              {zoomed ? 'Click to zoom out' : 'Click to zoom'}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col lg:sticky lg:top-24 lg:self-start">
            <span className="text-xs font-semibold uppercase tracking-widest text-rose/80 mb-2">{product.category}</span>
            <h1 className="font-display text-3xl sm:text-4xl text-charcoal leading-tight mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-taupe text-muted'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-muted'}`} />
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.description && (
              <p className="text-charcoal/60 leading-relaxed mb-5 text-sm">{product.description}</p>
            )}

            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display text-4xl font-bold text-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
            </div>

            {product.inStock ? (
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-white font-semibold py-3.5 rounded-2xl hover:bg-charcoal/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Add to Cart
                </button>
                <a
                  href={buildOrderLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-rose-gradient text-white font-semibold py-3.5 rounded-2xl shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.348l-.37-.22-3.762.896.952-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  Buy on WhatsApp
                </a>
              </div>
            ) : (
              <button disabled className="mb-5 w-full bg-taupe text-muted font-medium py-3.5 rounded-2xl cursor-not-allowed">
                Currently Unavailable
              </button>
            )}

            {/* Secondary actions */}
            <div className="flex items-center gap-4 mb-6">
              <button onClick={handleWishlist}
                className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-rose transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"
                  fill={wishlisted ? '#C9184A' : 'none'} stroke={wishlisted ? '#C9184A' : 'currentColor'} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <span className="text-taupe">·</span>
              <button onClick={handleShare}
                className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>

            {/* Info pills */}
            <div className="bg-cream rounded-2xl p-4 flex flex-col gap-3">
              {[
                { icon: '🚚', text: 'Order via WhatsApp — we confirm & arrange delivery' },
                { icon: '💬', text: 'Questions? Message us anytime on WhatsApp' },
                { icon: '🔄', text: 'Easy exchange if there\'s an issue with your order' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 text-sm text-charcoal/60">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal mb-6">More from {product.category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
