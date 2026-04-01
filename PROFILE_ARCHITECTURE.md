# 👤 Profile System - Visual Architecture Guide

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Your App                            │
└────────────────┬────────────────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │ ProfileProvider│  ← Wrap your App
         │   (Context)    │
         └───────┬────────┘
                 │
         ┌───────┴──────────────┐
         │                      │
    ┌────▼─────┐          ┌────▼──────┐
    │Router    │          │Components │
    │          │          │           │
    │┌────────┐│          │┌─────────┐│
    ││/profile││          ││useProfile││
    │└─────┬──┘│          │└─────────┘│
    └──────┼───┘          └───────────┘
           │
    ┌──────▼─────────────────┐
    │ ProtectedRoute         │  ← Auth Guard
    │ (isAuthenticated?)     │
    └──────┬────────────────┘
           │
    ┌──────▼─────────────────┐
    │   ProfilePage         │  ← Main Component
    │  (Tabs Interface)      │
    └──────┬────────────────┘
           │
     ┌─────┴─────┬──────────┬──────────┐
     │           │          │          │
  ┌──▼──┐  ┌────▼─┐  ┌────▼──┐  ┌───▼──┐
  │View │  │ Edit │  │ Pwd   │  │Error │
  │     │  │Form  │  │Form   │  │Toast │
  └─────┘  └──────┘  └───────┘  └──────┘
```

---

## 🔄 Data Flow Diagram

### Profile Update Flow

```
User Input
    │
    ▼
┌──────────────────────┐
│ ProfileEditForm      │
│ - Validate fields    │
│ - Show errors        │
└────────┬─────────────┘
         │ (Form Valid)
         ▼
┌──────────────────────┐
│ setValues() in state │
│ (Optimistic Update)  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ updateProfile()      │
│ (Context method)     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ userService.update() │
│ - Firebase or JWT    │
└────────┬─────────────┘
         │
    ┌────┴──────────┐
    │ SUCCESS       │ ERROR
    ▼               ▼
┌────────────┐  ┌────────────────┐
│ Show Toast │  │ Rollback State │
│ Update UI  │  │ Show Error     │
└────────────┘  └────────────────┘
```

---

## 🎯 Component Hierarchy

```
App.tsx
│
├── ProfileProvider (Context)
│   │
│   └── Router
│       │
│       └── Route: /profile
│           │
│           └── ProtectedRoute (Auth Guard)
│               │
│               └── ProfilePage (Main)
│                   │
│                   ├── Tab: View
│                   │   └── ProfileView
│                   │       ├── Avatar
│                   │       ├── Info Display
│                   │       └── Edit Button
│                   │
│                   ├── Tab: Edit
│                   │   └── ProfileEditForm
│                   │       ├── Image Upload
│                   │       ├── Name Input
│                   │       ├── Phone Input
│                   │       ├── Address Fields
│                   │       └── Save/Cancel
│                   │
│                   ├── Tab: Security
│                   │   └── ChangePasswordForm
│                   │       ├── Current Pwd
│                   │       ├── New Pwd
│                   │       ├── Confirm Pwd
│                   │       └── Strength Meter
│                   │
│                   └── Logout Section
│                       ├── Logout Button
│                       └── Confirmation Dialog
```

---

## 🔌 Service Integration Points

```
┌─────────────────────┐
│  Frontend (React)   │
│                     │
│  ┌───────────────┐  │
│  │  Components   │  │
│  └────────┬──────┘  │
│           │         │
│           ▼         │
│  ┌───────────────┐  │
│  │ ProfileContext│◄──┤─ useContext()
│  └────────┬──────┘  │
│           │         │
│           ▼         │
└───────────┼─────────┘
            │
         API Client
            │
    ┌───────┴──────────┐
    │                  │
┌───▼──────┐    ┌──────▼──────┐
│ Firebase │    │ JWT Backend  │
│ - Auth   │    │ - /profile   │
│ - Store  │    │ - /upload    │
└──────────┘    └──────────────┘
    │                  │
    │        ┌─────────┘
    │        │
    └────────┴──────────┐
                        │
                ┌───────▼──────┐
                │  Database    │
                │  - users     │
                │  - profiles  │
                │  - images    │
                └──────────────┘
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────┐
│     Route Protection Layer          │
│     (ProtectedRoute Guard)          │
└────────────────┬────────────────────┘
                 │ Check isAuthenticated
                 ▼
┌─────────────────────────────────────┐
│    Context Access Layer             │
│    (ProfileProvider Check)          │
└────────────────┬────────────────────┘
                 │ Validate user exists
                 ▼
┌─────────────────────────────────────┐
│    Form Validation Layer            │
│    (Real-time & on submit)          │
└────────────────┬────────────────────┘
                 │ Email read-only
                 │ Password requirements
                 │ Type validation
                 ▼
┌─────────────────────────────────────┐
│    API Authentication Layer         │
│    (Bearer Token in headers)        │
└────────────────┬────────────────────┘
                 │ Verify token
                 ▼
┌─────────────────────────────────────┐
│    Backend Authorization Layer      │
│    (Verify user identity)           │
└─────────────────────────────────────┘
```

---

## 📝 State Management

```
ProfileContext (Global)
│
├── user: User | null
│   ├── id
│   ├── name
│   ├── email
│   ├── phone
│   ├── avatar
│   ├── address
│   ├── role
│   ├── createdAt
│   └── updatedAt
│
├── loading: boolean
│
├── error: string | null
│
├── updateProfile(data)
│   └── Optimistic update
│       └── API call
│       └── Rollback on error
│
├── changePassword(data)
│   └── Validate
│   └── API call
│   └── Handle error
│
└── clearError()
    └── Set error to null
