import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getNewArrivals } from '../api'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import { buildGeneralInquiryLink } from '../utils/whatsapp'
import { CATEGORIES } from '../constants/categories'

const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'U99'

const CATEGORY_META = {
  'Kurtis Set': { icon: '👗', color: 'from-pink-50 to-rose-50', accent: '#C9184A' },
  'Palazzo Pant': { icon: '👖', color: 'from-purple-50 to-indigo-50', accent: '#7C3AED' },
  'Jeggings': { icon: '🩱', color: 'from-blue-50 to-cyan-50', accent: '#0891B2' },
  'Leggings': { icon: '🩲', color: 'from-teal-50 to-green-50', accent: '#059669' },
  'Western Top': { icon: '👚', color: 'from-orange-50 to-amber-50', accent: '#D97706' },
  'Maxi': { icon: '👘', color: 'from-rose-50 to-pink-50', accent: '#E11D48' },
  'Party Wear': { icon: '✨', color: 'from-yellow-50 to-amber-50', accent: '#B45309' },
  'Skirts': { icon: '🩴', color: 'from-lime-50 to-green-50', accent: '#65A30D' },
  'Night Suit': { icon: '🌙', color: 'from-indigo-50 to-violet-50', accent: '#6D28D9' },
  'Night Pants': { icon: '😴', color: 'from-slate-50 to-blue-50', accent: '#475569' },
  'Shorts': { icon: '🩳', color: 'from-sky-50 to-blue-50', accent: '#0284C7' },
  'T Shirt': { icon: '👕', color: 'from-emerald-50 to-teal-50', accent: '#047857' },
  'Crop T Shirt': { icon: '🎽', color: 'from-fuchsia-50 to-pink-50', accent: '#A21CAF' },
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'name_asc', label: 'A → Z' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [maxPossible, setMaxPossible] = useState(10000)
  const [showFilters, setShowFilters] = useState(false)

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

  const categories = useMemo(() => {
    const present = new Set(products.map(p => p.category))
    return ['All', ...CATEGORIES.filter(c => present.has(c))]
  }, [products])

  const filtered = useMemo(() => {
    let list = products
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory)
    if (inStockOnly) list = list.filter(p => p.inStock)
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sort) {
      case 'price_asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price_desc': return [...list].sort((a, b) => b.price - a.price)
      case 'name_asc': return [...list].sort((a, b) => a.name.localeCompare(b.name))
      default: return list
    }
  }, [products, activeCategory, sort, inStockOnly, priceRange])

  return (
    <div className="min-h-screen bg-ivory">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-hero-gradient">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-white/80 text-xs font-medium tracking-wide">New Collection Available</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] mb-5">
              Fashion for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-300">
                every moment.
              </span>
            </h1>

            <p className="text-white/60 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              Discover {SHOP_NAME}'s handpicked collection. Browse, pick what you love, and order directly on WhatsApp — no account needed.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#catalog"
                className="inline-flex items-center gap-2 bg-rose-gradient text-white font-semibold px-6 py-3 rounded-full shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Shop Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#new-arrivals"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-medium px-6 py-3 rounded-full hover:bg-white/20 transition-all">
                New Arrivals
              </a>
              <a href={buildGeneralInquiryLink()} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-medium px-6 py-3 rounded-full hover:bg-white/20 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.348l-.37-.22-3.762.896.952-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-12 pt-10 border-t border-white/10">
            {[
              { label: 'Products', value: products.length || '100+' },
              { label: 'Categories', value: categories.length - 1 || '13' },
              { label: 'Happy Customers', value: '500+' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl sm:text-3xl text-charcoal">Shop by Category</h2>
          <a href="#catalog" className="text-sm text-rose font-medium hover:underline">View all →</a>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat] || { icon: '🛍️', color: 'from-gray-50 to-slate-50', accent: '#6B7280' }
            return (
              <a
                key={cat}
                href="#catalog"
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 bg-gradient-to-br ${meta.color} border border-white rounded-2xl px-5 py-4 hover:shadow-card hover:-translate-y-0.5 transition-all group cursor-pointer`}
              >
                <span className="text-2xl">{meta.icon}</span>
                <span className="text-xs font-medium text-charcoal/70 group-hover:text-charcoal whitespace-nowrap transition-colors">{cat}</span>
              </a>
            )
          })}
        </div>
      </section>

      {/* ── New Arrivals ── */}
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
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-5">
            {newArrivals.map(p => (
              <div key={p.id} className="flex-shrink-0 w-44 sm:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Full Catalog ── */}
      <section id="catalog" className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {/* Toolbar */}
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
              {(activeCategory !== 'All' || inStockOnly) && (
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
          {/* Filter Sidebar */}
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
                  onClick={() => { setActiveCategory('All'); setInStockOnly(false); setPriceRange([0, maxPossible]); setSort('newest') }}
                  className="text-xs text-rose font-medium hover:underline text-left"
                >
                  Clear all filters
                </button>
              </div>
            </aside>
          )}

          <div className="flex-1 min-w-0">
            {/* Category chips */}
            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full border transition-all ${
                    activeCategory === cat
                      ? 'bg-charcoal text-white border-charcoal shadow-sm'
                      : 'bg-white text-charcoal/60 border-taupe hover:border-charcoal hover:text-charcoal'
                  }`}
                >
                  {cat}
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
                  Message us on WhatsApp
                </a>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-charcoal/60 mb-2">No products match your filters.</p>
                <button onClick={() => { setActiveCategory('All'); setInStockOnly(false); setPriceRange([0, maxPossible]) }}
                  className="text-sm text-rose font-medium hover:underline">Clear filters</button>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-up">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Trust Banner ── */}
      <section className="bg-charcoal mt-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '💬', title: 'WhatsApp Ordering', desc: 'Order directly — no account, no hassle' },
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
