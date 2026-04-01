# 🏗️ Handmade Products Marketplace - Frontend Architecture

## Table of Contents
1. [Folder Structure](#folder-structure)
2. [State Management](#state-management)
3. [Route Configuration](#route-configuration)
4. [Component Architecture](#component-architecture)
5. [Custom Hooks Strategy](#custom-hooks-strategy)
6. [Data Flow](#data-flow)
7. [Best Practices](#best-practices)
8. [Scalability Guidelines](#scalability-guidelines)

---

## 📂 Folder Structure

```
src/
├── app/
│   ├── App.tsx                    # Main app component with providers
│   ├── App.css
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx         # Navigation header with search
│       │   ├── Footer.tsx         # Footer with links
│       │   ├── Sidebar.tsx        # Optional sidebar for filters
│       │   └── MainLayout.tsx     # Wrapper for main pages
│       ├── common/
│       │   ├── NotFound.tsx       # 404 page
│       │   ├── LoadingSpinner.tsx # Global loading component
│       │   └── ErrorBoundary.tsx  # Error handling
│       ├── ui/                    # shadcn/ui components (already present)
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   ├── input.tsx
│       │   └── ... (other UI components)
│       └── forms/
│           ├── LoginForm.tsx
│           ├── SignupForm.tsx
│           ├── AddressForm.tsx
│           └── ProductForm.tsx
│
├── pages/
│   ├── customer/
│   │   ├── home/
│   │   │   └── HomePage.tsx
│   │   ├── products/
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   └── components/
│   │   │       ├── ProductCard.tsx
│   │   │       ├── ProductFilters.tsx
│   │   │       ├── ProductSearch.tsx
│   │   │       ├── SortOptions.tsx
│   │   │       └── ImageGallery.tsx
│   │   ├── cart/
│   │   │   ├── CartPage.tsx
│   │   │   └── components/
│   │   │       ├── CartItem.tsx
│   │   │       ├── CartSummary.tsx
│   │   │       └── EmptyCart.tsx
│   │   ├── wishlist/
│   │   │   ├── WishlistPage.tsx
│   │   │   └── components/
│   │   │       ├── WishlistItem.tsx
│   │   │       └── EmptyWishlist.tsx
│   │   ├── artisans/
│   │   │   ├── ArtisansPage.tsx
│   │   │   ├── ArtisanDetailPage.tsx
│   │   │   └── components/
│   │   │       ├── ArtisanCard.tsx
│   │   │       ├── ArtisanHeader.tsx
│   │   │       └── ArtisanProductsList.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── components/
│   │   │       ├── CheckoutSteps.tsx
│   │   │       ├── ShippingInfo.tsx
│   │   │       ├── PaymentMethod.tsx
│   │   │       └── OrderSummary.tsx
│   │   ├── orders/
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── OrderDetailPage.tsx
│   │   │   └── components/
│   │   │       ├── OrderCard.tsx
│   │   │       ├── OrderTimeline.tsx
│   │   │       └── TrackingInfo.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   └── static/
│   │       ├── AboutPage.tsx
│   │       └── HelpPage.tsx
│   │
│   ├── seller/
│   │   ├── become-seller/
│   │   │   ├── BecomeSellerPage.tsx
│   │   │   └── components/
│   │   │       ├── SellerRegistrationForm.tsx
│   │   │       └── BenefitsSection.tsx
│   │   └── dashboard/
│   │       ├── DashboardPage.tsx
│   │       ├── components/
│   │       │   ├── ProductManagement.tsx
│   │       │   ├── OrderManagement.tsx
│   │       │   ├── Analytics.tsx
│   │       │   ├── InventoryTable.tsx
│   │       │   └── SalesChart.tsx
│   │       └── modals/
│   │           ├── AddProductModal.tsx
│   │           └── EditProductModal.tsx
│   │
│   └── admin/
│       ├── AdminDashboard.tsx
│       └── components/
│           ├── UserManagement.tsx
│           └── SalesAnalytics.tsx
│
├── contexts/
│   ├── AuthContext.tsx            # User authentication state
│   ├── CartContext.tsx            # Shopping cart management
│   ├── WishlistContext.tsx        # Wishlist management
│   ├── OrderContext.tsx           # Orders and checkout state
│   ├── ProductContext.tsx         # Products and filters
│   └── NotificationContext.tsx    # Toast notifications
│
├── hooks/
│   ├── useAuth.ts                 # Auth context hook
│   ├── useCart.ts                 # Cart context hook
│   ├── useWishlist.ts             # Wishlist context hook
│   ├── useForm.ts                 # Form handling and validation
│   ├── useFetch.ts                # API calls with loading/error
│   ├── useLocalStorage.ts         # localStorage wrapper
│   ├── usePagination.ts           # Pagination logic
│   ├── useDebounce.ts             # Debounce for search
│   └── useAsync.ts                # Async operations
│
├── services/
│   ├── api.ts                     # API client setup (axios/fetch)
│   ├── authService.ts             # Auth API calls
│   ├── productService.ts          # Product API calls
│   ├── cartService.ts             # Cart API calls
│   ├── orderService.ts            # Order API calls
│   ├── artisanService.ts          # Artisan API calls
│   └── imageService.ts            # Image upload/processing
│
├── utils/
│   ├── constants.ts               # App constants and configs
│   ├── validators.ts              # Form validation functions
│   ├── formatters.ts              # Date, currency, text formatting
│   ├── helpers.ts                 # Utility functions
│   ├── localStorage.ts            # localStorage operations
│   └── errorHandler.ts            # Error handling utilities
│
├── types/
│   ├── index.ts                   # All TypeScript interfaces
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Cart.ts
│   │   ├── Artisan.ts
│   │   └── Review.ts
│   └── api.ts                     # API response types
│
├── styles/
│   ├── globals.css                # Global styles
│   ├── variables.css              # CSS variables
│   ├── animations.css             # Reusable animations
│   └── utilities.css              # Utility classes
│
├── config/
│   ├── routes.ts                  # Route configuration
│   ├── api.config.ts              # API configuration
│   └── theme.config.ts            # Theme configuration
│
├── data/
│   ├── mockData.ts                # Mock data for development
│   └── sampleProducts.ts          # Sample product data
│
└── main.tsx                        # React entry point
```

---

## 🔄 State Management

### Context API Structure (Recommended for this scale)

#### 1. **AuthContext** - User Authentication
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

#### 2. **CartContext** - Shopping Cart
```typescript
interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

#### 3. **WishlistContext** - Wishlist Management
```typescript
interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}
```

#### 4. **OrderContext** - Orders & Checkout
```typescript
interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  createOrder: (orderData: OrderData) => Promise<void>;
  fetchOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
}
```

#### 5. **ProductContext** - Products & Filters
```typescript
interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  searchProducts: (query: string) => void;
  sortProducts: (sortBy: SortOption) => void;
}
```

#### 6. **NotificationContext** - Toast Messages
```typescript
interface NotificationContextType {
  notify: (message: string, type: 'success' | 'error' | 'info') => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
}
```

---

## 🛣️ Route Configuration

### Route Structure (React Router v6)

```typescript
// config/routes.ts
export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product/:id',
  ARTISANS: '/artisans',
  ARTISAN_DETAIL: '/artisans/:id',
  ABOUT: '/about',
  HELP: '/help',
  
  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Customer protected routes
  CART: '/cart',
  WISHLIST: '/wishlist',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  ACCOUNT: '/account',
  
  // Seller routes
  BECOME_SELLER: '/become-seller',
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_PRODUCTS: '/seller/products',
  SELLER_ORDERS: '/seller/orders',
  SELLER_ANALYTICS: '/seller/analytics',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',
};

// Route groups for better organization
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PRODUCTS,
  ROUTES.PRODUCT_DETAIL,
  ROUTES.ARTISANS,
  ROUTES.ARTISAN_DETAIL,
  ROUTES.ABOUT,
];

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
];

export const PROTECTED_ROUTES = [
  ROUTES.CART,
  ROUTES.WISHLIST,
  ROUTES.CHECKOUT,
  ROUTES.ORDERS,
];

export const SELLER_ROUTES = [
  ROUTES.SELLER_DASHBOARD,
  ROUTES.SELLER_PRODUCTS,
  ROUTES.SELLER_ORDERS,
];

export const ADMIN_ROUTES = [
  ROUTES.ADMIN_DASHBOARD,
];
```

---

## 🧩 Component Architecture

### Component Hierarchy

```
<App>
  ├── Providers
  │   ├── AuthProvider
  │   ├── CartProvider
  │   ├── WishlistProvider
  │   ├── OrderProvider
  │   ├── NotificationProvider
  │   └── Router
  │
  ├── <Header />
  │   ├── Logo
  │   ├── SearchBar
  │   ├── CartIcon
  │   ├── WishlistIcon
  │   └── UserMenu
  │
  ├── <MainLayout>
  │   ├── <Routes>
  │   │   ├── <HomePage>
  │   │   ├── <ProductsPage>
  │   │   ├── <ProductDetailPage>
  │   │   ├── <CartPage>
  │   │   ├── <CheckoutPage>
  │   │   └── ... (other pages)
  │
  └── <Footer />
```

### Component Types

#### 1. **Page Components** (Full-page responsibility)
- Located in `pages/` folder
- Handle routing and page logic
- Fetch data and manage page state
- Include error and loading states

#### 2. **Layout Components** (Shared structure)
- Header, Footer, Sidebar
- Persistent across pages
- Handle app-wide navigation

#### 3. **Feature Components** (Reusable business logic)
- ProductCard, CartItem, ArtisanCard
- Self-contained with props
- Can be used in multiple contexts

#### 4. **UI Components** (Presentational)
- Button, Input, Modal, Card
- Zero business logic
- Highly reusable across app
- Configured via Tailwind + shadcn/ui

#### 5. **Compound Components** (Complex features)
```typescript
// Example: Form with validation
<Form onSubmit={handleSubmit}>
  <Form.Field name="email">
    <Form.Label>Email</Form.Label>
    <Form.Input type="email" />
    <Form.Error />
  </Form.Field>
</Form>
```

---

## 🎣 Custom Hooks Strategy

### Must-Have Hooks

#### 1. **useAuth** - Authentication Management
```typescript
const useAuth = () => {
  const { user, login, logout, isAuthenticated } = useContext(AuthContext);
  return { user, login, logout, isAuthenticated };
};
```

#### 2. **useCart** - Cart Operations
```typescript
const useCart = () => {
  const { items, addToCart, removeFromCart, getTotalPrice } = useContext(CartContext);
  return { items, addToCart, removeFromCart, getTotalPrice };
};
```

#### 3. **useForm** - Form Handling & Validation
```typescript
const useForm = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  return { values, errors, touched, handleChange, handleBlur, handleSubmit };
};
```

#### 4. **useFetch** - API Data Fetching
```typescript
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch logic
  }, [url]);
  
  return { data, loading, error, refetch };
};
```

#### 5. **useLocalStorage** - Persistent State
```typescript
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    // Get from localStorage
  });
  
  return [storedValue, setStoredValue];
};
```

#### 6. **usePagination** - Pagination Logic
```typescript
const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  return { 
    currentItems, 
    currentPage, 
    totalPages, 
    goToPage, 
    nextPage, 
    prevPage 
  };
};
```

#### 7. **useDebounce** - Debounced Search
```typescript
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

