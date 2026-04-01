import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Heart, X, LogOut, ChevronDown, Package, MapPin, Settings, Store } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';

// ─── Helpers ───────────────────────────────────────────────
/** Safely read and parse the user object from localStorage */
function getSafeUser(): Record<string, any> | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

/** Resolve display name with fallback chain: name → firstName → email → "User" */
function getDisplayName(user: Record<string, any> | null | undefined): string {
  if (!user) return 'User';
  const name = user.name || user.firstName || '';
  if (name) return name;
  if (user.email) return user.email.split('@')[0];
  return 'User';
}

/** Get first name only */
function getFirstName(user: Record<string, any> | null | undefined): string {
  const full = getDisplayName(user);
  return full.split(' ')[0];
}

/** Get avatar initial */
function getInitial(user: Record<string, any> | null | undefined): string {
  return getDisplayName(user).charAt(0).toUpperCase();
}

export function Header() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect login state defensively
  const token = localStorage.getItem('token');
  const localUser = getSafeUser();
  const activeUser = user || localUser;
  const isLoggedIn = !!token && !!activeUser;
  const isSeller = activeUser?.role === 'seller';

  // Close dropdown on outside click
  useEffect(() => {
    if (!profileMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    if (!profileMenuOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setProfileMenuOpen(false);
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [profileMenuOpen]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    setProfileMenuOpen(false);
    navigate('/');
    window.location.reload();
  }, [logout, navigate]);

  const handleMenuNav = useCallback((path: string) => {
    setProfileMenuOpen(false);
    navigate(path);
  }, [navigate]);

  // ─── Avatar Component ──────────────────────────────────
  const Avatar = ({ size = 36 }: { size?: number }) => (
    activeUser?.avatar ? (
      <img
        src={activeUser.avatar}
        alt={getDisplayName(activeUser)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      />
    ) : (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e67e22, #d35400)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 600,
          fontSize: size * 0.44,
          fontFamily: 'Poppins, sans-serif',
          flexShrink: 0,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
        aria-hidden="true"
      >
        {getInitial(activeUser)}
      </div>
    )
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - text only */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
            <span className="text-2xl font-semibold" style={{ color: 'var(--kinara-brown-primary)', fontFamily: 'Georgia, serif' }}>Kinara</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for clothing, artisans..."
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm hover:text-orange-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm hover:text-orange-600 transition-colors">
              Products
            </Link>
            <Link to="/artisans" className="text-sm hover:text-orange-600 transition-colors">
              Artisans
            </Link>
            <Link to="/about" className="text-sm hover:text-orange-600 transition-colors">
              About
            </Link>
            <Link to="/support" className="text-sm hover:text-orange-600 transition-colors">
              Support
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex relative"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItems.length}
                </Badge>
              )}
            </Button>

            {/* ─── User Account Dropdown (Desktop) ─── */}
            {isLoggedIn ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                {/* Trigger */}
                <button
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <Avatar size={32} />
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Hi, {getFirstName(activeUser)}
                  </span>
                  <ChevronDown
                    className="h-3.5 w-3.5 text-gray-500 transition-transform"
                    style={{ transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: 280,
                      background: '#fff',
                      borderRadius: 12,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                      border: '1px solid #e5e7eb',
                      zIndex: 9999,
                      overflow: 'hidden',
                      animation: 'dropdownSlideIn 0.18s ease-out',
                    }}
                    role="menu"
                    aria-label="User account menu"
                  >
                    {/* ── Top User Card ── */}
                    <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar size={44} />
                        <div style={{ overflow: 'hidden' }}>
                          <p style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', fontFamily: 'Poppins, sans-serif', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {getDisplayName(activeUser)}
                          </p>
                          <p style={{ fontSize: 12, color: '#717182', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {activeUser?.email || ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ── Menu Items ── */}
                    <div style={{ padding: '6px 0' }}>
                      <DropdownItem icon={<User className="h-4 w-4" />} label="My Profile" onClick={() => handleMenuNav('/profile')} />
                      {isSeller && (
                        <DropdownItem icon={<Store className="h-4 w-4" />} label="Seller Dashboard" onClick={() => handleMenuNav('/seller/dashboard')} />
                      )}
                      <DropdownItem icon={<Package className="h-4 w-4" />} label="My Orders" onClick={() => handleMenuNav('/orders')} />
                      <DropdownItem icon={<MapPin className="h-4 w-4" />} label="My Addresses" onClick={() => handleMenuNav('/addresses')} />
                      <DropdownItem icon={<Settings className="h-4 w-4" />} label="Account Settings" onClick={() => handleMenuNav('/account')} />
                    </div>

                    {/* ── Divider ── */}
                    <div style={{ height: 1, background: '#f0f0f0', margin: '0 12px' }} />

                    {/* ── Logout ── */}
                    <div style={{ padding: '6px 0 8px' }}>
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          padding: '10px 16px',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontFamily: 'Poppins, sans-serif',
                          color: '#dc2626',
                          fontWeight: 500,
                          transition: 'background 0.15s ease',
                          borderRadius: 0,
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="primaryBlack"
                  size="sm"
                  onClick={() => navigate('/seller/login')}
                >
                  <Store className="mr-2 h-4 w-4" />
                  Seller
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm hover:text-orange-600 transition-colors px-2 py-2"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm hover:text-orange-600 transition-colors px-2 py-2"
              >
                Products
              </Link>
              <Link
                to={isSeller ? '/seller/dashboard' : '/seller/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm hover:text-orange-600 transition-colors px-2 py-2"
              >
                {isSeller ? 'Seller Dashboard' : 'Become a Seller'}
              </Link>
              <Link
                to="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm hover:text-orange-600 transition-colors px-2 py-2"
              >
                Support
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm hover:text-orange-600 transition-colors px-2 py-2 flex items-center justify-between"
              >
                Cart
                {cartItems.length > 0 && (
                  <Badge className="bg-orange-600">{cartItems.length}</Badge>
                )}
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm hover:text-orange-600 transition-colors px-2 py-2 flex items-center justify-between"
              >
                Wishlist
                {wishlistItems.length > 0 && (
                  <Badge className="bg-orange-600">{wishlistItems.length}</Badge>
                )}
              </Link>
              {isLoggedIn ? (
                <>
                  {/* Mobile user card */}
                  <div className="flex items-center gap-3 px-2 py-2 border-t border-b border-gray-100">
                    <Avatar size={32} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{getDisplayName(activeUser)}</p>
                      <p className="text-xs text-gray-500">{activeUser?.email || ''}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm hover:text-orange-600 transition-colors px-2 py-2 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm hover:text-orange-600 transition-colors px-2 py-2 flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                  {isSeller && (
                    <Link
                      to="/seller/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm hover:text-orange-600 transition-colors px-2 py-2 flex items-center gap-2"
                    >
                      <Store className="h-4 w-4" /> Seller Dashboard
                    </Link>
                  )}
                  <Link
                    to="/addresses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm hover:text-orange-600 transition-colors px-2 py-2 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" /> My Addresses
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm hover:text-orange-600 transition-colors px-2 py-2 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" /> Account Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors px-2 py-2 text-left flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/seller/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm hover:text-orange-600 transition-colors px-2 py-2"
                  >
                    Become a Seller
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm hover:text-orange-600 transition-colors px-2 py-2"
                  >
                    Login / Signup
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Animation keyframes injected once */}
      <style>{`
        @keyframes dropdownSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}

// ─── Internal DropdownItem ─────────────────────────────────
function DropdownItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '10px 16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: 'Poppins, sans-serif',
        color: '#374151',
        fontWeight: 400,
        transition: 'background 0.15s ease',
        borderRadius: 0,
        textAlign: 'left',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ color: '#9ca3af', display: 'flex', alignItems: 'center' }}>{icon}</span>
      {label}
    </button>
  );
}
