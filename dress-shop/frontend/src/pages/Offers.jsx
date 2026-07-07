import { Link } from 'react-router-dom'

export default function Offers() {
  return (
    <div className="bg-ivory min-h-[70vh] flex flex-col items-center justify-center px-5 py-20 text-center">
      <div className="w-20 h-20 bg-rose/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🎁</span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose/80 mb-3">Coming Soon</p>
      <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-3">Offers</h1>
      <p className="text-muted text-base max-w-sm leading-relaxed mb-8">
        Special offers will be available soon. Check back later for exclusive deals and discounts!
      </p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 bg-rose-gradient text-white font-semibold px-7 py-3.5 rounded-full shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        Browse Collection
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  )
}
