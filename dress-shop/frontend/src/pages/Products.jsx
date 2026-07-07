import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProducts, getNewArrivals } from '../api'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import { buildGeneralInquiryLink } from '../utils/whatsapp'
import { CATEGORIES } from '../constants/categories'
import { CATEGORY_IMAGES } from '../constants/categoryImages'

const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'U99'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'name_asc', label: 'A → Z' },
]

const PANTS_SIZES = ['24', '26', '28', '30', '32', '34', '36', '38', '40']
const TOP_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

function getSizeOptions(category) {
  if (!category) return []
  const value = category.toLowerCase()
  if (/(pant|legging|jegging|short|night pants)/i.test(value)) return PANTS_SIZES
  if (/(top|shirt|kurti|maxi|dress|skirt|party wear|crop)/i.test(value)) return TOP_SIZES
  return []
}

function matchesSelectedSize(product, selectedSize) {
  if (!selectedSize || selectedSize === 'All') return true
  const sizeMeta = [product.size, product.sizes, product.sizeOptions, product.attributes?.size]
    .flatMap(value => Array.isArray(value) ? value : value ? [value] : [])
    .map(value => String(value).trim())
    .filter(Boolean)

  if (sizeMeta.length === 0) return true

  const normalized = sizeMeta.map(item => item.toLowerCase())
  return normalized.includes(selectedSize.toLowerCase())
}

