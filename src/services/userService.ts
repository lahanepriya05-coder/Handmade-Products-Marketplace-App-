/**
 * User Service - Profile and Account Management
 * 
 * Handles:
 * - Profile fetching and updating
 * - Password management
 * - Firebase Auth or JWT integration
 * 
 * Supports both Firebase and JWT backends with automatic fallback
 */

import { User, ProfileUpdateData, ChangePasswordData } from '@/types';
import api from './api';

// ==================== FIREBASE INTEGRATION ====================

/**
 * Check if Firebase is available
 */
const isFirebaseAvailable = (): boolean => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('firebase/app');
    return true;
  } catch {
    return false;
  }
};

/**
 * Get current user from Firebase
 * IMPORTANT: Implement this based on your Firebase setup
 */
async function getFirebaseCurrentUser(): Promise<User | null> {
  try {
    // Import dynamically to avoid hard dependency
    const firebase = await import('firebase/app').catch(() => null);
    const auth = await import('firebase/auth').catch(() => null);

    if (!firebase || !auth) return null;

    const currentUser = auth.getAuth().currentUser;
    if (!currentUser) return null;

    // Fetch additional user data from Firestore
    const firestore = await import('firebase/firestore').catch(() => null);
    if (!firestore) {
      return {
        id: currentUser.uid,
        email: currentUser.email || '',
        name: currentUser.displayName || 'User',
        avatar: currentUser.photoURL || undefined,
        phone: currentUser.phoneNumber || undefined,
        role: 'customer',
        createdAt: currentUser.metadata?.creationTime || new Date(),
        updatedAt: new Date(),
      };
    }

    const db = firestore.getFirestore();
    const docRef = firestore.doc(db, 'users', currentUser.uid);
    const docSnap = await firestore.getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: currentUser.uid,
        email: currentUser.email || '',
        name: docSnap.data().name || currentUser.displayName || 'User',
        avatar: docSnap.data().avatar || currentUser.photoURL || undefined,
        phone: docSnap.data().phone || undefined,
        address: docSnap.data().address || undefined,
        role: docSnap.data().role || 'customer',
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      };
    }

    return {
      id: currentUser.uid,
      email: currentUser.email || '',
      name: currentUser.displayName || 'User',
      avatar: currentUser.photoURL || undefined,
      phone: undefined,
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Firebase error:', error);
    return null;
  }
}

/**
 * Update Firebase user profile
 */
async function updateFirebaseProfile(data: ProfileUpdateData): Promise<User> {
  try {
    const auth = await import('firebase/auth').catch(() => null);
    const firestore = await import('firebase/firestore').catch(() => null);

    const currentUser = auth?.getAuth().currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Update Firebase Auth profile
    if (data.name || data.avatar) {
      const auth_module = await import('firebase/auth');
      await auth_module.updateProfile(currentUser, {
        displayName: data.name,
        photoURL: data.avatar,
      });
    }

    // Update Firestore document
    if (firestore) {
      const db = firestore.getFirestore();
      const docRef = firestore.doc(db, 'users', currentUser.uid);
      await firestore.updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    }

    // Return updated user
    const updatedUser = await getFirebaseCurrentUser();
    if (!updatedUser) throw new Error('Failed to fetch updated user');
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update Firebase profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Change Firebase password
 */
async function changeFirebasePassword(data: ChangePasswordData): Promise<void> {
  try {
    const auth = await import('firebase/auth').catch(() => null);
    if (!auth) throw new Error('Firebase not available');

    const currentUser = auth.getAuth().currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // For Firebase, we need to re-authenticate first
    // This is typically handled on the frontend with a re-auth modal
    const auth_module = await import('firebase/auth');
    
    // Re-authenticate user
    try {
      // User should have provided password in re-auth, this is a simplified example
      // In production, implement proper re-auth flow with UI
      console.log('Note: Implement proper Firebase re-authentication flow');
    } catch (error) {
      throw new Error('Please sign in again to change your password');
    }

    // Update password
    await auth_module.updatePassword(currentUser, data.newPassword);
  } catch (error) {
    throw new Error(`Failed to change Firebase password: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ==================== JWT / BACKEND INTEGRATION ====================

/**
 * Get user profile from backend API (JWT)
 */
async function getBackendProfile(): Promise<User> {
    const response = await api.get<User>('/api/users/profile');
  if (!response.data) throw new Error('Failed to fetch profile');
  return response.data;
}

/**
 * Update user profile via backend API
 */
async function updateBackendProfile(data: ProfileUpdateData): Promise<User> {
  const response = await api.put<User>('/api/users/profile', data);
  if (!response.data) throw new Error('Failed to update profile');
  return response.data;
}

/**
 * Change password via backend API
 */
async function changeBackendPassword(data: ChangePasswordData): Promise<void> {
  const response = await api.post<{ message: string }>('/api/users/change-password', {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
  
  if (!response.data) throw new Error('Failed to change password');
}

// ==================== PUBLIC API ====================

/**
 * Get current user profile
 * Attempts Firebase first, falls back to backend API
 */
export async function getUserProfile(): Promise<User> {
  // Try Firebase first if available
  if (isFirebaseAvailable()) {
    const firebaseUser = await getFirebaseCurrentUser();
    if (firebaseUser) return firebaseUser;
  }

  // Fall back to backend API
  return getBackendProfile();
}

/**
 * Update user profile
 * Uses Firebase or backend API based on availability
 */
export async function updateUserProfile(data: ProfileUpdateData): Promise<User> {
  if (isFirebaseAvailable()) {
    return updateFirebaseProfile(data);
  }
  return updateBackendProfile(data);
}

/**
 * Change user password
 * Uses Firebase or backend API based on availability
 */
export async function changeUserPassword(data: ChangePasswordData): Promise<void> {
  if (isFirebaseAvailable()) {
    return changeFirebasePassword(data);
  }
  return changeBackendPassword(data);
}

/**
 * Upload profile image
 * Returns image URL for use in profile
 */
export async function uploadProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'profile-image');

  const response = await apiClient.post<{ url: string }>('/api/upload', formData);
  if (!response.data?.url) throw new Error('Failed to upload image');
  
  return response.data.url;
}

/**
 * Get user by ID (for public artisan profiles, etc.)
 */
export async function getUserById(userId: string): Promise<User> {
  const response = await api.get<User>(`/api/users/${userId}`);
  if (!response.data) throw new Error('User not found');
  return response.data;
}

/**
 * Update user address
 */
export async function updateUserAddress(addressData: any): Promise<User> {
  const response = await api.put<User>('/api/users/address', addressData);
  if (!response.data) throw new Error('Failed to update address');
  return response.data;
}

export default {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  uploadProfileImage,
  getUserById,
  updateUserAddress,
};
