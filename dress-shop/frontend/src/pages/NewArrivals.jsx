import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNewArrivals } from '../api'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'

export default function NewArrivals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)

  useEffect(() => {
    getNewArrivals()
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-rose rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose">Just In</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-charcoal">New Arrivals</h1>
            {!loading && !error && (
              <p className="text-muted text-sm mt-1">{products.length} fresh pieces just added</p>
            )}
          </div>
          <Link to="/products" className="text-sm text-rose font-medium hover:underline hidden sm:block">
            View all products →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-charcoal/60 mb-4">Could not load new arrivals. Please try again.</p>
            <button
              onClick={() => { setError(false); setLoading(true); getNewArrivals().then(setProducts).catch(() => setError(true)).finally(() => setLoading(false)) }}
              className="text-sm text-rose font-medium hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-charcoal/60 mb-4">No new arrivals at the moment. Check back soon!</p>
            <Link to="/products" className="text-sm text-rose font-medium hover:underline">
              Browse full catalog
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-rose-gradient text-white font-semibold px-8 py-3.5 rounded-full shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Browse Full Catalog
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
