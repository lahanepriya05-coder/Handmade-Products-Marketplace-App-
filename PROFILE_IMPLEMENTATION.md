# 👤 User Profile System - Complete Implementation Guide

## 📋 Overview

This is a production-ready User Profile system for your React + Tailwind CSS marketplace. It provides:

✅ **View Profile** - Display user information in read-only format  
✅ **Edit Profile** - Update name, phone, address, and profile image  
✅ **Change Password** - Secure password management  
✅ **Protected Routes** - Authentication guards for profile access  
✅ **Firebase & JWT Support** - Works with both authentication methods  
✅ **Image Upload** - Profile picture with validation and preview  
✅ **Form Validation** - Complete validation with error messages  
✅ **Loading States** - User feedback during operations  
✅ **Error Handling** - Comprehensive error management

---

## 🗂️ File Structure

```
src/
├── contexts/
│   └── ProfileContext.tsx           # Profile state management
├── pages/Profile/
│   ├── index.tsx                    # Main profile page
│   ├── ProfileView.tsx              # Read-only view
│   ├── ProfileEditForm.tsx          # Edit form component
│   └── ChangePasswordForm.tsx       # Password change form
├── components/routes/
│   └── ProtectedRoute.tsx           # Authentication guard
├── services/
│   └── userService.ts               # API/Firebase integration
├── hooks/
│   └── index.ts                     # Added useProfile hook
├── types/
│   └── index.ts                     # Added profile types
└── config/
    └── routes.ts                    # Added /profile route
```

---

## 🚀 Quick Start

### 1. Setup ProfileProvider in your App

```tsx
// src/main.tsx or src/App.tsx

import { ProfileProvider } from '@/contexts/ProfileContext';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ProfileProvider>
        <YourAppContent />
      </ProfileProvider>
    </BrowserRouter>
  );
}
```

### 2. Add Protected Route to Router

```tsx
// src/App.tsx or Router.tsx

import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import ProfilePage from '@/pages/Profile';
import { ROUTES } from '@/config/routes';

function Router() {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const isLoading = false; // Your loading state

  return (
    <Routes>
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### 3. Add Link to Navigation

```tsx
// src/components/Header.tsx

import { ROUTES } from '@/config/routes';

export function Header() {
  return (
    <nav>
      {/* ... other nav items */}
      <Link to={ROUTES.PROFILE}>My Profile</Link>
    </nav>
  );
}
```

---

## 🔐 Authentication Integration

### Firebase Setup

If using Firebase:

```tsx
// src/services/userService.ts - Already integrated!

// The service automatically detects Firebase and:
// 1. Gets current user from Firebase Auth
// 2. Fetches additional data from Firestore (users/{userId})
// 3. Handles profile updates to both Auth and Firestore
// 4. Manages password changes via Firebase Auth
```

**Firebase Firestore Structure:**

```
firestore/
└── users/
    └── {userId}
        ├── name: "John Doe"
        ├── email: "john@example.com"
        ├── phone: "+91 9876543210"
        ├── avatar: "https://..."
        ├── address: {
        │   street: "123 Main St"
        │   city: "Mumbai"
        │   state: "Maharashtra"
        │   postalCode: "400001"
        │   country: "India"
        ├── role: "customer"
        ├── createdAt: Timestamp
        └── updatedAt: Timestamp
```

### JWT Backend Setup

If using JWT:

**API Endpoints required:**

```
GET    /api/users/profile                 # Fetch user profile
PUT    /api/users/profile                 # Update profile
POST   /api/users/change-password         # Change password
POST   /api/upload                        # Upload profile image
PUT    /api/users/address                 # Update address
GET    /api/users/{userId}                # Get user by ID
```

**API Response Format:**

```json
{
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "avatar": "https://...",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India"
    },
    "role": "customer",
    "createdAt": "2025-02-10T10:30:00Z",
    "updatedAt": "2025-02-10T10:30:00Z"
  },
  "message": "Success"
}
```

---

## 📖 Component Documentation

### ProfileContext

Manages global profile state and operations.

**Features:**
- Automatically fetches user profile on mount
- Provides update and password change methods
- Handles loading and error states
- Optimistic updates with rollback on error

**Usage:**

```tsx
import { useContext } from 'react';
import { ProfileContext } from '@/contexts/ProfileContext';

