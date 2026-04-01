import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, ProfileUpdateData, ChangePasswordData, ProfileContextType } from '@/types';
import * as userService from '@/services/userService';

/**
 * ProfileContext - Manages user profile state and operations
 * Provides: user data, loading state, error handling, update/password change methods
 */
export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
  user?: User | null;
}

/**
 * ProfileProvider - Context Provider for profile state management
 * 
 * Features:
 * - Automatically fetches user profile on mount
 * - Handles profile updates with optimistic updates
 * - Manages password changes
 * - Provides error handling and loading states
 * - Auto-cleanup on unmount
 */
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children, user: initialUser }) => {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile on mount if not provided (use localStorage as a lightweight cache)
  useEffect(() => {
    if (!initialUser) {
      // try to hydrate from localStorage first so we have something to show quickly
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore parse errors
        }
      }

      const fetchProfile = async () => {
        try {
          setLoading(true);
          setError(null);
          const userData = await userService.getUserProfile();
          setUser(userData);
          // keep cache in sync
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      // if initialUser was supplied via props, also sync to storage
      localStorage.setItem('user', JSON.stringify(initialUser));
    }
  }, [initialUser]);

  /**
   * Update user profile with new data
   * - Validates input before sending
   * - Updates local state optimistically
   * - Reverts on error
   * 
   * @param data - Profile data to update (name, phone, avatar, address)
   * @throws Error if update fails
   */
  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Store previous state for rollback
    const previousUser = user;

    try {
      setLoading(true);
      setError(null);

      // Optimistic update
      setUser((prev) =>
        prev
          ? {
              ...prev,
              ...data,
              updatedAt: new Date(),
            }
          : null
      );

      // Call service to update on backend
      const updatedUser = await userService.updateUserProfile(data);
      setUser(updatedUser);
      // update cache as well
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      // Rollback on error
      setUser(previousUser);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Change user password
   * - Validates password requirements
   * - Requires current password verification
   * - Updates auth system
   * 
   * @param data - Current and new passwords
   * @throws Error if change fails
   */
  const changePassword = useCallback(async (data: ChangePasswordData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate passwords match
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      // Validate password strength
      if (data.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Call service to change password
      await userService.changeUserPassword(data);

      // Success message will be handled by toast notification
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ProfileContextType = {
    user,
    loading,
    error,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
