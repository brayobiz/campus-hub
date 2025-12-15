# Campus Hub Authentication - Setup & Testing Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase project created (with tables migrated)
- Environment variables configured

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` with:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Dev Server
```bash
npm run dev
```

Server runs at `http://localhost:5174` (or next available port)

---

## Authentication Flows - Testing Guide

### Flow 1: Create New Account (Signup)

**Steps:**
1. Navigate to `http://localhost:5174`
2. Click "Get Started" or "Sign Up"
3. Enter details:
   - Full Name: Any name
   - Email: test@example.com (or any email)
   - Password: Test123! (min 6 chars, recommended: mix of upper/lower/numbers)
   - Confirm: Same password
4. Click "Create Account"

**Expected Behavior:**
- Form validates password match
- Shows loading spinner during signup
- If email fails (expected in dev): Automatically bypasses
- Success message appears
- Redirects to campus picker (after 1s)

**Result:**
- User account created in Supabase Auth
- Profile created in `profiles` table
- User ready to select campus

---

### Flow 2: Select Campus

**Steps:**
1. You'll be on Campus Picker page (automatically after signup)
2. Search (optional) or scroll campus list
3. Click any campus (e.g., "Kenyatta University")
4. Wait for "Updating campus..." to complete

**Expected Behavior:**
- Campus list loads from database (or shows defaults)
- Selection button shows loading state
- Campus saves to user's profile
- Campus appears in useCampusStore
- Redirects to Home page (after update)

**Result:**
- User profile has `campus_id` set
- Campus state persists in browser localStorage
- Access to protected pages granted

---

### Flow 3: Login to Existing Account

**Steps:**
1. Logout first (if still logged in) via Settings
2. Navigate to `/auth/login`
3. Enter credentials:
   - Email: test@example.com (from signup)
   - Password: Test123!
4. Click "Sign In"

**Expected Behavior:**
- Form validates required fields
- Shows loading spinner during login
- Session established
- Success message appears
- Redirects to Home (after 0.8s)
- Campus auto-restored from database

**Result:**
- User logged in and authenticated
- Session persists across page refreshes
- Access to all protected routes

---

### Flow 4: Session Restoration

**Steps:**
1. Login to account (see Flow 3)
2. Refresh the page (F5 or Cmd+R)
3. Wait for loading to complete

**Expected Behavior:**
- App shows initial loading spinner
- Checks for existing session
- Finds session and restores user data
- Restores campus from profiles table
- Page content loads normally
- User never redirected to login

**Result:**
- Session persists across refreshes
- User stays authenticated indefinitely
- Campus selection remembered

---

### Flow 5: Logout

**Steps:**
1. Login (see Flow 3)
2. Go to Settings page (bottom navigation)
3. Look for "Logout" or account section
4. Click logout button

**Expected Behavior:**
- Shows confirmation (if implemented)
- Session cleared
- Stores cleared
- Redirects to login page

**Result:**
- User no longer authenticated
- Page refresh redirects to login
- Session completely cleared

---

## Demo Account Testing

**Credentials:**
- Email: `demo@test.com`
- Password: `demo123`

This account is hardcoded to bypass signup validation. Use it to quickly test:
- Login flow
- Home page navigation
- Logout flow
- UI without creating new accounts

**To use:**
1. Go to `/auth/signup`
2. Enter email: `demo@test.com`
3. Any password
4. Click create - see success message
5. Logout and login with `demo@test.com / demo123`

---

## Testing Protected Routes

### Test Access Control

**Logged out:**
- Try visiting `/home` → Redirects to `/auth/login`
- Try visiting `/profile` → Redirects to `/auth/login`
- Try visiting `/explore` → Redirects to `/auth/login`

**Logged in without campus:**
- Login successfully
- Don't select campus
- Try visiting `/home` → Redirects to `/auth/campuspicker`

**Logged in with campus:**
- Login and select campus
- Visit any protected route → Should load normally

### Test Protected Route Components

All these should require auth + campus:
- `/home` - Home feed
- `/explore` - Explore page
- `/alerts` - Alerts
- `/profile` - Profile
- `/settings` - Settings
- `/notifications` - Notifications
- `/confessions/*` - Confessions
- `/marketplace/*` - Marketplace
- `/events/*` - Events
- `/food/*` - Food
- `/notes/*` - Notes
- `/roommates/*` - Roommates

---

## Error Scenarios Testing

### Wrong Password
1. Go to `/auth/login`
2. Enter correct email but wrong password
3. Click "Sign In"

**Expected:** "Invalid email or password" error

### Mismatched Passwords (Signup)
1. Go to `/auth/signup`
2. Password: "Test123!"
3. Confirm: "Different123!"
4. Click "Create Account"

**Expected:** "Passwords do not match" error

### Non-existent User (Login)
1. Go to `/auth/login`
2. Email: "nonexistent@test.com"
3. Password: anything
4. Click "Sign In"

**Expected:** "Invalid email or password" error

### No Email (Signup)
1. Go to `/auth/signup`
2. Leave email empty
3. Fill other fields
4. Click "Create Account"

**Expected:** Browser validation prevents submission

### Email Already Exists
1. Signup with "test@example.com"
2. Logout
3. Try signing up again with same email
4. Click "Create Account"

**Expected:** "Email already registered" error

---

## Debugging Authentication Issues

### Check Authentication State

Open browser console and run:

```javascript
// Check if user is in store
import { useUserStore } from './src/store/useUserStore';
const state = useUserStore.getState();
console.log('User:', state.user);
console.log('Auth Loading:', state.authLoading);
```

