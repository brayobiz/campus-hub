# Campus Persistence Bug Fix & Settings Implementation

## Summary
This update implements a dedicated Settings page and fixes a critical bug where campus selection was not persisting after logout/login.

## What Changed

### 1. **Critical Bug Fix: Campus Persistence** ✅
- **Problem:** When users logged out and logged back in, the selected campus was forgotten.
- **Root Cause:** The `authHook.ts` was not restoring campus data from Supabase after session recovery.
- **Solution:** Updated `useAuthSession()` to:
  - Fetch `campus_id` from the `profiles` table during initial session check
  - Query the `campuses` table to get full campus data (id, name, short_name)
  - Restore campus state in `useCampusStore` on every login
  - Also restore on auth state changes and clear on logout

### 2. **Settings Page** ✅
Created `/src/pages/Settings.tsx` with:
- **Campus Selection:** Modal with dropdown to change campus preference
- **Show All Campuses Toggle:** Preference to see content from all campuses (saved to DB)
- **Notifications:** Placeholder for notification settings
- **Privacy:** Placeholder for privacy settings
- **Logout Button:** Quick access to sign out

Features:
- Dark glassmorphic design matching auth pages
- Syncs all settings to Supabase `profiles` table
- Loading states and error handling
- Responsive mobile-first layout

### 3. **Settings Route & Navigation** ✅
- Added `/settings` route to `src/App.tsx` (protected by `ProtectedRoute`)
- Added Settings icon/button to `src/components/BottomNav.tsx`
- Updated Profile page to link to Settings (gear icon at top-right)

### 4. **Code Cleanup** ✅
- Removed old campus content toggle from Profile page
- Removed `showAllCampuses` state variable from Profile
- Simplified posts filtering (moved campus filtering to Settings)

### 5. **Database Schema Migration** ✅
Created `/supabase/migrations/add_profile_fields.sql` to add:
- `phone` (TEXT) — for phone verification
- `bio` (TEXT) — for profile bio/description
- `avatar_url` (TEXT) — for profile picture storage
- `show_all_campuses` (BOOLEAN DEFAULT FALSE) — for Settings toggle
- Index on `campus_id` for faster lookups

## How to Apply the Changes

### Step 1: Apply Supabase Migration
Run the migration SQL on your Supabase database:

```bash
# Option A: Using Supabase CLI (recommended)
supabase migration up

# Option B: Run SQL in Supabase Dashboard
# 1. Go to SQL Editor in your Supabase Dashboard
# 2. Paste the contents of supabase/migrations/add_profile_fields.sql
# 3. Click "Run"
```

### Step 2: Verify Profiles Table
In Supabase Dashboard, go to `profiles` table and verify these columns exist:
- `id` (uuid, primary key)
- `email` (text)
- `name` (text)
- `year` (text)
- `major` (text)
- `campus_id` (uuid, foreign key to campuses.id)
- `is_premium` (boolean)
- **`phone` (text)** ← NEW
- **`bio` (text)** ← NEW
- **`avatar_url` (text)** ← NEW
- **`show_all_campuses` (boolean)** ← NEW

### Step 3: Check Campuses Table
Verify the `campuses` table has:
- `id` (uuid, primary key)
- `name` (text) — full name, e.g., "Kenyatta University"
- `short_name` (text) — short code, e.g., "KU"

If `short_name` is missing, add it:
```sql
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS short_name TEXT;
```

### Step 4: Deploy Updated Code
```bash
# Install dependencies and build
npm install
npm run build

# Deploy to production (e.g., Vercel, Netlify)
git add .
git commit -m "Fix: Add Settings page and fix campus persistence bug"
git push
```

## Testing the Full Flow

### Test 1: Campus Persists After Login ✅
```
1. Sign up as new user
2. Select a campus in the CampusPicker modal
3. Verify Home page shows the selected campus short name
4. Go to Settings (gear icon in BottomNav)
5. Verify campus is pre-selected in the Campus Selection modal
6. Close Settings and go to Profile
7. Click gear icon → navigate to Settings
8. Logout
9. Login with same credentials
10. ✅ EXPECTED: Campus should still be remembered and shown in Settings
```

### Test 2: Show All Campuses Toggle ✅
```
1. On Settings page, toggle "See All Campuses" ON
2. Notice the toggle updates visually
3. (In future, feed pages should respect this preference)
4. Toggle OFF
5. Logout and login
6. ✅ EXPECTED: Preference should be remembered (show_all_campuses saved in DB)
```

### Test 3: Settings Navigation ✅
```
1. From Home, tap Settings icon in BottomNav
2. ✅ EXPECTED: Navigate to /settings page
3. From Profile, click gear icon at top-right
4. ✅ EXPECTED: Navigate to /settings page
5. Click back/close to return to previous page
```

### Test 4: Campus Change ✅
```
1. On Settings, open "Your Campus" modal
2. Select a different campus
3. Close modal
4. ✅ EXPECTED: Campus should update (show save UI or auto-save)
5. Navigate to Home
6. ✅ EXPECTED: Home page should show new campus name
7. Logout and login
8. ✅ EXPECTED: New campus should persist
```

## Files Changed

### New Files
- `/supabase/migrations/add_profile_fields.sql` — Database schema migration
- `/src/pages/Settings.tsx` — New Settings page (300+ lines)

### Modified Files
- `/src/App.tsx` — Added Settings import and route
- `/src/lib/authHook.ts` — Fixed campus persistence bug (now fetches from DB on login)
- `/src/pages/Profile.tsx` — Removed old campus toggle, linked to Settings
- `/src/components/BottomNav.tsx` — Added Settings icon to navigation

## Known Limitations & Future Improvements

### Current Limitations
1. Settings notifications/privacy sections are placeholders (need implementation)
2. Feed pages don't yet respect the `show_all_campuses` preference
3. No email/phone verification UI in Settings (exists in Profile's ContactSheet)
4. Bio and avatar_url fields in DB not yet used in UI

### Future Enhancements
- [ ] Connect feed pages (Home, Explore, etc.) to respect show_all_campuses setting
- [ ] Add bio and avatar editing to Settings
- [ ] Implement notification preferences (email, push, in-app)
- [ ] Implement privacy settings (account visibility, DM controls, etc.)
- [ ] Add profile picture upload to avatar_url

## Build Status
✅ TypeScript build passes (0 errors, 0 warnings)
✅ Vite production build successful

## Rollback Instructions
If you need to rollback:

```bash
# Option 1: Using Git (if not deployed yet)
git reset HEAD~1

# Option 2: Remove migration columns from Supabase
# In SQL Editor, run:
ALTER TABLE profiles DROP COLUMN IF EXISTS phone;
ALTER TABLE profiles DROP COLUMN IF EXISTS bio;
ALTER TABLE profiles DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS show_all_campuses;
DROP INDEX IF EXISTS idx_profiles_campus_id;
```

---

**Questions?** Check the commented code in `/src/pages/Settings.tsx` and `/src/lib/authHook.ts` for implementation details.
