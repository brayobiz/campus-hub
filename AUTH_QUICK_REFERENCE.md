# Campus Hub Authentication - Quick Reference

## 🎯 Quick Links

- **Full System Docs:** [AUTH_SYSTEM.md](AUTH_SYSTEM.md)
- **Testing Guide:** [AUTH_SETUP_GUIDE.md](AUTH_SETUP_GUIDE.md)
- **Implementation Checklist:** [AUTH_IMPLEMENTATION_CHECKLIST.md](AUTH_IMPLEMENTATION_CHECKLIST.md)
- **Complete Summary:** [AUTHENTICATION_COMPLETE.md](AUTHENTICATION_COMPLETE.md)

---

## ⚡ Quick Start

### 1. Install & Setup
```bash
bash setup-auth.sh
npm run dev
```

### 2. Create Account
- Go to `http://localhost:5174/auth/signup`
- Enter email, password, campus
- Done! (Email bypass enabled for dev)

### 3. Login
- Go to `http://localhost:5174/auth/login`
- Use demo: `demo@test.com` / `demo123`
- Or use account you created

### 4. Access Home
- Auto-redirects after login
- Select campus if prompted
- See home feed

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `src/lib/authHook.ts` | Session initialization & restoration |
| `src/lib/authUtils.ts` | Auth utilities (signup, login, etc.) |
| `src/pages/Auth/Login.tsx` | Login page |
| `src/pages/Auth/SignUp.tsx` | Signup page |
| `src/pages/Auth/CampusPicker.tsx` | Campus selection |
| `src/store/useUserStore.ts` | User state (Zustand) |
| `src/store/useCampusStore.ts` | Campus state (Zustand) |
| `src/components/ProtectedRoute.tsx` | Route protection |

---

## 📋 State Management

### useUserStore
```javascript
const user = useUserStore((s) => s.user);           // Current user
const authLoading = useUserStore((s) => s.authLoading);  // Loading state

useUserStore.setState({ user: null });              // Logout
useUserStore.setState({ authLoading: true });       // Start loading
```

### useCampusStore
```javascript
const campus = useCampusStore((s) => s.campus);     // Current campus
useCampusStore.setState({ campus: null });          // Clear campus
```

---

## 🚀 Flows Summary

### Signup
```
Form → signupWithBypass() → Create Profile → Campus Picker → Home
```

### Login
```
Form → signInWithPassword() → Restore Campus → Home
```

### Session Init
```
App Start → getSession() → Restore User → Restore Campus → Ready
```

### Logout
```
Click Logout → Clear Stores → signOut() → Login Page
```

---

## 🧪 Quick Test Checklist

- [ ] Signup with new email
- [ ] See success message
- [ ] Select campus
- [ ] See home page
- [ ] Refresh page (stay logged in)
- [ ] Logout
- [ ] Login with same email
- [ ] Campus auto-restored
- [ ] Try accessing `/home` while logged out (redirect to login)

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| "Port in use" | Dev server uses next port automatically |
| "Not authenticated" | Login first, then try again |
| "No campus" | Select campus from campus picker |
| "Blank page" | Check browser console for errors |
| "Email send failed" | Normal in dev, bypass enabled |

---

## 🔍 Debug Commands

### Check User State
```javascript
useUserStore.getState().user
useUserStore.getState().authLoading
```

### Check Campus State
```javascript
useCampusStore.getState().campus
```

### Check Supabase Session
```javascript
import { supabase } from './src/lib/supabaseClient';
const { data: { session } } = await supabase.auth.getSession();
console.log(session?.user?.id);
```

### Check Database
```sql
-- Check users
SELECT id, email FROM auth.users;

-- Check profiles
SELECT id, email, campus_id FROM profiles;

-- Check campuses
SELECT id, name FROM campuses;
```

---

## 🎯 API Quick Reference

### useAuthSession()
```typescript
const { loading } = useAuthSession();
// Runs on app startup, initializes auth
```

### signupWithBypass()
```typescript
const { userId } = await signupWithBypass(
  email,
  password,
  fullname,
  bypassEmail // true for dev, false for prod
);
```

### createUserProfile()
```typescript
await createUserProfile(userId, email, fullname);
```

### updateUserCampus()
```typescript
await updateUserCampus(userId, campusId);
```

