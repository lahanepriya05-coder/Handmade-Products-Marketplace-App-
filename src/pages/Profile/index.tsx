import React, { useState, useContext } from 'react';
import { ProfileContext } from '@/contexts/ProfileContext';
import { User } from '@/types';
import ProfileView from './ProfileView';
import ProfileEditForm from './ProfileEditForm';
import ChangePasswordForm from './ChangePasswordForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

type ProfileMode = 'view' | 'edit' | 'password';

/**
 * Profile Page - User profile management
 * 
 * Features:
 * - View profile in read-only mode
 * - Edit profile details with validation
 * - Change password with security checks
 * - Success/error notifications
 * - Loading states
 * 
 * Protected route: /profile (requires authentication)
 */
const ProfilePage: React.FC = () => {
  const context = useContext(ProfileContext);
  
  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Profile context not available. Ensure ProfileProvider is set up.</p>
      </div>
    );
  }

  const { user, loading, error, clearError } = context;
  // try to fall back to a cached copy if the context hasn't loaded yet
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const localUser: User | null = storedUser ? JSON.parse(storedUser) : null;
  const displayUser: User | null = user || localUser;

  const [mode, setMode] = useState<ProfileMode>('view');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Handle successful profile update
  const handleUpdateSuccess = (message: string) => {
    setSuccessMessage(message);
    setMode('view');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Handle successful password change
  const handlePasswordChangeSuccess = (message: string) => {
    setSuccessMessage(message);
    setMode('view');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // show spinner only if we have no cached copy either
  if (loading && !displayUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load profile. Please try refreshing the page or logging in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information and settings</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-sm font-medium hover:underline"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <Tabs value={mode} onValueChange={(value) => setMode(value as ProfileMode)}>
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="view" className="flex-1">
                View Profile
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex-1">
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="password" className="flex-1">
                Security
              </TabsTrigger>
            </TabsList>

            {/* View Mode */}
            <TabsContent value="view" className="p-6">
              <ProfileView
                user={displayUser}
                onEdit={() => setMode('edit')}
              />
            </TabsContent>

            {/* Edit Mode */}
            <TabsContent value="edit" className="p-6">
              <ProfileEditForm
                user={displayUser}
                loading={loading}
                onSuccess={handleUpdateSuccess}
                onCancel={() => setMode('view')}
              />
            </TabsContent>

            {/* Password Change Mode */}
            <TabsContent value="password" className="p-6">
              <ChangePasswordForm
                loading={loading}
                onSuccess={handlePasswordChangeSuccess}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Logout Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Logout</h2>
          <p className="text-gray-600 mb-6">
            Sign out of your account. You'll be redirected to the login page.
          </p>
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Sign Out
          </Button>
        </div>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign Out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sign out? You'll need to log in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // Implement logout logic here
                  // window.location.href = '/login';
                  console.log('Logout clicked');
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProfilePage;
