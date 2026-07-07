import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProduct, getProducts } from '../api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [zoomed, setZoomed] = useState(false)
  const [selected, setSelected] = useState(0)
  const { addToCart } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
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

          {/* Image gallery */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="hidden lg:flex lg:flex-col gap-3 w-20">
              {(product.images || [product.imageUrl]).map((src, idx) => (
                <button key={idx} onClick={() => setSelected(idx)} className={`w-20 h-28 overflow-hidden rounded-lg ${selected===idx? 'ring-2 ring-rose' : ''}`}>
                  <img src={src} alt={`${product.name} ${idx+1}`} loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div
              className={`relative flex-1 bg-cream rounded-3xl overflow-hidden cursor-zoom-in ${zoomed ? 'cursor-zoom-out' : ''} shadow-card`}
              onClick={() => setZoomed(v => !v)}
            >
              { (product.images || [product.imageUrl]).map((src, idx) => (
                <img key={idx}
                  src={src}
                  alt={product.name}
                  loading="lazy"
                  style={{ display: idx === selected ? 'block' : 'none' }}
                  className={`w-full h-[min(70vh,800px)] object-cover transition-transform duration-700 ${zoomed ? 'scale-150' : 'scale-100'} ${!product.inStock ? 'opacity-50 grayscale' : ''}`}
                />
              ))}

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

            {/* thumbnails for mobile */}
            <div className="lg:hidden mt-2 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {(product.images || [product.imageUrl]).map((src, idx) => (
                <button key={idx} onClick={() => setSelected(idx)} className={`w-28 h-36 rounded-lg overflow-hidden flex-shrink-0 ${selected===idx? 'ring-2 ring-rose' : ''}`}>
                  <img src={src} alt={`${product.name} ${idx+1}`} loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
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

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl sm:text-5xl font-bold text-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-muted line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              )}
              {product.mrp && product.mrp > product.price && (
                <span className="ml-2 inline-flex items-center text-xs font-bold bg-rose/10 text-rose px-2 py-1 rounded">Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}</span>
              )}
            </div>

            {product.inStock ? (
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <Button onClick={handleAddToCart} className="flex-1" variant="secondary">Add to Cart</Button>
                <Button onClick={() => { handleAddToCart(); navigate('/checkout') }} className="flex-1" variant="primary">Buy Now</Button>
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
                { icon: '💳', text: 'Secure online payment — no COD available' },
                { icon: '🚚', text: 'Fast delivery after payment confirmation' },
                { icon: '✅', text: 'No refunds or returns — please check before ordering' },
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
