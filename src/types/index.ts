// ==================== USER TYPES ====================
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: Address;
  role: 'customer' | 'seller' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;            // traditional field used across the app
  pincode?: string;             // some backends may refer to this instead
  country: string;
  isDefault: boolean;
}

// ==================== PROFILE TYPES ====================
export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  avatar?: string;
  address?: Partial<Address>;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  clearError: () => void;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user?: User;
}

// ==================== PRODUCT TYPES ====================
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  artisanId: string;
  artisan?: Artisan;
  stock: number;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: User;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  category?: string;
  priceRange?: [number, number];
  rating?: number;
  search?: string;
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'rating';
  page?: number;
  limit?: number;
}

// ==================== ARTISAN TYPES ====================
export interface Artisan {
  id: string;
  userId: string;
  name: string;
  bio: string;
  avatar: string;
  location: string;
  speciality: string;
  yearsOfExperience: number;
  products?: Product[];
  rating: number;
  reviewCount: number;
  followers: number;
  isVerified: boolean;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessDescription: string;
  businessType: string;
  gstNumber?: string;
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  isApproved: boolean;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== CART TYPES ====================
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// ==================== ORDER TYPES ====================
export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: 'credit-card' | 'debit-card' | 'upi' | 'wallet' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

export interface OrderData {
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: string;
  notes?: string;
}

// ==================== WISHLIST TYPES ====================
export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Wishlist {
  items: WishlistItem[];
  totalItems: number;
}

// ==================== PAGINATION TYPES ====================
export interface PaginationData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

// ==================== NOTIFICATION TYPES ====================
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// ==================== CONTEXT TYPES ====================
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}

export interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  createOrder: (orderData: OrderData) => Promise<Order>;
  fetchOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
}

export interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  totalPages: number;
  currentPage: number;
  setFilters: (filters: ProductFilters) => void;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  getProductById: (id: string) => Promise<Product>;
  searchProducts: (query: string) => void;
}

export interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  removeNotification: (id: string) => void;
}

// ==================== FORM TYPES ====================
export interface FormErrors {
  [key: string]: string;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  resetForm: () => void;
}

// ==================== HOOK TYPES ====================
export interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePaginationReturn<T> {
  currentItems: T[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
