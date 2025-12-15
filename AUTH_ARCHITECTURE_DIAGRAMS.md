# Campus Hub Authentication - Visual Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CAMPUS HUB APP (React)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    App.tsx (Main)                         │   │
│  │                                                            │   │
│  │  ┌─ useAuthSession() ────────────────────────────────┐  │   │
│  │  │ • Initializes auth on startup                     │  │   │
│  │  │ • Restores user session                           │  │   │
│  │  │ • Restores campus selection                       │  │   │
│  │  │ • Sets up auth listener                           │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌─ Routes (Protected & Public) ──────────────────────┐  │   │
│  │  │ /                    → Landing (Public)            │  │   │
│  │  │ /auth/signup         → SignUp (Public)             │  │   │
│  │  │ /auth/login          → Login (Public)              │  │   │
│  │  │ /auth/campuspicker   → CampusPicker (Public)       │  │   │
│  │  │ /home                → ProtectedRoute → Home        │  │   │
│  │  │ /profile             → ProtectedRoute → Profile     │  │   │
│  │  │ /explore             → ProtectedRoute → Explore     │  │   │
│  │  │ ...more protected routes...                         │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
              ↓                          ↓                  ↓
      ┌─────────────┐          ┌─────────────┐   ┌────────────────┐
      │ Auth Pages  │          │   Stores    │   │  Supabase      │
      │  (SignUp,   │          │ (Zustand)   │   │  Backend       │
      │  Login,     │          │             │   │                │
      │  Campus)    │          │ useUserStore│   │ • Auth API     │
      └─────────────┘          │ useCampusS..│   │ • DB (Profiles)│
                               │ useAuthStore│   │ • Real-time    │
                               └─────────────┘   └────────────────┘
```

---

## Data Flow Diagram

### Signup Flow
```
User @ /auth/signup
    ↓
Enters email, password, name
    ↓
Clicks "Create Account"
    ↓
signupWithBypass(email, password, name, true)
    ↓
│ Try: supabase.auth.signUp()
├─→ Success: Get user ID
│
└─→ Email Error: Check if user created
    └─→ If created: bypassEmailConfirmation()
    └─→ If not: Show error
    ↓
createUserProfile(userId, email, name)
    ↓
│ Create in profiles table
├─→ Success: Continue
└─→ Error: Log but continue
    ↓
Update useUserStore
    ↓
Show success message
    ↓
Redirect to /auth/campuspicker
    ↓
User selects campus
    ↓
updateUserCampus(userId, campusId)
    ↓
Update useCampusStore
    ↓
Redirect to /home ✅
```

### Login Flow
```
User @ /auth/login
    ↓
Enters email, password
    ↓
Clicks "Sign In"
    ↓
supabase.auth.signInWithPassword(email, password)
    ↓
│ Success: Get session + user
│   └─→ Update useUserStore
│   └─→ Check if campus exists
│       ├─→ If exists: Restore to useCampusStore
│       └─→ If not: Show campus picker
│
└─→ Error: Show error message
    ├─→ Invalid credentials
    ├─→ Email not confirmed
    └─→ Other error
    ↓
Redirect to /home ✅
```

### Session Restoration Flow
```
App startup
    ↓
App.tsx mounts
    ↓
useAuthSession() runs
    ↓
setAuthLoading(true)
    ↓
setLoading(false) → Unblock UI
    ↓
supabase.auth.getSession()
    ↓
│ Session found
│   ├─→ setUser() in useUserStore
│   ├─→ Fetch profile from DB
│   ├─→ Get campus_id from profile
│   ├─→ Fetch campus data
│   └─→ setCampus() in useCampusStore
│
└─→ No session
    └─→ User stays null
    ↓
setAuthLoading(false) → Auth complete
    ↓
Setup auth listener for real-time updates
    ↓
App ready for routing ✅
```

### Protected Route Flow
```
User navigates to /home
    ↓
ProtectedRoute component mounts
    ↓
Check: user in useUserStore?
    ├─→ No → Redirect to /auth/login
    └─→ Yes → Check next
    ↓
Check: campus in useCampusStore?
    ├─→ No → Redirect to /auth/campuspicker
    └─→ Yes → Continue
    ↓