---

## 📊 Data Flow

### Customer Journey - Product Purchase

```
1. USER BROWSING
   HomePage → ProductsPage
   ↓
   ProductDetailPage (view product info)
   ↓ Add to Cart / Add to Wishlist
   CartContext updated + localStorage sync

2. CART REVIEW
   CartPage (review items, update quantity)
   ↓ Proceed to Checkout
   Route to /checkout

3. CHECKOUT FLOW
   CheckoutPage
   ├── Shipping Info (AddressForm)
   ├── Payment Method Selection
   ├── Order Summary (from CartContext)
   ↓ Place Order
   OrderContext.createOrder()
   ↓ API call to backend
   ↓ Order created successfully
   ↓ Cart cleared
   ↓ Redirect to /orders/:orderId

4. ORDER TRACKING
   OrdersPage (view all orders)
   OrderDetailPage (view specific order with status)
   ↓
   API calls for real-time updates
```

### State Synchronization

```
localStorage ←→ Context ←→ Component
     ↓              ↓
  Cart Items    CartContext    CartPage
  Wishlist      WishlistCtx    WishlistPage
  Auth User     AuthContext    Header
  Preferences   NotificationCtx Toast
```

---

## ✅ Best Practices

### 1. **Component Organization**
- One component per file
- Keep components focused and single-responsibility
- Use compound components for complex UI
- Export component and its sub-components from index.ts

