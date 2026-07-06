import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useUserAuth } from '../context/UserAuthContext'
import { getProducts } from '../api'

const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'U99'

export default function Navbar() {
  const { totalItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user, logout } = useUserAuth()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const debounceRef = useRef(null)
  const searchRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleQueryChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setSuggestions([]); setShowSuggestions(false); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await getProducts({ search: val })
        setSuggestions(results.slice(0, 6))
        setShowSuggestions(true)
      } catch { setSuggestions([]) }
    }, 280)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const pickSuggestion = (product) => {
    setShowSuggestions(false)
    setQuery('')
    navigate(`/products/${product.id}`)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : ''

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-glass border-b border-taupe/40' : 'bg-white border-b border-taupe/60'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center gap-3 sm:gap-6">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
          <div className="w-8 h-8 bg-rose-gradient rounded-lg flex items-center justify-center shadow-btn">
            <span className="text-white font-display font-bold text-sm">U</span>
          </div>
          <span className="font-display text-xl sm:text-2xl font-bold text-charcoal tracking-tight group-hover:text-rose transition-colors">
            {SHOP_NAME}
          </span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 relative max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search dresses, kurtis…"
              className="w-full bg-cream border border-taupe rounded-full pl-10 pr-4 py-2.5 sm:py-3 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose transition-all"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false) }}
                className="absolute inset-y-0 right-3.5 flex items-center text-muted hover:text-charcoal">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-card-hover border border-taupe/50 overflow-hidden z-50 animate-fade-up">
              {suggestions.map((p, i) => (
                <button key={p.id} onClick={() => pickSuggestion(p)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-cream text-left transition-colors ${i !== 0 ? 'border-t border-taupe/30' : ''}`}>
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-muted text-xs">?</div>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                    <p className="text-xs text-muted">{p.category} · ₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                  <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right icons */}
        <nav className="flex items-center gap-1 flex-shrink-0">

          {/* Wishlist */}
          <Link to="/wishlist"
            className={`hidden sm:flex relative items-center justify-center w-10 h-10 rounded-full transition-all hover:bg-cream ${pathname === '/wishlist' ? 'text-rose' : 'text-charcoal/60 hover:text-charcoal'}`}
            title="Wishlist">
            <svg className="w-5 h-5" fill={pathname === '/wishlist' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistItems.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart"
            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all hover:bg-cream ${pathname === '/cart' ? 'text-rose' : 'text-charcoal/60 hover:text-charcoal'}`}
            title="Cart">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* User — Login button or Avatar dropdown */}
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-cream transition-all"
              >
                <div className="w-8 h-8 bg-rose-gradient rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-charcoal max-w-[80px] truncate">
                  {user.name?.split(' ')[0]}
                </span>
                <svg className="w-3.5 h-3.5 text-muted hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-taupe/50 overflow-hidden z-50 animate-fade-up">
                  <div className="px-4 py-3 border-b border-taupe/40">
                    <p className="font-semibold text-charcoal text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { label: 'My Orders', to: '/orders', icon: '📦' },
                      { label: 'My Wishlist', to: '/wishlist', icon: '♥' },
                      { label: 'My Cart', to: '/cart', icon: '🛍' },
                    ].map(item => (
                      <Link key={item.to} to={item.to}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal/70 hover:bg-cream hover:text-charcoal transition-colors">
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-taupe/40 py-1">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose hover:bg-rose/5 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <Link to="/login"
                className="inline-flex items-center gap-1.5 border border-rose text-rose text-sm font-semibold px-4 py-2 rounded-full hover:bg-rose/5 transition-all">
                Login
              </Link>
              <Link to="/register"
                className="inline-flex items-center gap-1.5 bg-rose-gradient text-white text-sm font-semibold px-4 py-2 rounded-full shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Sub nav — desktop only */}
      <div className="hidden sm:block border-t border-taupe/40 bg-white/80">
        <div className="max-w-7xl mx-auto px-8 flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
          {[
            { label: 'Home', to: '/' },
            { label: 'Products', to: '/products' },
            { label: 'New Arrivals', to: '/products?new=1' },
          ].map(({ label, to }) => (
            <Link key={label} to={to}
              className={`text-xs font-semibold whitespace-nowrap transition-colors pb-0.5 border-b-2 ${
                pathname === to ? 'text-rose border-rose' : 'text-muted border-transparent hover:text-charcoal hover:border-taupe'
              }`}
            >{label}</Link>
          ))}
        </div>
      </div>
    </header>
  )
}
