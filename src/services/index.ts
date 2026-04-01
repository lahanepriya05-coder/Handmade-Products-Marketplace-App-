// authService currently unused by login page, but keep updated for consistency
import api from './api';
import { User, LoginData, SignupData, ApiResponse } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

// ==================== AUTH SERVICE ====================

export const authService = {
  async login(credentials: LoginData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/api/auth/login', credentials);

    if (response.success && response.data) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }

    return response;
  },

  async signup(data: SignupData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/api/auth/register', data);

    if (response.success && response.data) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }

    return response;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    await api.post('/api/auth/logout', {});
  },

  async verifyToken(): Promise<ApiResponse<User>> {
    return api.get<User>('/api/auth/verify');
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return api.post<{ token: string }>('/api/auth/refresh', {});
  },


  async resetPassword(email: string): Promise<ApiResponse<null>> {
    return api.post('/api/auth/reset-password', { email });
  },


  async updatePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return api.post('/api/auth/update-password', { oldPassword, newPassword });
  },
};

// ==================== PRODUCT SERVICE ====================

export const productService = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    return api.get(`/products?${searchParams.toString()}`);
  },

  async getProductById(id: string): Promise<ApiResponse<any>> {
    return api.get(`/products/${id}`);
  },

  async searchProducts(query: string): Promise<ApiResponse<any>> {
    return api.get(`/products/search?q=${encodeURIComponent(query)}`);
  },

  async getCategories(): Promise<ApiResponse<string[]>> {
    return api.get('/products/categories');
  },

  async createProduct(data: any): Promise<ApiResponse<any>> {
    return api.post('/products', data);
  },

  async updateProduct(id: string, data: any): Promise<ApiResponse<any>> {
    return api.put(`/products/${id}`, data);
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/products/${id}`);
  },
};

// ==================== CART SERVICE ====================

export const cartService = {
  async addToCart(productId: string, quantity: number): Promise<ApiResponse<null>> {
    return api.post('/cart/add', { productId, quantity });
  },

  async removeFromCart(productId: string): Promise<ApiResponse<null>> {
    return api.delete(`/cart/${productId}`);
  },

  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<null>> {
    return api.patch(`/cart/${productId}`, { quantity });
  },

  async getCart(): Promise<ApiResponse<any>> {
    return api.get('/cart');
  },

  async clearCart(): Promise<ApiResponse<null>> {
    return api.delete('/cart');
  },
};

// ==================== WISHLIST SERVICE ====================

export const wishlistService = {
  async addToWishlist(productId: string): Promise<ApiResponse<null>> {
    return api.post('/wishlist/add', { productId });
  },

  async removeFromWishlist(productId: string): Promise<ApiResponse<null>> {
    return api.delete(`/wishlist/${productId}`);
  },

  async getWishlist(): Promise<ApiResponse<any>> {
    return api.get('/wishlist');
  },

  async isInWishlist(productId: string): Promise<ApiResponse<{ inWishlist: boolean }>> {
    return api.get(`/wishlist/check/${productId}`);
  },
};

// ==================== ORDER SERVICE ====================

export const orderService = {
  async createOrder(data: any): Promise<ApiResponse<any>> {
    return api.post('/orders', data);
  },

  async getOrders(params?: { page?: number; limit?: number }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    return api.get(`/orders?${searchParams.toString()}`);
  },

  async getOrderById(id: string): Promise<ApiResponse<any>> {
    return api.get(`/orders/${id}`);
  },

  async cancelOrder(id: string): Promise<ApiResponse<null>> {
    return api.patch(`/orders/${id}/cancel`, {});
  },

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<null>> {
    return api.patch(`/orders/${id}/status`, { status });
  },

  async getOrderTracking(id: string): Promise<ApiResponse<any>> {
    return api.get(`/orders/${id}/tracking`);
  },
};

// ==================== ARTISAN SERVICE ====================

export const artisanService = {
  async getArtisans(params?: { page?: number; limit?: number; location?: string }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    return api.get(`/artisans?${searchParams.toString()}`);
  },

  async getArtisanById(id: string): Promise<ApiResponse<any>> {
    return api.get(`/artisans/${id}`);
  },

  async getArtisanProducts(id: string): Promise<ApiResponse<any>> {
    return api.get(`/artisans/${id}/products`);
  },

  async followArtisan(id: string): Promise<ApiResponse<null>> {
    return api.post(`/artisans/${id}/follow`, {});
  },

  async unfollowArtisan(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/artisans/${id}/follow`);
  },
};

// ==================== REVIEW SERVICE ====================

export const reviewService = {
  async createReview(productId: string, data: any): Promise<ApiResponse<any>> {
    return api.post(`/products/${productId}/reviews`, data);
  },

  async getReviews(productId: string): Promise<ApiResponse<any>> {
    return api.get(`/products/${productId}/reviews`);
  },

  async updateReview(productId: string, reviewId: string, data: any): Promise<ApiResponse<any>> {
    return api.put(`/products/${productId}/reviews/${reviewId}`, data);
  },

  async deleteReview(productId: string, reviewId: string): Promise<ApiResponse<null>> {
    return api.delete(`/products/${productId}/reviews/${reviewId}`);
  },
};

// ==================== USER SERVICE ====================

export const userService = {
  async getProfile(): Promise<ApiResponse<User>> {
    return api.get('/users/profile');
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return api.put('/users/profile', data);
  },

  async getAddresses(): Promise<ApiResponse<any[]>> {
    return api.get('/users/addresses');
  },

  async addAddress(data: any): Promise<ApiResponse<any>> {
    return api.post('/users/addresses', data);
  },

  async updateAddress(id: string, data: any): Promise<ApiResponse<any>> {
    return api.put(`/users/addresses/${id}`, data);
  },

  async deleteAddress(id: string): Promise<ApiResponse<null>> {
    return api.delete(`/users/addresses/${id}`);
  },

  async setDefaultAddress(id: string): Promise<ApiResponse<null>> {
    return api.patch(`/users/addresses/${id}/default`, {});
  },
};

// ==================== SELLER SERVICE ====================

export const sellerService = {
  async registerSeller(data: any): Promise<ApiResponse<any>> {
    return api.post('/sellers/register', data);
  },

  async getSellerProfile(): Promise<ApiResponse<any>> {
    return api.get('/sellers/profile');
  },

  async updateSellerProfile(data: any): Promise<ApiResponse<any>> {
    return api.put('/sellers/profile', data);
  },

  async getSellerProducts(): Promise<ApiResponse<any>> {
    return api.get('/sellers/products');
  },

  async getSellerOrders(params?: { status?: string }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();

    if (params?.status) {
      searchParams.append('status', params.status);
    }

    return api.get(`/sellers/orders?${searchParams.toString()}`);
  },

  async getSellerAnalytics(): Promise<ApiResponse<any>> {
    return api.get('/sellers/analytics');
  },
};