### 2. **State Management**
- Use Context API for global state (cart, auth, wishlist)
- Use useState for local component state
- Use useReducer for complex state logic
- Persist cart/wishlist to localStorage
- Keep API responses separate from UI state

### 3. **Performance Optimization**
```typescript
// Memoize expensive components
export const ProductCard = React.memo(({ product, onAddToCart }) => {
  return (
    // Component JSX
  );
});

// Use useCallback for event handlers
const handleAddToCart = useCallback((product) => {
  addToCart(product, 1);
}, [addToCart]);

// Use useMemo for computed values
const totalPrice = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}, [items]);
```

### 4. **Error Handling**
```typescript
// Wrap async operations with try-catch
try {
  await login(email, password);
} catch (error) {
  notify(error.message, 'error');
  setError(error.message);
}

// Use Error Boundary for React errors
<ErrorBoundary>
  <MainContent />
</ErrorBoundary>
```

### 5. **Form Validation**
```typescript
// Create validators utility
const validators = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) => value.length >= 8,
  phone: (value) => /^\d{10}$/.test(value),
};

// Use in forms with custom hook
const { values, errors, handleChange } = useForm(
  { email: '', password: '' },
  handleSubmit,
  (values) => validateForm(values, validators)
);
```

### 6. **Loading States**
```typescript
// Always show loading UI
{loading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} onRetry={refetch} />
) : (
  <Content data={data} />
)}
```

