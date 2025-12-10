# Quick Start: Apply Campus Persistence Fix

## TL;DR - What to Do Right Now

### Step 1: Update Supabase Schema (2 minutes)
Copy and paste this SQL into your Supabase SQL Editor:

```sql
-- Add missing fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_all_campuses BOOLEAN DEFAULT FALSE;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_campus_id ON profiles(campus_id);

-- Add comments for documentation
COMMENT ON COLUMN profiles.phone IS 'User phone number for verification';
COMMENT ON COLUMN profiles.bio IS 'User bio/description';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image';
COMMENT ON COLUMN profiles.show_all_campuses IS 'Whether user wants to see content from all campuses';
```

**Where to paste:**
1. Go to https://supabase.com/dashboard/project/[YOUR_PROJECT]
2. Click "SQL Editor" on left
3. Click "New Query"
4. Paste the SQL above
5. Click "Run" (blue button)
6. ✅ Done!

### Step 2: Deploy Code (1 minute)
```bash
cd /workspaces/campus-hub
git add .
git commit -m "fix: add settings page and fix campus persistence"
git push origin main
```

### Step 3: Test (5 minutes)
1. **On the live app:**
   - Sign up with campus selection
   - Verify Home page shows campus short name
   - Go to Settings (gear icon in bottom nav)
   - Logout
   - Login again
   - ✅ Campus should still be there!

2. **Verify Settings works:**
   - Click Settings icon in BottomNav
   - Change campus in modal
   - Toggle "See All Campuses"
   - Logout/login
   - ✅ Changes should persist!

---

## What Actually Changed

### The Problem
When users logged out and back in, the app forgot which campus they selected. This was because the app wasn't loading the campus from the database when restoring the session.

### The Solution
Updated the auth hook (`src/lib/authHook.ts`) to:
1. When user logs in, fetch their `campus_id` from the `profiles` table
2. Use that ID to load the full campus data (name, short_name) from the `campuses` table
3. Store it in the app state
4. Now when they logout/login, it restores automatically

### Where to See It
- **Settings Page:** `/src/pages/Settings.tsx` (new file)
- **Auth Hook:** `/src/lib/authHook.ts` (fixed campus restore)
- **Database:** `/supabase/migrations/add_profile_fields.sql` (new columns)

---

## Troubleshooting

### "Campus still not persisting"
- [ ] Did you run the SQL migration? (Check Supabase profiles table has `show_all_campuses` column)
- [ ] Did you redeploy the code? (Hard refresh browser: Ctrl+Shift+R)
- [ ] Check browser console for errors (F12 → Console)

### "Supabase SQL didn't work"
- [ ] Make sure you're in the right Supabase project
- [ ] Check if `show_all_campuses` column already exists (no error if it does)
- [ ] Copy the entire SQL block at once, don't run line-by-line

### "Settings page doesn't show"
- [ ] Make sure you pushed the latest code
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Check you're logged in (BottomNav should show all icons)

---

## Files Changed Summary

```
NEW:
├── supabase/migrations/add_profile_fields.sql
├── src/pages/Settings.tsx
├── CHANGELOG.md
└── IMPLEMENTATION.md (this file)

MODIFIED:
├── src/App.tsx (+1 import, +1 route)
├── src/lib/authHook.ts (+20 lines for DB sync)
├── src/pages/Profile.tsx (-15 lines, removed toggle)
└── src/components/BottomNav.tsx (+1 Settings button)
```

---

## Questions?

Check these files for detailed documentation:
- **IMPLEMENTATION.md** — Full technical documentation
- **CHANGELOG.md** — Detailed change log with rollback instructions
- **src/pages/Settings.tsx** — Code comments explain Settings page
- **src/lib/authHook.ts** — Code comments explain campus restoration logic

---

## Build Status ✅
- TypeScript: Compiles without errors
- Vite: Production build successful
- Ready to deploy!

---

**That's it!** You're done. The campus persistence bug is fixed, and users now have a dedicated Settings page. 🎉