export default function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [sort, setSort] = useState('newest')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [maxPossible, setMaxPossible] = useState(10000)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSize, setSelectedSize] = useState('All')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([getProducts(), getNewArrivals()])
      .then(([all, arrivals]) => {
        if (cancelled) return
        setProducts(all)
        setNewArrivals(arrivals)
        const max = Math.ceil(Math.max(...all.map(p => p.price), 1000) / 500) * 500
        setMaxPossible(max)
        setPriceRange([0, max])
        setError(null)
      })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    setSelectedSize('All')
  }, [activeCategory])

  const categories = useMemo(() => {
    const present = new Set(products.map(p => p.category))
    return ['All', ...CATEGORIES.filter(c => present.has(c))]
  }, [products])

  const sizeOptions = useMemo(() => {
    if (activeCategory === 'All') return []
    return ['All', ...getSizeOptions(activeCategory)]
  }, [activeCategory])

  const filtered = useMemo(() => {
    let list = products
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory)
    if (inStockOnly) list = list.filter(p => p.inStock)
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (selectedSize !== 'All') list = list.filter(p => matchesSelectedSize(p, selectedSize))
    switch (sort) {
      case 'price_asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price_desc': return [...list].sort((a, b) => b.price - a.price)
      case 'name_asc': return [...list].sort((a, b) => a.name.localeCompare(b.name))
      default: return list
    }
  }, [products, activeCategory, sort, inStockOnly, priceRange, selectedSize])

  return (
    <div className="min-h-screen bg-ivory">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose/80 mb-2">Curated picks</p>
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal">Shop by Category</h1>
          </div>
          <a href="#catalog" className="text-sm text-rose font-medium hover:underline">View all →</a>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 group relative overflow-hidden rounded-2xl w-20 shadow-card active:scale-95 transition-transform cursor-pointer ${
                activeCategory === cat ? 'ring-2 ring-rose ring-offset-1' : ''
              }`}
            >
              <div className="aspect-square bg-cream overflow-hidden">
                {CATEGORY_IMAGES[cat]
                  ? <img src={CATEGORY_IMAGES[cat]} alt={cat} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl bg-cream">🛍️</div>
                }
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-1.5">
                <p className="text-white text-[10px] font-bold text-center leading-tight drop-shadow">{cat}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {!loading && !error && newArrivals.length > 0 && (
        <section id="new-arrivals" className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-charcoal">New Arrivals</h2>
              <p className="text-sm text-muted mt-1">{newArrivals.length} fresh pieces just added</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-rose/10 text-rose text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-rose rounded-full animate-pulse" />
              Just In
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {newArrivals.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section id="catalog" className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal">Full Catalog</h2>
            {!loading && <p className="text-sm text-muted mt-1">{filtered.length} products</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all ${showFilters ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-charcoal border-taupe hover:border-charcoal'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
              </svg>
              Filters
              {(activeCategory !== 'All' || inStockOnly || selectedSize !== 'All') && (
                <span className="w-2 h-2 bg-rose rounded-full" />
              )}
            </button>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-sm font-medium border border-taupe bg-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {showFilters && (
            <aside className="w-56 flex-shrink-0 hidden sm:block animate-slide-in">
              <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24 flex flex-col gap-5">
                <div>
                  <p className="font-semibold text-sm text-charcoal mb-3">Category</p>
                  <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto no-scrollbar">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={activeCategory === cat}
                          onChange={() => setActiveCategory(cat)}
                          className="accent-rose"
                        />
                        <span className={`text-sm transition-colors ${activeCategory === cat ? 'text-rose font-medium' : 'text-charcoal/70 group-hover:text-charcoal'}`}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {sizeOptions.length > 1 && (
                  <div>
                    <p className="font-semibold text-sm text-charcoal mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${selectedSize === size ? 'bg-rose text-white border-rose' : 'bg-cream text-charcoal border-taupe hover:border-rose'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-semibold text-sm text-charcoal mb-1">Max Price</p>
                  <p className="text-xs text-muted mb-3">Up to ₹{priceRange[1].toLocaleString('en-IN')}</p>
                  <input
                    type="range" min={0} max={maxPossible} step={100}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-rose"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>₹0</span>
                    <span>₹{maxPossible.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="accent-rose w-4 h-4 rounded"
                  />
                  <span className="text-sm text-charcoal/70">In Stock Only</span>
                </label>

                <button
                  onClick={() => { setActiveCategory('All'); setSelectedSize('All'); setInStockOnly(false); setPriceRange([0, maxPossible]); setSort('newest') }}
                  className="text-xs text-rose font-medium hover:underline text-left"
                >
                  Clear all filters
                </button>
              </div>
            </aside>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setActiveCategory('All')}
                className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                  activeCategory === 'All'
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-white text-charcoal/60 border-taupe hover:border-charcoal hover:text-charcoal'
                }`}
              >
                All
              </button>
              {categories.filter(c => c !== 'All').map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 group relative overflow-hidden rounded-xl w-16 h-16 shadow-card active:scale-95 transition-transform ${
                    activeCategory === cat ? 'ring-2 ring-rose ring-offset-1' : ''
                  }`}
                >
                  <div className="w-full h-full bg-cream overflow-hidden">
                    {CATEGORY_IMAGES[cat]
                      ? <img src={CATEGORY_IMAGES[cat]} alt={cat} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                    }
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-1 pb-1">
                    <p className="text-white text-[9px] font-bold text-center leading-tight drop-shadow line-clamp-2">{cat}</p>
                  </div>
                </button>
              ))}
            </div>

            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-charcoal/70 mb-4">Could not load products. Please refresh or message us.</p>
                <a href={buildGeneralInquiryLink()} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-rose-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-btn hover:shadow-lg transition-all">
                  Contact support
                </a>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-charcoal/60 mb-2">No products match your filters.</p>
                <button onClick={() => { setActiveCategory('All'); setSelectedSize('All'); setInStockOnly(false); setPriceRange([0, maxPossible]) }}
                  className="text-sm text-rose font-medium hover:underline">Clear filters</button>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-up">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-charcoal mt-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '💳', title: 'Secure Checkout', desc: 'Pay safely online with fast confirmation' },
            { icon: '🚚', title: 'Fast Delivery', desc: 'We confirm and arrange delivery quickly' },
            { icon: '✅', title: 'Quality Assured', desc: 'Every piece is handpicked with care' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-4">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm">{f.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
