import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { setAuthToken } from '@/services/apiClient';

export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  shopName?: string;
  avatar?: string;
  phone?: string;
  about?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<User>;
  signup: (email: string, password: string, name: string, role?: UserRole, shopName?: string) => Promise<User>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Demo user for testing
const DEMO_USER: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'buyer',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    if (token) setAuthToken(token);
    if (userJson) {
      try {
        setUser(JSON.parse(userJson));
      } catch (e) {
        console.error('Failed to parse user from storage', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole = 'buyer') => {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const payload = { email, password, role };
    console.log('[Auth] Login attempt', { email, passwordLength: password.length });

    try {
      const res = await apiClient.post('/api/auth/login', payload);
      console.log('[Auth] Login response:', res.data);

      const { token, user: userData } = res.data;
      if (!token || !userData) throw new Error('Invalid server response');

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setAuthToken(token);
      setUser(userData);
      console.log('[Auth] Login successful', { userId: userData.id });
      return userData;
    } catch (error: any) {
      console.error('[Auth] Login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
      });

      // Network error
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.message.includes('Failed to fetch')) {
        throw new Error('Server not reachable');
      }

      // Server response errors
      if (error.response) {
        const status = error.response.status;
        const backendMsg = error.response.data?.message;

        if (status === 401) {
          throw new Error('Invalid email or password');
        }
        if (status === 400) {
          throw new Error(backendMsg || 'Invalid input');
        }
        if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(backendMsg || 'Login failed');
      }

      // Fallback
      throw new Error('Something went wrong');
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole = 'buyer',
    shopName = ''
  ) => {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');
    if (!name) throw new Error('Name is required');
    if (role === 'seller' && !shopName) throw new Error('Shop name is required');

    const payload = { name, email, password, role, shopName };
    console.log('[Auth] Signup attempt', { email, name, passwordLength: password.length });

    try {
      const res = await apiClient.post('/api/auth/register', payload);
      console.log('[Auth] Signup response:', res.data);

      const { token, user: userData } = res.data;
      if (!token || !userData) throw new Error('Invalid server response');

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setAuthToken(token);
      setUser(userData);
      console.log('[Auth] Signup successful', { userId: userData.id });
      return userData;
    } catch (error: any) {
      console.error('[Auth] Signup error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
      });

      // Network error
      if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.message.includes('Failed to fetch')) {
        throw new Error('Server not reachable');
      }

      // Server response errors
      if (error.response) {
        const status = error.response.status;
        const backendMsg = error.response.data?.message;

        if (status === 400) {
          throw new Error(backendMsg || 'Email already exists or invalid input');
        }
        if (status === 409) {
          throw new Error('Email already exists');
        }
        if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(backendMsg || 'Signup failed');
      }

      // Fallback
      throw new Error('Something went wrong');
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
    setUser(null);
  };

  const updateCurrentUser = async (updates: Partial<User>) => {
    const res = await apiClient.put('/api/auth/profile', updates);
    const { token, user: nextUser } = res.data;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setAuthToken(token);
    }

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
