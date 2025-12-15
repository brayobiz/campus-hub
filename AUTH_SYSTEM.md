# Authentication System - Complete Guide

## Overview

The Campus Hub authentication system is built on Supabase with a multi-state management approach using Zustand stores. The system handles:

1. **User Authentication** (Email/Password)
2. **Email Confirmation Bypass** (for development)
3. **Session Management** (Automatic restoration)
4. **Campus Selection** (Post-signup requirement)
5. **Protected Routes** (Role-based access)

---

## Architecture

### Key Components

#### 1. **Zustand Stores** (`src/store/`)

- **`useUserStore.ts`**
  - Manages `user` (UserProfile) and `authLoading` state
  - Provides: `setUser()`, `updateUser()`, `clearUser()`, `setAuthLoading()`
  - Persists user data across browser sessions

- **`useCampusStore.ts`**
  - Manages selected `campus` (Campus object)
  - Provides: `setCampus()`, `clearCampus()`
  - Persists campus selection across sessions

- **`useAuthStore.ts`** (Legacy - can be refactored)
  - Contains login/signup logic
  - Currently used by some auth flows

#### 2. **Auth Hook** (`src/lib/authHook.ts`)

- **`useAuthSession()`**
  - Initializes auth on app startup
  - Checks existing session and restores user/campus
  - Sets up auth state listener for real-time updates
  - Manages `authLoading` state across app lifecycle

#### 3. **Auth Utilities** (`src/lib/authUtils.ts`)

- **`signupWithBypass()`** - Signup with email confirmation bypass option
- **`createUserProfile()`** - Create/update user profile in DB
- **`getUserProfile()`** - Fetch user profile data
- **`updateUserCampus()`** - Update user's campus selection
- **`logoutUser()`** - Sign out user
- **`isUserAuthenticated()`** - Check auth status
- **`bypassEmailConfirmation()`** - Mark email as verified (dev mode)

#### 4. **Auth Pages** (`src/pages/Auth/`)

- **`Login.tsx`** - Email/password login with session handling
- **`SignUp.tsx`** - Registration with email bypass option
- **`CampusPicker.tsx`** - Campus selection post-signup/login

#### 5. **Protected Route** (`src/components/ProtectedRoute.tsx`)

- Redirects unauthenticated users to `/auth/login`
- Redirects authenticated users without campus to `/auth/campuspicker`
- Wraps all protected pages (Home, Explore, etc.)

---

## Authentication Flows

### Flow 1: New User Signup

```
┌─────────────────────────────────────────────────────────────────┐
│                          SIGNUP FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User navigates to /auth/signup                               │
│     ↓                                                             │
│  2. Enters email, password, confirm password, fullname           │
│     ↓                                                             │
│  3. Form validation checks password match                         │
│     ↓                                                             │
│  4. Calls signupWithBypass(email, password, fullname, true)      │
│     ↓                                                             │
│  5. Supabase auth.signUp() creates user                          │
│     ├─ If successful: Returns user ID                            │
│     └─ If email error but user created: Bypasses confirmation    │
│     ↓                                                             │
│  6. Updates useUserStore with new user data                      │
│     ↓                                                             │
│  7. Creates profile in profiles table                            │
│     ↓                                                             │
│  8. Redirects to /auth/campuspicker (after 1s delay)             │
│     ↓                                                             │
│  9. User selects campus → setCampus() in useCampusStore          │
│     ↓                                                             │
│  10. Redirects to /home                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 2: Existing User Login

```
┌─────────────────────────────────────────────────────────────────┐
│                          LOGIN FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User navigates to /auth/login                                │
│     ↓                                                             │
│  2. Enters email and password                                    │
│     ↓                                                             │
│  3. Calls supabase.auth.signInWithPassword()                     │
│     ├─ If successful: Returns user object                        │
│     └─ If failed: Shows error (invalid credentials, etc.)        │
│     ↓                                                             │
│  4. Updates useUserStore with user data                          │
│     ↓                                                             │
│  5. Redirects to /home (after 0.8s delay)                        │
│     ↓                                                             │
│  6. If no campus: useAuthSession() restores campus from DB       │
│     ↓                                                             │
│  7. ProtectedRoute check allows access                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 3: App Startup (Session Restoration)