Render protected page ✅
```

---

## State Management Diagram

### useUserStore
```
┌──────────────────────────────────────┐
│         useUserStore (Zustand)       │
├──────────────────────────────────────┤
│                                      │
│  State:                              │
│  ├─ user: UserProfile | null         │
│  │  ├─ id: string (auth user ID)     │
│  │  ├─ email: string                 │
│  │  ├─ name: string                  │
│  │  ├─ verified: boolean             │
│  │  ├─ campus_id: string             │
│  │  └─ avatar_url: string            │
│  │                                   │
│  └─ authLoading: boolean             │
│                                      │
│  Actions:                            │
│  ├─ setUser(user)                    │
│  ├─ updateUser(patch)                │
│  ├─ clearUser()                      │
│  └─ setAuthLoading(loading)          │
│                                      │
│  Storage: localStorage (persisted)   │
│                                      │
└──────────────────────────────────────┘
```

### useCampusStore
```
┌──────────────────────────────────────┐
│        useCampusStore (Zustand)      │
├──────────────────────────────────────┤
│                                      │
│  State:                              │
│  └─ campus: Campus | null            │
│     ├─ id: string                    │
│     ├─ name: string                  │
│     └─ short_name: string            │
│                                      │
│  Actions:                            │
│  ├─ setCampus(campus)                │
│  └─ clearCampus()                    │
│                                      │
│  Storage: localStorage (persisted)   │
│                                      │
└──────────────────────────────────────┘
```

### useAuthStore (Legacy)
```
┌──────────────────────────────────────┐
│         useAuthStore (Legacy)        │
├──────────────────────────────────────┤
│                                      │
│  Provides:                           │
│  ├─ login(email, password)           │
│  ├─ signup(email, password, name)    │
│  ├─ logout()                         │
│  └─ updateProfile(updates)           │
│                                      │
│  Status: Can be refactored           │
│                                      │
└──────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├─ useAuthSession() [Hook]
├─ PostModal
└─ Routes
   ├─ Landing (Public)
   ├─ Auth Pages (Public)
   │  ├─ Login
   │  ├─ SignUp
   │  └─ CampusPicker
   ├─ ProtectedRoute [Guard]
   │  ├─ Home
   │  ├─ Explore
   │  ├─ Alerts
   │  ├─ Profile
   │  ├─ Settings
   │  ├─ Notifications
   │  └─ Feed Pages
   │     ├─ Confessions
   │     ├─ Marketplace
   │     ├─ Events
   │     ├─ Food
   │     ├─ Notes
   │     └─ Roommates
   └─ Public Info Pages
      ├─ Privacy Policy
      └─ Terms & Conditions
```

---

## Authentication Sequence Diagram

### New User Complete Journey
```
┌─────────┐         ┌──────────┐         ┌──────────┐         ┌─────────┐
│   User  │         │   App    │         │Supabase  │         │   DB    │
└────┬────┘         └────┬─────┘         └────┬─────┘         └────┬────┘
     │                   │                    │                   │
     │  Go to signup     │                    │                   │
     ├──────────────────>│                    │                   │
     │                   │                    │                    
     │  Form fills       │                    │                   │
     │<──────────────────┤                    │                   │
     │                   │                    │                   │
     │  Click signup     │                    │                   │
     ├──────────────────>│                    │                   │
     │                   │  signUp()          │                   │
     │                   ├───────────────────>│                   │
     │                   │                    │  Create user      │
     │                   │                    ├──────────────────>│
     │                   │                    │                   │
     │                   │  Success + ID      │                   │
     │                   │<───────────────────┤                   │
     │                   │                    │                   │
     │                   │  Create profile    │                   │
     │                   ├──────────────────────────────────────>│
     │                   │                    │    Insert         │
     │                   │<──────────────────────────────────────┤
     │                   │                    │                   │
     │  Success msg      │                    │                   │
     │<──────────────────┤                    │                   │
     │                   │                    │                   │
     │  Select campus    │                    │                   │
     ├──────────────────>│                    │                   │
     │                   │  Update profile    │                   │
     │                   ├──────────────────────────────────────>│
     │                   │                    │                   │
     │                   │                    │  ✅ Done          │
     │                   │<──────────────────────────────────────┤
     │                   │                    │                   │
     │  Go to home       │                    │                   │
     │<──────────────────┤                    │                   │
     │                   │  Restore campus    │                   │
     │                   │<──────────────────────────────────────┤
     │                   │                    │                   │
     │  ✅ All done      │                    │                   │
     │<──────────────────┤                    │                   │
     │                   │                    │                   │