### 7. **Type Safety**
```typescript
// Always define types for API responses
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  artisanId: string;
  category: string;
  rating: number;
  reviews: Review[];
}

// Use in components
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Component JSX
};
```

---

## 🚀 Scalability Guidelines

### Phase 1: MVP (Current)
- ✅ Customer-facing pages (Home, Products, Cart, Checkout, Orders)
- ✅ Basic authentication
- ✅ Cart and wishlist with localStorage
- ✅ Product browsing and filtering

### Phase 2: Enhanced Features
- Add product reviews and ratings
- Wishlist sharing
- Order tracking with real-time updates
- Advanced filtering (price range, ratings, etc.)
- Search autocomplete

### Phase 3: Seller Features
- Seller dashboard
- Product management (CRUD)
- Order management
- Analytics and insights
- Inventory management

### Phase 4: Advanced
- Recommendation engine
- Live chat support
- Social features (follow artisans)
- Multiple payment methods
- Admin dashboard
- Advanced analytics

### Code Organization for Scalability

```
src/
├── features/               # Feature-based organization (for larger apps)
│   ├── products/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── types/
│   ├── cart/
│   ├── orders/
│   └── artisans/
│
├── shared/                 # Shared across features
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── styles/
```

### API Layer Scalability

```typescript
// services/api.ts - Centralized API client
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Environment Configuration

```typescript
// config/api.config.ts
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
  },
  production: {
    baseURL: 'https://api.example.com',
    timeout: 5000,
  },
};

export const getApiConfig = () => {
  return API_CONFIG[process.env.NODE_ENV] || API_CONFIG.development;
};
```

---

## 📋 Implementation Checklist

- [ ] Folder structure created
- [ ] TypeScript types defined
- [ ] Context API setup (Auth, Cart, Wishlist, Order, Product)
- [ ] Route configuration with protection
- [ ] Layout components (Header, Footer)
- [ ] Authentication pages (Login, Signup)
- [ ] Customer pages (Home, Products, Product Detail, Cart, Checkout, Orders)
- [ ] Artisan pages (Artisans, Artisan Detail)
- [ ] Static pages (About, Help)
- [ ] Seller pages (Become Seller, Dashboard)
- [ ] Custom hooks (useAuth, useCart, useForm, useFetch, etc.)
- [ ] Service layer (API calls)
- [ ] Error handling and loading states
- [ ] Form validation
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests

---

## 🔗 Next Steps

1. **Review and confirm** this architecture aligns with your vision
2. **Start implementation** with folder structure and types
3. **Set up Context API** with proper provider structure
4. **Build layout components** (Header, Footer, Navigation)
5. **Implement authentication** pages and logic
6. **Build customer pages** starting with Home → Products → Cart
7. **Implement checkout flow** with order creation
8. **Add seller features** if needed
9. **Optimize performance** with code splitting and lazy loading
10. **Deploy** with CI/CD pipeline

This architecture provides a solid foundation for a scalable, maintainable ecommerce platform. Each phase can be implemented independently while maintaining code quality and type safety.
