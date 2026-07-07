import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useUserAuth } from '../context/UserAuthContext'

export default function MobileNav() {
  const { totalItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user } = useUserAuth()
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path))

  const navItems = [
    {
      to: '/',
      label: 'Home',
      exact: true,
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: '/products',
      label: 'Shop',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      to: '/search',
      label: 'Search',
      icon: (active) => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      to: '/wishlist',
      label: 'Wishlist',
      badge: wishlistItems.length,
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      to: user ? '/cart' : '/login',
      label: user ? 'Cart' : 'Login',
      badge: user ? totalItems : 0,
      icon: (active) => user ? (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  return (
    <nav aria-label="Mobile navigation" className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-taupe/50 shadow-glass safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2">
        {navItems.map(({ to, label, icon, badge, exact }) => {
          const active = exact ? pathname === to : isActive(to)
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center justify-center gap-1 flex-1 py-3 px-2 transition-colors ${
                active ? 'text-rose' : 'text-charcoal/40'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-rose rounded-full" />
              )}
              {icon(active)}
              <span className={`text-[11px] font-semibold ${active ? 'text-rose' : 'text-charcoal/40'}`}>{label}</span>
              {badge > 0 && (
                <span className="absolute top-2 right-1/4 w-5 h-5 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