### Check Campus State

```javascript
import { useCampusStore } from './src/store/useCampusStore';
const state = useCampusStore.getState();
console.log('Campus:', state.campus);
```

### Check Supabase Session

```javascript
import { supabase } from './src/lib/supabaseClient';
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session?.user?.id);
console.log('Email:', session?.user?.email);
```

### Monitor Auth Events

```javascript
import { supabase } from './src/lib/supabaseClient';

const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Has session:', !!session);
});

// To stop listening:
// listener.subscription.unsubscribe();
```

### Check Browser Storage

Open DevTools → Application/Storage:
1. **LocalStorage** → Look for `user-store` and `campus-store`
2. **SessionStorage** → Check for Supabase session
3. **IndexedDB** → Check Supabase data

### Check Network Requests

Open DevTools → Network tab:
1. Look for `/auth/v1/` requests (Supabase API)
2. Check response status (should be 200 for success)
3. Check request/response bodies for errors

### View Server Logs

In terminal where `npm run dev` runs:
1. Look for `[vite]` messages
2. Check for TypeScript/build errors
3. Look for warnings about missing dependencies

---

## Supabase Database Checks

### Verify Users Created

```sql
SELECT id, email, email_confirmed_at FROM auth.users;
```

### Verify Profiles Created

```sql
SELECT id, email, name, campus_id, created_at FROM profiles;
```

### Verify Campus Table

```sql
SELECT id, name, short_name FROM campuses;
```

### Check Profile Relationships

```sql
SELECT 
  p.id, 
  p.email, 
  p.campus_id,
  c.name as campus_name
FROM profiles p
LEFT JOIN campuses c ON p.campus_id = c.id;
```

---

## Performance Monitoring

### Auth Load Time

1. Open DevTools → Performance tab
2. Start recording
3. Navigate to `/auth/login`
4. Stop recording
5. Look for `useAuthSession` initialization

Should complete in < 1 second.

### Session Restoration

1. Login (fully load home page)
2. Open DevTools → Performance tab
3. Refresh page
4. Stop recording
5. Total time should be < 500ms after page load

---

## Common Issues & Solutions

### Issue: Blank page on startup
**Solution:**
- Check browser console for errors
- Check `npm run dev` terminal for build errors
- Clear browser cache and refresh
- Check Supabase credentials in `.env.local`

### Issue: Can't login (all credentials rejected)
**Solution:**
- Check user actually exists in Supabase Auth
- Check email/password exactly match (case-sensitive)
- Try with demo account first
- Check `.env.local` has correct Supabase credentials

### Issue: Campus not persisting after logout/login
**Solution:**
- Refresh page - campus should restore from DB
- Check `campuses` table has the campus record
- Check `profiles` table shows correct `campus_id`

### Issue: Always redirected to login
**Solution:**
- Check `useUserStore` has user data: `useUserStore.getState().user`
- Check Supabase session exists: `supabase.auth.getSession()`
- Clear localStorage and try again
- Check for console errors

### Issue: Auth loading never completes
**Solution:**
- Check network tab for Supabase API errors
- Check browser console for JavaScript errors
- Restart dev server: `npm run dev`
- Check Supabase URL/key in `.env.local`

### Issue: Signup successful but profile not created
**Solution:**
- Signup doesn't require profile
- Profile created after account creation
- Check `profiles` table in Supabase
- If missing, manually create profile for user ID

---

## File Reference

Key files for authentication:

| File | Purpose |
|------|---------|
| `src/lib/authHook.ts` | Main auth initialization & session restoration |
| `src/lib/authUtils.ts` | Signup, login, profile, campus utilities |
| `src/pages/Auth/Login.tsx` | Login page component |
| `src/pages/Auth/SignUp.tsx` | Signup page component |
| `src/pages/Auth/CampusPicker.tsx` | Campus selection component |
| `src/components/ProtectedRoute.tsx` | Route protection wrapper |
| `src/store/useUserStore.ts` | User state management |
| `src/store/useCampusStore.ts` | Campus state management |
| `src/App.tsx` | Main app with auth initialization |

---

## Next Steps After Auth Works

1. **Test all protected pages** - Ensure access control works
2. **Test campus switching** - User should be able to change campus
3. **Test on mobile** - Responsive design on phones
4. **Load testing** - Multiple users signing up
5. **Error recovery** - Network failures, timeouts
6. **Analytics** - Track signup/login success rates
7. **Email setup** - Real email confirmation in production
8. **Password reset** - Implement forgot password flow

---

## Production Deployment

When deploying to production:

1. **Email Service** - Setup SendGrid/AWS SES for real emails
2. **Remove Bypass** - Change `signupWithBypass(..., true)` to `false`
3. **Verify Credentials** - Use production Supabase project
4. **Enable HTTPS** - All auth must use HTTPS
5. **Test Full Flow** - Complete signup/login with real email
6. **Monitor Errors** - Setup error tracking (Sentry, etc.)
7. **Setup Backups** - Backup Supabase data regularly
8. **Security Audit** - Review auth security practices

---

## Support & Documentation

- **Supabase Docs:** https://supabase.com/docs
- **Auth System Docs:** See `AUTH_SYSTEM.md` in root directory
- **Zustand Docs:** https://github.com/pmndrs/zustand
- **React Router Docs:** https://reactrouter.com

---

## Quick Command Reference

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Check TypeScript
npx tsc --noEmit

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json && npm install
```

---

Generated: 2024
Campus Hub Authentication System v1.0
