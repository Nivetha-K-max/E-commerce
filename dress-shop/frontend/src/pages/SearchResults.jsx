import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getProducts } from '../api'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'name_asc', label: 'A → Z' },
]

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    if (!query.trim()) { setProducts([]); setLoading(false); return }
    setLoading(true)
    getProducts({ search: query, sort })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [query, sort])

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal">
              {query ? <>Results for <span className="text-rose">"{query}"</span></> : 'Search'}
            </h1>
            {!loading && (
              <p className="text-sm text-muted mt-1">{products.length} products found</p>
            )}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-sm font-medium border border-taupe bg-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <p className="font-display text-xl text-charcoal mb-2">No results for "{query}"</p>
            <p className="text-muted text-sm mb-8">Try a different keyword or browse the full catalog.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-rose-gradient text-white font-semibold px-6 py-3 rounded-full shadow-btn hover:shadow-lg transition-all">
              Browse Catalog
            </Link>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-up">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