function MyComponent() {
  const { user, loading, error, updateProfile, changePassword, clearError } = useContext(ProfileContext);

  return (
    <div>
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      {user && <p>Hello, {user.name}</p>}
    </div>
  );
}
```

### useProfile Hook

Simple hook wrapper for ProfileContext.

**Usage:**

```tsx
import { useProfile } from '@/hooks';

function MyComponent() {
  const { user, updateProfile } = useProfile();
  
  // Use just like context
}
```

### ProtectedRoute Component

Guards routes from unauthenticated access.

**Props:**
- `isAuthenticated` (boolean) - Whether user is logged in
- `isLoading` (boolean, optional) - Show loading while checking auth
- `children` (ReactNode) - Component to render if authenticated

**Usage:**

```tsx
<ProtectedRoute isAuthenticated={isAuth} isLoading={loading}>
  <ProfilePage />
</ProtectedRoute>
```

### ProfilePage

Main profile page with tabs for View, Edit, and Security.

**Features:**
- Tab-based navigation
- Error and success alerts
- Logout confirmation
- Loading states

### ProfileView

Read-only profile display component.

**Shows:**
- Profile photo
- Full name
- Email (read-only)
- Phone number
- Address
- Account creation date
- Last update date

### ProfileEditForm

Form for editing profile information.

**Features:**
- Profile image upload with preview
- Name editing (required)
- Phone number (optional)
- Address fields (optional)
- Form validation
- Loading states
- Cancel/Save buttons

### ChangePasswordForm

Secure password change form.

**Features:**
- Current password verification
- New password validation
- Password strength indicators
- Confirmation matching
- Security requirements display

---

## 🔄 Data Flow

### Profile Update Flow

```
User clicks "Edit Profile"
    ↓
Form renders with initial values
    ↓
User modifies fields
    ↓
Form validation on change/blur
    ↓
User clicks "Save Changes"
    ↓
Optimistic update in state
    ↓
API request sent
    ↓
Success: Update local state, show success toast
Error: Rollback optimistic update, show error
```

### Authentication Check Flow

```
User navigates to /profile
    ↓
ProtectedRoute checks isAuthenticated
    ↓
isAuthenticated === true?
    ├─ YES → Render ProfilePage
    └─ NO → Redirect to /login
