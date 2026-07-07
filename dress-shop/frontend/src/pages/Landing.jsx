import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getNewArrivals } from '../api'
import ProductCard from '../components/ProductCard'
import { buildGeneralInquiryLink } from '../utils/whatsapp'
import { CATEGORIES } from '../constants/categories'
import { CATEGORY_IMAGES } from '../constants/categoryImages'

const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'U99'


const WA_ICON = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.348l-.37-.22-3.762.896.952-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
)

const PIN_ICON = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export default function Landing() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getNewArrivals()])
      .then(([all, arrivals]) => {
        setProductCount(all.length)
        setFeatured(all.filter(p => p.inStock).slice(0, 6))
        setNewArrivals(arrivals)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-ivory pb-20 sm:pb-0">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-[500px] sm:h-[500px] bg-rose/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-12 sm:py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-5">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-white/80 text-xs font-semibold tracking-wide">New Collection · {new Date().getFullYear()}</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.1] mb-4">
            Your Style,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-yellow-200">
              Your Story.
            </span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
            {SHOP_NAME} — handpicked ethnic & western wear. Kurtis, maxi dresses, party wear and more. Browse freely, order on WhatsApp.
          </p>

          {/* CTA buttons — stacked on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link to="/products"
              className="flex items-center justify-center gap-2 bg-rose text-white font-bold px-8 py-4 rounded-2xl text-base shadow-btn active:scale-95 transition-transform">
              Explore Collection
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <div className="flex gap-3">
              <a href="https://maps.app.goo.gl/8T8vcAQA1fGKLUPH6" target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-5 py-4 rounded-2xl text-sm active:scale-95 transition-transform">
                {PIN_ICON} Visit Store
              </a>
              <a href={buildGeneralInquiryLink()} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-5 py-4 rounded-2xl text-sm active:scale-95 transition-transform">
                {WA_ICON} WhatsApp
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-6 border-t border-white/10">
            {[
              { value: productCount || '100+', label: 'Products' },
              { value: CATEGORIES.length, label: 'Categories' },
              { value: '500+', label: 'Customers' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-white/40 text-xs mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES — horizontal scroll on mobile ── */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">Shop by Category</h2>
            <Link to="/products" className="text-sm text-rose font-semibold">See all →</Link>
          </div>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 sm:grid sm:grid-cols-4 lg:grid-cols-7 sm:gap-4">
            {CATEGORIES.map(cat => {
              return (
                <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}
                  className="flex-shrink-0 group relative w-24 sm:w-auto rounded-2xl overflow-hidden shadow-card active:scale-95 transition-transform">
                  <div className="aspect-square bg-cream overflow-hidden">
                    {CATEGORY_IMAGES[cat]
                      ? <img src={CATEGORY_IMAGES[cat]} alt={cat} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
                    }
                  </div>
                  {/* Dark overlay + label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white text-[11px] sm:text-xs font-bold text-center leading-tight drop-shadow">{cat}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS — big cards ── */}
      {(loading || newArrivals.length > 0) && (
        <section className="py-6 sm:py-10 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-rose rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-rose">Just In</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">New Arrivals</h2>
              </div>
              <Link to="/products" className="text-sm text-rose font-semibold">View all →</Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card">
                    <div className="aspect-[3/4] shimmer" />
                    <div className="p-3 flex flex-col gap-2">
                      <div className="h-3 w-16 shimmer rounded-full" />
                      <div className="h-4 w-3/4 shimmer rounded-full" />
                      <div className="h-10 shimmer rounded-xl mt-1" />
                    </div>
                  </div>
                ))}
              </div>
              : (
              /* Use ProductCard for consistent styling and behavior */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {newArrivals.slice(0, 8).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <Link to="/products"
                className="inline-flex items-center gap-2 bg-rose text-white font-bold px-8 py-4 rounded-2xl text-base shadow-btn active:scale-95 transition-transform">
                Shop All New Arrivals
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      {(loading || featured.length > 0) && (
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">Featured Products</h2>
              <Link to="/products" className="text-sm text-rose font-semibold">View all →</Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card">
                    <div className="aspect-[3/4] shimmer" />
                    <div className="p-3 flex flex-col gap-2">
                      <div className="h-3 w-16 shimmer rounded-full" />
                      <div className="h-4 w-3/4 shimmer rounded-full" />
                      <div className="h-10 shimmer rounded-xl mt-1" />
                    </div>
                  </div>
                ))}
              </div>
              : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {featured.slice(0, 8).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <Link to="/products"
                className="inline-flex items-center gap-2 bg-charcoal text-white font-bold px-8 py-4 rounded-2xl text-base active:scale-95 transition-transform">
                Browse Full Catalog
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT ── */}
      <section className="bg-cream py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose mb-3 block">About {SHOP_NAME}</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-4 leading-tight">
                Fashion that feels like <span className="text-rose italic">home.</span>
              </h2>
              <p className="text-muted text-base leading-relaxed mb-4">
                {SHOP_NAME} is a local boutique bringing you the finest ethnic and western wear — curated for every occasion, from casual everyday looks to festive celebrations.
              </p>
              <p className="text-muted text-base leading-relaxed mb-6">
                Browse freely, pick what you love, and order directly on WhatsApp. No complicated checkout needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://maps.app.goo.gl/8T8vcAQA1fGKLUPH6" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-rose text-white font-bold px-6 py-4 rounded-2xl text-sm shadow-btn active:scale-95 transition-transform">
                  {PIN_ICON} Get Directions
                </a>
                <a href={buildGeneralInquiryLink()} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-taupe text-charcoal font-bold px-6 py-4 rounded-2xl text-sm active:scale-95 transition-transform">
                  {WA_ICON} Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🏪', title: 'Local Boutique', desc: 'Visit us in-store or browse online anytime' },
                { icon: '✨', title: 'Handpicked', desc: 'Every piece curated for quality and style' },
                { icon: '💬', title: 'WhatsApp Orders', desc: 'Simple ordering — just message us directly' },
                { icon: '🚚', title: 'Quick Delivery', desc: 'Fast confirmation and doorstep delivery' },
              ].map(f => (
                <div key={f.title} className="bg-white rounded-2xl p-4 sm:p-5 shadow-card">
                  <span className="text-3xl mb-3 block">{f.icon}</span>
                  <p className="font-bold text-charcoal text-sm sm:text-base mb-1">{f.title}</p>
                  <p className="text-muted text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-charcoal py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Simple Process</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">How to Order</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '01', icon: '🔍', title: 'Browse', desc: 'Explore our full catalog — filter by category, price, and availability.' },
              { step: '02', icon: '❤️', title: 'Pick & Save', desc: 'Add items to your cart or wishlist. No account needed to browse.' },
              { step: '03', icon: '💬', title: 'Order on WhatsApp', desc: 'Tap "Buy on WhatsApp" and we\'ll confirm your order and arrange delivery.' },
            ].map(s => (
              <div key={s.step} className="relative bg-white/5 border border-white/10 rounded-2xl p-6">
                <span className="font-display text-6xl font-bold text-white/5 absolute top-3 right-4">{s.step}</span>
                <span className="text-4xl mb-4 block">{s.icon}</span>
                <p className="font-bold text-white text-lg mb-2">{s.title}</p>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISIT US CTA ── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-br from-rose/5 to-pink-50 border border-rose/10 rounded-3xl p-6 sm:p-12">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-rose mb-2 block">Find Us</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3">Visit Our Store</h2>
              <p className="text-muted text-sm sm:text-base max-w-sm mx-auto">
                Come visit us in person to see the full collection. We'd love to help you find the perfect outfit.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://maps.app.goo.gl/8T8vcAQA1fGKLUPH6" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-rose text-white font-bold px-8 py-4 rounded-2xl text-base shadow-btn active:scale-95 transition-transform">
                {PIN_ICON} Get Directions
              </a>
              <a href={buildGeneralInquiryLink()} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white border-2 border-taupe text-charcoal font-bold px-8 py-4 rounded-2xl text-base active:scale-95 transition-transform">
                {WA_ICON} WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