```
┌─────────────────────────────────────────────────────────────────┐
│                     SESSION RESTORATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. App.tsx mounts and calls useAuthSession()                    │
│     ↓                                                             │
│  2. setAuthLoading(true) in useUserStore                         │
│     ↓                                                             │
│  3. setLoading(false) immediately to unblock UI                  │
│     ↓                                                             │
│  4. Calls supabase.auth.getSession() asynchronously              │
│     ├─ No session: setAuthLoading(false) and exit               │
│     └─ Session found: Continue to step 5                         │
│     ↓                                                             │
│  5. Updates useUserStore with user data                          │
│     ↓                                                             │
│  6. Fetches profile from profiles table                          │
│     ↓                                                             │
│  7. If campus_id exists: Restores campus in useCampusStore      │
│     ↓                                                             │
│  8. Sets up auth state listener for real-time changes            │
│     ↓                                                             │
│  9. setAuthLoading(false) - Auth complete                        │
│     ↓                                                             │
│  10. App routes render normally, user directed by ProtectedRoute │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 4: Logout

```
┌─────────────────────────────────────────────────────────────────┐
│                          LOGOUT FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User clicks logout (in Settings or Profile page)             │
│     ↓                                                             │
│  2. Calls logoutUser() from authUtils                            │
│     ↓                                                             │
│  3. Calls supabase.auth.signOut()                                │
│     ↓                                                             │
│  4. Clears user from useUserStore via auth listener              │
│     ↓                                                             │
│  5. Clears campus from useCampusStore                            │
│     ↓                                                             │
│  6. Redirects to /auth/login                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management Details

### `useUserStore` State

```typescript
interface UserProfile {
  id?: string | null;           // Supabase auth user ID
  email?: string | null;
  name?: string | null;
  verified?: boolean;
  campus_id?: string | null;
  avatar_url?: string | null;
}

type UserState = {
  user: UserProfile | null;     // Current user or null if logged out
  authLoading: boolean;         // true during auth operations
  setUser: (u: UserProfile | null) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  clearUser: () => void;
  setAuthLoading: (loading: boolean) => void;
}
```

### `useCampusStore` State

```typescript
interface Campus {
  id?: string;
  name: string;
  short_name?: string;
}

interface CampusStore {
  campus: Campus | null;        // Selected campus or null
  setCampus: (campus: Campus) => void;
  clearCampus: () => void;
}
```

---

## Email Confirmation Bypass (Development Mode)

### Why Bypass Email Confirmation?

- Email confirmation requires SMTP configuration
- In development, email sending often fails
- Users should still be able to create accounts for testing
- Real email verification happens in production

### How It Works

When signup fails due to email error but user was created:

```typescript
// In signupWithBypass()
if (bypassEmail && error.message?.toLowerCase().includes("email") && data?.user?.id) {
  // User was created despite email error
  await bypassEmailConfirmation(data.user.id);
  // Mark email as verified in profiles table
}
```

### Testing Signup Without Email

1. Navigate to `/auth/signup`
2. Enter any email and password
3. If email sending fails but user is created, bypass is automatic
4. User proceeds to campus picker normally

### Manual Email Verification (for testing existing users)

```typescript
// In browser console
import { supabase } from './src/lib/supabaseClient';

// Directly update profiles table
await supabase
  .from('profiles')
  .update({ email_verified: true })
  .eq('id', '<USER_ID>');
```

---

## Demo Account

**Email:** `demo@test.com`  
**Password:** `demo123`

This account bypasses signup flow validation. Use for quick testing of login/home/navigation flows.

---

## Protected Routes

All these routes require authentication and campus selection:

- `/home` - Home feed
- `/explore` - Explore page
- `/alerts` - Alerts page
- `/profile` - User profile
- `/settings` - Settings page
- `/notifications` - Notifications
- `/confessions/*` - Confessions feed and posting
- `/marketplace/*` - Marketplace feed and posting
- `/events/*` - Events feed and posting
- `/food/*` - Food feed and posting
- `/notes/*` - Notes feed and posting
- `/roommates/*` - Roommates feed and posting

Public routes:

- `/` - Landing page
- `/auth/login` - Login
- `/auth/signup` - Signup
- `/auth/campuspicker` - Campus selection
- `/privacy-policy` - Privacy policy
- `/terms-and-conditions` - Terms and conditions

---

## Error Handling

### Login/Signup Errors

```typescript
// Handled errors:
- "Invalid login credentials" → Invalid email or password
- "Email not confirmed" → Account needs verification
- "Email send failed" → Bypassed for existing user
- "No user returned" → Unexpected error
- "Unexpected error" → Catch-all for other errors

// User sees friendly messages for each
```

### Campus Selection Errors

```typescript
- User not found → Redirect to login
- Upsert failed → Show error and retry button
- Invalid campus → Show error message
```

---

## Testing Checklist

### Signup Flow
- [ ] Create account with valid email/password
- [ ] See "Account created" success message
- [ ] Redirected to campus picker
- [ ] Select campus and go to home
- [ ] User persists on page refresh

### Login Flow
- [ ] Login with correct credentials
- [ ] See "Login successful" message
- [ ] Redirected to home
- [ ] Existing campus restored from DB

### Session Restoration
- [ ] Login and refresh page
- [ ] User still logged in (no redirect to login)
- [ ] Campus still selected

### Logout
- [ ] Click logout
- [ ] Redirected to login
- [ ] Session cleared on page refresh