```

---

## 🎯 Best Practices Implemented

### Security

✅ **Email is Read-Only** - Cannot be changed from frontend  
✅ **Password Verification** - Current password required to change  
✅ **Role Protection** - Role cannot be edited from frontend  
✅ **Auth Token Management** - Automatic Bearer token injection  
✅ **Optimistic Updates** - Rollback on error  
✅ **Input Validation** - All fields validated before submission  

### User Experience

✅ **Loading States** - User feedback during operations  
✅ **Error Messages** - Clear, actionable error text  
✅ **Success Notifications** - Confirmation after changes  
✅ **Form Validation** - Real-time validation feedback  
✅ **Image Preview** - See avatar before uploading  
✅ **Disabled States** - Prevent double-submission  

### Code Quality

✅ **TypeScript** - Full type safety  
✅ **Hooks** - Custom hooks for logic reuse  
✅ **Context API** - Global state management  
✅ **Validation** - Centralized validators  
✅ **Error Handling** - Comprehensive error handling  
✅ **Comments** - Well-documented code  

---

## 🧪 Testing Example

### Unit Test

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '@/pages/Profile';
import { ProfileProvider } from '@/contexts/ProfileContext';

describe('ProfilePage', () => {
  it('should display user profile', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      role: 'customer' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <ProfileProvider user={mockUser}>
        <ProfilePage />
      </ProfileProvider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should show edit form when Edit button clicked', async () => {
    render(
      <ProfileProvider user={mockUser}>
        <ProfilePage />
      </ProfileProvider>
    );

    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });
  });

  it('should validate form fields', async () => {
    render(
      <ProfileProvider user={mockUser}>
        <ProfilePage />
      </ProfileProvider>
    );

    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);

    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🚨 Error Handling

### Common Errors & Solutions

**"User not authenticated"**
```tsx
// Solution: Check ProfileContext is inside ProtectedRoute
// or user is properly logged in
```

**"Failed to upload image"**
```tsx
// Solution: Check file size (max 5MB) and type (image only)
// Verify /api/upload endpoint is working
```

**"Passwords do not match"**
```tsx
// Solution: Ensure new password and confirm password are identical
```

**"Firebase not available"**
```tsx
// Solution: Check Firebase is initialized
// Or configure JWT backend as fallback
```

---

## 📱 Responsive Design

The profile system is fully responsive:

- **Mobile** - Single column layout, full-width forms
- **Tablet** - Two column grid for some sections
- **Desktop** - Optimized card-based layout

---

## 🔗 Related Files

**Already Created:**
- `src/types/index.ts` - Profile types
- `src/config/routes.ts` - /profile route
- `src/hooks/index.ts` - useProfile hook
- `src/utils/validators.ts` - Validation rules
- `src/utils/formatters.ts` - Data formatting
- `src/services/api.ts` - API client

**Created in this update:**
- `src/contexts/ProfileContext.tsx`
- `src/components/routes/ProtectedRoute.tsx`
- `src/pages/Profile/index.tsx`
- `src/pages/Profile/ProfileView.tsx`
- `src/pages/Profile/ProfileEditForm.tsx`
- `src/pages/Profile/ChangePasswordForm.tsx`
- `src/services/userService.ts`

---

## 🎓 Learning Path

1. **Understand Context** - Read `ProfileContext.tsx`
2. **Learn Route Protection** - Read `ProtectedRoute.tsx`
3. **Study Form Handling** - Read `ProfileEditForm.tsx`
4. **Review Services** - Read `userService.ts`
5. **Integrate with App** - Add to your Router and App
6. **Test Thoroughly** - Use provided test examples
7. **Deploy** - Follow your deployment process

---

## 📝 Configuration

### Image Upload Settings

```typescript
// src/pages/Profile/ProfileEditForm.tsx

// Max file size: 5MB
if (file.size > 5 * 1024 * 1024) {
  // Show error
}

// Allowed types: image/*
if (!file.type.startsWith('image/')) {
  // Show error
}
```

### Password Requirements

```typescript
// Minimum 8 characters
// At least one uppercase letter
// At least one lowercase letter
// At least one number
// Special characters recommended
```

### Form Debounce

```typescript
// Import from constants
import { DEBOUNCE } from '@/utils/constants';

// Adjust timing if needed
const debouncedValue = useDebounce(searchValue, DEBOUNCE.SEARCH);
```

---

## 🚀 Next Steps

1. ✅ Implement ProfileProvider in App
2. ✅ Add ProtectedRoute to router
3. ✅ Configure Firebase or JWT endpoints
4. ✅ Add profile link to Header navigation
5. ✅ Test profile view and edit
6. ✅ Test password change
7. ✅ Implement logout functionality
8. ✅ Add profile to user menu/sidebar
9. ✅ Setup email verification (optional)
10. ✅ Add 2FA support (optional)

---

## 📞 Support

For issues or questions:
1. Check error messages in browser console
2. Review API response in Network tab
3. Verify authentication is working
4. Check Firebase/JWT configuration
5. Ensure all types and interfaces match

---

## ✨ Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| View Profile | ✅ | Read-only display |
| Edit Profile | ✅ | Name, phone, address |
| Profile Image | ✅ | Upload with validation |
| Change Password | ✅ | Current + new password |
| Form Validation | ✅ | Real-time feedback |
| Error Handling | ✅ | User-friendly messages |
| Loading States | ✅ | Feedback during operations |
| Firebase Support | ✅ | Full integration |
| JWT Support | ✅ | API endpoints |
| Protected Routes | ✅ | Authentication guards |
| Responsive Design | ✅ | Mobile-friendly |
| TypeScript | ✅ | Full type safety |

---

**Created: February 11, 2026**  
**Last Updated: February 11, 2026**  
**Version: 1.0.0 - Production Ready**