```

---

## 🔀 Authentication Fallback Strategy

```
getUserProfile() called
         │
         ▼
   isFirebaseAvailable()?
      /        \
    YES        NO
    │          │
    ▼          └──────────────┐
  Try Firebase           JWT Backend
    │                         │
    ▼                         ▼
  getAuth().currentUser?   API /profile
    │                         │
   YES                         ▼
    │                    Return User
    ▼
  getFirestore()
    │
    ▼
  getDoc(users/{uid})
    │
    ▼
  Merge data + Return User
```

---

## 📊 Form Validation Flow

```
Input Change/Blur Event
         │
         ▼
┌────────────────────┐
│ handleChange()     │
│ handleBlur()       │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ validateField()    │
│ (Real-time)        │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Check validators   │
│ - validators.name()│
│ - validators.phone│
└────────┬───────────┘
         │
      ┌──┴──┐
      │     │
   PASS   FAIL
    │      │
    ▼      ▼
   OK    Error Message
         (Shown below field)
```

---

## 🎨 UI Layout Structure

```
┌─────────────────────────────────────────┐
│           Page Header                   │
│      "My Profile"                       │
│      "Manage your account"              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [Alert] Error Message if any           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Tabs: [View] [Edit] [Security]         │
├─────────────────────────────────────────┤
│                                         │
│  [Tab Content]                          │
│  - View: Read-only display              │
│  - Edit: Form fields                    │
│  - Security: Password form              │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Logout Section                         │
│  [Sign Out Button]                      │
└─────────────────────────────────────────┘
```

---

## 🔄 Image Upload Process

```
User selects file
         │
         ▼
┌──────────────────────┐
│ Check file type      │
│ (image/* only)       │
└────────┬─────────────┘
         │ PASS
         ▼
┌──────────────────────┐
│ Check file size      │
│ (max 5MB)            │
└────────┬─────────────┘
         │ PASS
         ▼
┌──────────────────────┐
│ Show preview         │
│ (FileReader)         │
└────────┬─────────────┘
         │
         ▼
User clicks Save
         │
         ▼
┌──────────────────────┐
│ uploadProfileImage() │
│ (FormData)           │
└────────┬─────────────┘
         │
         ▼
POST /api/upload
         │
      ┌──┴──┐
      │     │
   SUCCESS FAIL
    │      │
    ▼      ▼
  URL   Error
       Message
```

---

## 🔑 Key Type Relationships

```
User
├── name: string
├── email: string
├── phone?: string
├── avatar?: string
├── address?: Address
│   ├── street: string
│   ├── city: string
│   ├── state: string
│   ├── postalCode: string
│   └── country: string
├── role: 'customer' | 'seller' | 'admin'
├── createdAt: Date
└── updatedAt: Date

ProfileUpdateData (Partial)
├── name?: string
├── phone?: string
├── avatar?: string
└── address?: Partial<Address>

ChangePasswordData
├── currentPassword: string
├── newPassword: string
└── confirmPassword: string

ProfileContextType
├── user: User | null
├── loading: boolean
├── error: string | null
├── updateProfile: (data) => Promise<void>
├── changePassword: (data) => Promise<void>
└── clearError: () => void
```

---

## 🚀 Initialization Sequence

```
1. App Loads
   │
   ▼
2. ProfileProvider Mounts
   │
   ├─ useState(user, loading, error)
   │
   ├─ useEffect(() => {
   │    if (!initialUser) {
   │      fetchProfile()
   │    }
   │  }, [])
   │
   └─ Fetch user data
      │
      ▼
3. ProfileContext Available
   │
   ▼
4. ProfilePage Renders
   │
   ├─ useContext(ProfileContext)
   │
   ├─ Render View/Edit/Security
   │
   └─ Ready for user interaction
```

---

## 📱 Responsive Design Breakpoints

```
Mobile (320px - 767px)
┌─────────────────────┐
│ Single Column       │
│ Full Width Inputs   │
│ Stacked Layout      │
└─────────────────────┘

Tablet (768px - 1023px)
┌──────────┬──────────┐
│ 2 Columns│          │
│ Optimized│ Layout   │
└──────────┴──────────┘

Desktop (1024px+)
┌──────────────────────┐
│ Card-based Layout    │
│ Multi-column Grids   │
│ Optimized Spacing    │
└──────────────────────┘
```

---

## 🎯 Error Handling Strategy

```
Action Initiated
         │
         ▼
Try to execute
    │
    ├─ Success ─────► Show Success Message
    │                       │
    │                       ▼
    │                 Update UI
    │
    └─ Error ───────► Show Error Message
                             │
                             ▼
                      Rollback Changes
                             │
                             ▼
                      Log for debugging
```

---

## 📊 Performance Optimization

```
Component Rendering
         │
         ├─ Memoization
         │  (Prevent unnecessary re-renders)
         │
         ├─ Lazy Loading
         │  (Images load on demand)
         │
         ├─ Debouncing
         │  (Validation on change)
         │
         ├─ Caching
         │  (API responses cached)
         │
         └─ Code Splitting
            (Profile module separate)
```

---

This visual guide shows the complete architecture, data flows, component hierarchy, and interaction patterns of the profile system!

**Use this to understand the structure before diving into code.**

---

Created: Feb 11, 2026  
Version: 1.0.0
