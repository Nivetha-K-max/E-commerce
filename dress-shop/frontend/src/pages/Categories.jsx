import { Link } from 'react-router-dom'
import { CATEGORIES } from '../constants/categories'
import { CATEGORY_IMAGES } from '../constants/categoryImages'

export default function Categories() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose/80 mb-2">Women's Fashion</p>
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal">Shop by Category</h1>
          <p className="text-muted text-sm mt-2">Browse our full range of women's clothing categories.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover active:scale-95 transition-all duration-200"
            >
              <div className="aspect-square bg-cream overflow-hidden">
                {CATEGORY_IMAGES[cat] ? (
                  <img
                    src={CATEGORY_IMAGES[cat]}
                    alt={cat}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-cream">🛍️</div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs sm:text-sm font-bold text-center leading-tight drop-shadow">{cat}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
