// API Configuration
export const API_CONFIG = {
  development: {
    // backend runs on port 5000; API prefix will be added by client helpers
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://api.artisanconnect.com',
    timeout: 5000,
  },
};

export const getApiConfig = () => {
  return API_CONFIG[process.env.NODE_ENV as keyof typeof API_CONFIG] || API_CONFIG.development;
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

// Product related
export const PRODUCT_CATEGORIES = [
  'Sarees',
  'Kurtas & Kurtis',
  'Lehengas',
  'Salwar Suits',
  'Dupattas & Stoles',
  'Dresses',
  'Jewelry',
  'Home Decor',
  'Handicrafts',
  'Traditional Wear',
] as const;

export const PRODUCT_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
] as const;

export const PRICE_RANGE = {
  MIN: 100,
  MAX: 100000,
  STEP: 100,
} as const;

// Order related
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const PAYMENT_METHODS = [
  { value: 'credit-card', label: 'Credit Card', icon: '💳' },
  { value: 'debit-card', label: 'Debit Card', icon: '💳' },
  { value: 'upi', label: 'UPI', icon: '📱' },
  { value: 'wallet', label: 'Digital Wallet', icon: '👛' },
  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
] as const;

// Shipping
export const SHIPPING_COST = {
  DEFAULT: 50,
  FREE_ABOVE: 500,
} as const;

export const TAX_RATE = 0.1; // 10%

// Form validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PHONE_LENGTH: 10,
  PINCODE_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  PINCODE_REGEX: /^[0-9]{6}$/,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
} as const;

// Debounce timings
export const DEBOUNCE = {
  SEARCH: 300,
  FILTER: 500,
  INPUT: 200,
} as const;

// Toast notifications
export const NOTIFICATION_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  CART: 'cart_items',
  WISHLIST: 'wishlist_items',
  FILTERS: 'product_filters',
  PREFERENCES: 'user_preferences',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  SIGNUP_FAILED: 'Signup failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully!',
  SIGNUP: 'Account created successfully! Please check your email.',
  LOGOUT: 'Logged out successfully!',
  ADD_TO_CART: 'Product added to cart!',
  REMOVE_FROM_CART: 'Product removed from cart!',
  ADD_TO_WISHLIST: 'Product added to wishlist!',
  REMOVE_FROM_WISHLIST: 'Product removed from wishlist!',
  ORDER_CREATED: 'Order placed successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PRODUCT_ADDED: 'Product added successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PRODUCT_DELETED: 'Product deleted successfully!',
} as const;
