import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { Homepage } from '@/app/components/Homepage';
import { ProductList } from '@/app/components/ProductList';
import { ProductDetail } from '@/pages/ProductDetail';
import { Cart } from '@/pages/Cart';
import { Wishlist } from '@/pages/Wishlist';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { Checkout } from '@/pages/Checkout';
import { OrderDetail } from '@/pages/OrderDetail';
import { Orders } from '@/pages/Orders';
import { SellerDashboard } from '@/pages/SellerDashboard';
import { SellerOrders } from '@/pages/SellerOrders';
import { MyProfile } from '@/pages/MyProfile';
import { MyAddresses } from '@/pages/MyAddresses';
import { AccountSettings } from '@/pages/AccountSettings';
import { About } from '@/pages/About';
import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';
import { HelpCenter } from '@/pages/HelpCenter';
import { ShippingInfo } from '@/pages/ShippingInfo';
import { Returns } from '@/pages/Returns';
import { ContactUs } from '@/pages/ContactUs';
import { Support } from '@/pages/Support';
import Artisans from '@/pages/Artisans';
import { ArtisanProfilePage } from '@/pages/ArtisanProfilePage';
import { Toaster } from '@/app/components/ui/sonner';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            <div className="min-h-screen bg-white">
              <Header />
              
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/seller/login" element={<Login mode="seller" />} />
                <Route path="/seller/signup" element={<Signup mode="seller" />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/support" element={<Support />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/shipping-info" element={<ShippingInfo />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/artisans" element={<Artisans />} />
                <Route path="/artisans/:artisanId" element={<ArtisanProfilePage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <MyProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addresses"
                  element={
                    <ProtectedRoute>
                      <MyAddresses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <AccountSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute requireSeller>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/orders"
                  element={
                    <ProtectedRoute requireSeller>
                      <SellerOrders />
                    </ProtectedRoute>
                  }
                />
              </Routes>

              <Toaster position="bottom-right" />

              {/* Footer */}
              <footer style={{ backgroundColor: '#2A2A2A', color: 'white' }} className="py-12 mt-20">
                <div className="container mx-auto px-4">
                  <div className="grid md:grid-cols-4 gap-8">
                    <div>
                      <div className="mb-4">
                        <span className="text-xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Kinara</span>
                      </div>
                      <p className="text-white/80 text-sm">
                        Empowering artisans, preserving traditions, connecting communities.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Shop</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="/products" className="hover:text-white">All Products</a></li>
                        <li><a href="/products?category=sarees" className="hover:text-white">Sarees</a></li>
                        <li><a href="/products?category=jewelry" className="hover:text-white">Jewelry</a></li>
                        <li><a href="/products?category=handicrafts" className="hover:text-white">Handicrafts</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Support</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="/support" className="hover:text-white">Support Home</a></li>
                        <li><a href="/help-center" className="hover:text-white">Help Center</a></li>
                        <li><a href="/shipping-info" className="hover:text-white">Shipping Info</a></li>
                        <li><a href="/returns" className="hover:text-white">Returns</a></li>
                        <li><a href="/contact-us" className="hover:text-white">Contact Us</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">About</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="/about#story" className="hover:text-white">Our Story</a></li>
                        <li><a href="/artisans" className="hover:text-white">Artisans</a></li>
                        <li><a href="/seller/signup" className="hover:text-white">Become a Seller</a></li>
                        <li><a href="/blog" className="hover:text-white">Blog</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t mt-12 pt-8 text-center text-sm" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <p>© 2026 Kinara. All rights reserved. Made with ❤️ for artisans.</p>
                  </div>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}