### Protected Routes
- [ ] Try accessing `/home` while logged out
- [ ] Redirected to login
- [ ] Login and access protected routes
- [ ] Select campus, access all protected routes

### Error Cases
- [ ] Try login with wrong password
- [ ] See error message
- [ ] Try signup with mismatched passwords
- [ ] See validation error
- [ ] Try signup with demo@test.com
- [ ] See demo account created message

---

## Debugging Tips

### Check Auth State in Browser Console

```typescript
// Import the stores
import { useUserStore } from './src/store/useUserStore';
import { useCampusStore } from './src/store/useCampusStore';

// Get current state
const user = useUserStore.getState().user;
const authLoading = useUserStore.getState().authLoading;
const campus = useCampusStore.getState().campus;

console.log({ user, authLoading, campus });
```

### Check Supabase Session

```typescript
import { supabase } from './src/lib/supabaseClient';

const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### Check Profiles Table

```typescript
import { supabase } from './src/lib/supabaseClient';

// Get all profiles
const { data } = await supabase.from('profiles').select('*');
console.log('Profiles:', data);
```

### Monitor Auth Changes

```typescript
import { supabase } from './src/lib/supabaseClient';

// Listen to auth state changes
const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, 'Session:', session?.user?.id);
});
```

---

## Common Issues & Solutions

### Issue: "Email sending failed" on signup
**Solution:** This is expected in development. The bypass automatically handles it. Check browser console for confirmation.

### Issue: Login shows "Email not confirmed"
**Solution:** This shouldn't happen with bypass enabled. Check:
1. User actually created in Supabase
2. Email verification logic (check `bypassEmailConfirmation`)
3. Database migrations are applied

### Issue: Campus not restoring after login
**Solution:** 
1. Check profiles table has `campus_id` set
2. Check campuses table has the campus record
3. Clear browser localStorage and try again

### Issue: User stuck on campus picker after signup
**Solution:**
1. Campus picker should only appear when user has no campus
2. Try refreshing page
3. Check if campus selection actually saves to DB

### Issue: Infinite redirect loop
**Solution:**
1. Check useUserStore has user data
2. Check useCampusStore has campus data
3. Monitor auth listener for errors
4. Check ProtectedRoute logic

---

## Production Checklist

Before deploying to production:

- [ ] Email service configured (SendGrid, AWS SES, etc.)
- [ ] Email templates created for confirmation
- [ ] Remove email bypass (set `bypassEmail: false`)
- [ ] Test full signup/email flow
- [ ] Test password reset flow
- [ ] Enable security headers
- [ ] Enable rate limiting on auth endpoints
- [ ] Test OAuth providers if implemented
- [ ] Verify HTTPS everywhere
- [ ] Test on actual production Supabase project
- [ ] Setup monitoring for auth failures
- [ ] Document troubleshooting guide for support team

---

## API Reference

### useUserStore

```typescript
const user = useUserStore((s) => s.user);
const authLoading = useUserStore((s) => s.authLoading);

useUserStore.setState({
  user: { id: '123', email: 'test@example.com' },
  authLoading: false,
});
```

### useCampusStore

```typescript
const campus = useCampusStore((s) => s.campus);

useCampusStore.setState({
  campus: { id: '1', name: 'Kenyatta University', short_name: 'KU' },
});
```

### useAuthSession

```typescript
import { useAuthSession } from './src/lib/authHook';

const { loading } = useAuthSession();
// Returns: { loading: boolean }
// Automatically initializes auth and restores session
```

---

## File Structure

```
src/
├── lib/
│   ├── authHook.ts              # Main auth initialization & session management
│   ├── authUtils.ts             # Auth utilities (signup, login, profile, etc.)
│   ├── supabaseClient.ts        # Supabase client initialization
│   ├── profileApi.ts            # Profile API calls
│   └── ...
├── pages/
│   └── Auth/
│       ├── Login.tsx            # Login page
│       ├── SignUp.tsx           # Signup page
│       └── CampusPicker.tsx     # Campus selection page
├── components/
│   └── ProtectedRoute.tsx       # Protected route wrapper
├── store/
│   ├── useUserStore.ts          # User state management
│   ├── useAuthStore.ts          # Legacy auth store
│   ├── useCampusStore.ts        # Campus state management
│   └── ...
├── App.tsx                       # Main app with routes
└── main.tsx                      # Entry point
```

---

## Next Steps

1. **Implement Password Reset** - Add forgot password flow
2. **Add OAuth Providers** - Google, GitHub, Apple login
3. **Implement MFA** - Two-factor authentication
4. **Role-Based Access** - Admin, moderator, user roles
5. **Session Timeout** - Auto-logout after inactivity
6. **Email Notifications** - Send verification, welcome, etc.
7. **Analytics** - Track signup/login metrics
8. **Testing** - Add E2E tests for auth flows
