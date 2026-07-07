import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ToastProvider } from './context/ToastContext'
import { UserAuthProvider } from './context/UserAuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import MobileNav from './components/MobileNav'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import SearchResults from './pages/SearchResults'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Orders from './pages/Orders'
import Contact from './pages/Contact'
import Sale from './pages/Sale'
import Offers from './pages/Offers'
import Categories from './pages/Categories'
import Payment from './pages/Payment'
import OrderConfirmation from './pages/OrderConfirmation'
import NewArrivals from './pages/NewArrivals'

export default function App() {
  return (
    <UserAuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-ivory">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/sale" element={<Sale />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/new-arrivals" element={<NewArrivals />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
              <BackToTop />
              <MobileNav />
            </div>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </UserAuthProvider>
  )
}
