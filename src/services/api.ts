import { getApiConfig, STORAGE_KEYS } from '../utils/constants';
import { ApiResponse, ApiError } from '../types';

// ==================== API CLIENT SETUP ====================

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL?: string, timeout?: number) {
    const config = getApiConfig();
    this.baseURL = baseURL || config.baseURL;
    this.timeout = timeout || config.timeout;
  }

  // ==================== REQUEST METHODS ====================

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // ==================== CORE REQUEST METHOD ====================

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return this.handleSuccessResponse<T>(data);
    } catch (error) {
      clearTimeout(timeoutId);
      return this.handleError<T>(error);
    }
  }

  // ==================== HELPER METHODS ====================

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  private setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  private async handleErrorResponse(response: Response): Promise<Error> {
    try {
      const error = await response.json();
      return new Error(error.message || `HTTP ${response.status}`);
    } catch {
      return new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  private handleSuccessResponse<T>(data: any): ApiResponse<T> {
    return {
      success: true,
      message: data.message || 'Success',
      data: data.data || data,
    };
  }

  private handleError<T>(error: any): ApiResponse<T> {
    let message = 'An error occurred';

    if (error instanceof TypeError) {
      if (error.message === 'Failed to fetch') {
        message = 'Network error. Please check your connection.';
      } else {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    // Handle 401 Unauthorized - redirect to login
    if (message.includes('401')) {
      this.removeAuthToken();
      window.location.href = '/login';
    }

    return {
      success: false,
      message: message,
      error: message,
    };
  }
}

// ==================== SINGLETON INSTANCE ====================

const apiClient = new ApiClient();
export default apiClient;

// ==================== EXPORT TYPE ====================

export type { ApiResponse, ApiError };