### logoutUser()
```typescript
await logoutUser();  // Signs out user
```

---

## 📱 Protected Routes

These routes require auth + campus:
```
/home, /explore, /alerts, /profile, /settings,
/notifications, /confessions/*, /marketplace/*,
/events/*, /food/*, /notes/*, /roommates/*
```

These routes are public:
```
/, /auth/login, /auth/signup, /auth/campuspicker,
/privacy-policy, /terms-and-conditions
```

---

## 🔐 Demo Account

```
Email: demo@test.com
Password: demo123
```

Use for quick testing without creating accounts.

---

## 📞 Need Help?

1. **Architecture questions?** → See AUTH_SYSTEM.md
2. **Testing/debugging?** → See AUTH_SETUP_GUIDE.md
3. **Deployment?** → See AUTH_IMPLEMENTATION_CHECKLIST.md
4. **Code explanation?** → Check inline comments
5. **Still stuck?** → Check browser console for error message

---

## 🚀 Production Checklist

Before going live:
- [ ] Email service configured (SendGrid, AWS SES)
- [ ] Disable email bypass: `signupWithBypass(..., false)`
- [ ] Use production Supabase project
- [ ] Test email verification works
- [ ] Enable HTTPS
- [ ] Setup error monitoring
- [ ] Test with real users
- [ ] Backup plan in place

---

## 📊 File Structure Overview

```
src/
├── lib/
│   ├── authHook.ts          ← Main init
│   ├── authUtils.ts         ← Utilities
│   └── supabaseClient.ts    ← Supabase
├── pages/Auth/
│   ├── Login.tsx            ← Login page
│   ├── SignUp.tsx           ← Signup page
│   └── CampusPicker.tsx     ← Campus select
├── components/
│   └── ProtectedRoute.tsx   ← Route guard
├── store/
│   ├── useUserStore.ts      ← User state
│   ├── useCampusStore.ts    ← Campus state
│   └── useAuthStore.ts      ← Legacy auth
└── App.tsx                  ← Routes
```

---

## 🎓 Key Concepts

### AuthLoading State
Global loading indicator while checking/performing auth. Used by:
- Signup button
- Login button
- Campus selection button

Prevents multiple submissions and gives user feedback.

### Session Restoration
On app startup:
1. Check if valid session exists
2. Fetch user data if found
3. Fetch campus data from DB
4. Update stores
5. Allow routing

All happens automatically without blocking UI.

### Protected Routes
Two-level protection:
1. User must be logged in (have user in store)
2. User must have selected campus

If either is missing, redirects to appropriate page.

### Email Bypass
In development, if email service isn't configured:
1. User created even if email fails
2. Marked as verified automatically
3. Can proceed without email confirmation

In production, this is disabled and email is required.

---

## ✨ Features at a Glance

| Feature | Status | Details |
|---------|--------|---------|
| Email/Password Auth | ✅ | Full signup & login |
| Session Management | ✅ | Persists, restores, manages |
| Campus Selection | ✅ | Required, persists |
| Protected Routes | ✅ | Auth + campus enforcement |
| Error Handling | ✅ | User-friendly messages |
| Loading States | ✅ | Prevents double-submit |
| Email Bypass | ✅ | Dev mode only |
| Mobile Responsive | ✅ | Works on all devices |

---

## 🎯 Common Tasks

### Change Campus
User clicks "Change Campus" → Redirects to campus picker → Selects new campus → Profile updated

### Reset Password
Not implemented yet. Recommended for Phase 2.

### Delete Account
Not implemented yet. Recommended for Phase 2.

### Change Email
Not implemented yet. Recommended for Phase 2.

### Two-Factor Auth
Not implemented yet. Recommended for Phase 3.

---

## 📚 Documentation Files

All documentation is in root directory:

1. **AUTH_SYSTEM.md** - Complete system documentation
2. **AUTH_SETUP_GUIDE.md** - Setup and testing guide
3. **AUTH_IMPLEMENTATION_CHECKLIST.md** - Status and checklists
4. **AUTHENTICATION_COMPLETE.md** - Implementation summary
5. **AUTH_QUICK_REFERENCE.md** - This file

Read them in order for best understanding!

---

**Status:** ✅ Complete & Ready
**Last Updated:** 2024
**Version:** 1.0.0

Made with ❤️ for Campus Hub