```

---

## Error Handling Flow

```
Authentication Operation
    ↓
Try
    ├─→ Signup/Login/Update successful
    │   └─→ Update stores
    │   └─→ Proceed
    │
    └─→ Error occurred
        ├─→ Check error type
        │
        ├─→ Invalid credentials
        │   └─→ Show: "Invalid email or password"
        │
        ├─→ Email not confirmed
        │   └─→ Show: "Please confirm your email"
        │   └─→ Offer: "Resend confirmation"
        │
        ├─→ Email send failed (dev)
        │   └─→ Check: User was created?
        │       ├─→ Yes: bypassEmailConfirmation()
        │       └─→ No: Show error
        │
        ├─→ Database error
        │   └─→ Show: "Something went wrong"
        │   └─→ Log: Full error details
        │
        └─→ Other error
            └─→ Show: Generic error message
            └─→ Log: Full error details

Catch Block
    └─→ Unexpected error
        └─→ Show: "An unexpected error occurred"
        └─→ Log: Full stack trace
        └─→ Disable loading state
```

---

## Storage Diagram

### localStorage Structure
```
browser localStorage
│
├─ user-store (Zustand persist)
│  └─ {
│      state: {
│        user: { id, email, name, ... },
│        authLoading: false
│      }
│    }
│
├─ campus-store (Zustand persist)
│  └─ {
│      state: {
│        campus: { id, name, short_name }
│      }
│    }
│
└─ supabase-auth-token (Supabase session)
   └─ JWT token for authenticated requests
```

---

## Request/Response Cycle

### Signup Request
```
Browser
  ↓
  POST /auth/v1/signup
  Headers:
    - Content-Type: application/json
  Body:
    {
      "email": "user@example.com",
      "password": "password123",
      "data": {
        "fullname": "John Doe"
      }
    }
  ↓
Supabase Auth API
  ↓
  Response 200:
    {
      "user": {
        "id": "uuid-123",
        "email": "user@example.com",
        "created_at": "2024-01-01T00:00:00Z"
      },
      "session": { ... }
    }
```

### Login Request
```
Browser
  ↓
  POST /auth/v1/token
  Headers:
    - Content-Type: application/json
  Body:
    {
      "email": "user@example.com",
      "password": "password123",
      "grant_type": "password"
    }
  ↓
Supabase Auth API
  ↓
  Response 200:
    {
      "user": {
        "id": "uuid-123",
        "email": "user@example.com"
      },
      "session": {
        "access_token": "eyJhbGc...",
        "refresh_token": "...",
        "expires_in": 3600
      }
    }
```

---

## Performance Timeline

### App Startup
```
0ms    - App.tsx mounts
10ms   - useAuthSession() called
20ms   - setLoading(false) - UI unblocked
30ms   - getSession() starts (async)
...
400ms  - getSession() returns
410ms  - User + campus restored to stores
420ms  - Auth listener setup complete
430ms  - setAuthLoading(false)
500ms  - App ready to render

Total: ~500ms for auth initialization
User can see loading screen until ~20ms
Then can interact with UI
```

---

## Security Model

```
Public Pages
├─ /
├─ /auth/login
├─ /auth/signup
└─ /auth/campuspicker

Protected Pages
├─ /home
├─ /explore
├─ All feed pages
└─ ...

Protection Logic:
1. Check useUserStore.user exists?
   ├─ No → Redirect to /auth/login
   └─ Yes → Continue
2. Check useCampusStore.campus exists?
   ├─ No → Redirect to /auth/campuspicker
   └─ Yes → Allow access
```

---

## Future Architecture (Planned)

```
Future Additions:
├─ OAuth providers (Google, GitHub)
├─ Two-factor authentication
├─ Role-based access (Admin, Moderator)
├─ Session management (timeout, multi-device)
├─ Audit logging
├─ Rate limiting
└─ Advanced analytics
```

---

This visualization helps understand:
- How components interact
- Data flow between layers
- State management structure
- Security boundaries
- Performance characteristics
- Error handling paths

Refer back to these diagrams when:
- Implementing new auth features
- Debugging authentication issues
- Onboarding new developers
- Planning future enhancements
