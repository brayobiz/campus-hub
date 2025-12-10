# Complete User Profile Schema Design

## Problems Identified

### 1. **Redundant Campus Modals**
- Campus selection modal exists in BOTH Profile and Settings
- Creates confusion about where to change campus
- Duplicated code and logic

**Solution:** Remove campus modal from Profile completely. Profile shows read-only campus info with "Edit in Settings" link. Only Settings has the modal.

### 2. **Email Verification Confusion**
- ContactSheet in Profile has email verification
- Settings doesn't have email verification
- No way to add school email specifically
- User created account with personal email, might want to verify school email

**Solution:** 
- Add `school_email` field to profiles table
- Unify email verification in Settings (not Profile)
- Profile shows verification status only
- Settings has the action buttons (resend, change, verify)

### 3. **Email Verification Types Not Tracked**
- Can't distinguish between personal email and school email verification
- Can't track which email is verified

**Solution:**
- `email_verified` → personal email verified (bool)
- `school_email_verified` → school email verified (bool)
- `verified_at` → when email was verified (timestamp)
- `school_email_verified_at` → when school email was verified (timestamp)

### 4. **Profile Page Has Too Many Modals**
- CampusSheet (should be in Settings)
- ContactSheet (should be in Settings)
- YearSheet (keep in Profile)
- PremiumSheet (keep in Profile)
- EditProfileSheet (keep in Profile)

**Solution:** Move campus and contact verification to Settings. Profile focuses on profile picture, name, year, major, bio edits.

---

## Complete Profiles Table Schema

```sql
CREATE TABLE profiles (
  -- AUTH & IDENTITY
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- PERSONAL INFO
  name TEXT,                    -- Full name (from signup)
  email TEXT UNIQUE,            -- Personal email (from signup)
  phone TEXT,                   -- Phone number (optional)
  bio TEXT,                     -- User bio/description
  avatar_url TEXT,              -- Profile picture URL
  
  -- SCHOOL INFO
  campus_id UUID REFERENCES campuses(id),  -- Selected campus
  year TEXT,                    -- Academic year (1st, 2nd, 3rd, etc)
  major TEXT,                   -- Field of study
  school_email TEXT UNIQUE,     -- School email for verification
  
  -- VERIFICATION STATUS
  email_verified BOOLEAN DEFAULT FALSE,           -- Personal email verified
  email_verified_at TIMESTAMP,                    -- When personal email verified
  school_email_verified BOOLEAN DEFAULT FALSE,    -- School email verified
  school_email_verified_at TIMESTAMP,             -- When school email verified
  phone_verified BOOLEAN DEFAULT FALSE,           -- Phone verified
  phone_verified_at TIMESTAMP,                    -- When phone verified
  
  -- PREFERENCES
  show_all_campuses BOOLEAN DEFAULT FALSE,  -- Show content from all campuses
  is_premium BOOLEAN DEFAULT FALSE,         -- Premium account status
  
  -- METADATA
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- CONSTRAINTS
  UNIQUE(school_email)  -- School email must be unique
);

-- Indexes for performance
CREATE INDEX idx_profiles_campus_id ON profiles(campus_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_school_email ON profiles(school_email);
```

### Field Descriptions

#### Auth & Identity
- **id** — User ID from Supabase auth
- **name** — Full name (from user_metadata during signup)
- **email** — Personal email (from Supabase auth, readonly)
- **phone** — Phone number for contact/verification
- **bio** — User bio or description
- **avatar_url** — URL to user's profile picture

#### School Info
- **campus_id** — Selected campus (set during signup or changed in Settings)
- **year** — Academic year (1st, 2nd, 3rd, 4th, Postgrad)
- **major** — Field of study (Computer Science, Business, etc)
- **school_email** — Separate school/institution email for verification

#### Verification Status
- **email_verified** — Is personal email verified? (bool)
- **email_verified_at** — When was personal email verified? (timestamp)
- **school_email_verified** — Is school email verified? (bool)
- **school_email_verified_at** — When was school email verified? (timestamp)
- **phone_verified** — Is phone number verified? (bool)
- **phone_verified_at** — When was phone verified? (timestamp)

#### Preferences
- **show_all_campuses** — Should feed show all campus content? (bool, default FALSE)
- **is_premium** — Is this a premium account? (bool, default FALSE)

#### Metadata
- **created_at** — Account creation timestamp
- **updated_at** — Last profile update timestamp

---

## Complete Campuses Table Schema

```sql
CREATE TABLE campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE,                  -- Full name: "Kenyatta University"
  short_name TEXT UNIQUE,            -- Short code: "KU"
  location TEXT,                     -- City/location: "Nairobi"
  website TEXT,                      -- University website
  email_domain TEXT,                 -- For school email verification: "ku.ac.ke"
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_campuses_name ON campuses(name);
CREATE INDEX idx_campuses_short_name ON campuses(short_name);
CREATE INDEX idx_campuses_email_domain ON campuses(email_domain);
```

### Field Descriptions
- **id** — Unique campus identifier
- **name** — Full name of campus/university
- **short_name** — Abbreviation (KU, UoN, JKUAT, etc)
- **location** — City where campus is located
- **website** — Official website URL
- **email_domain** — Email domain for school email validation (e.g., "ku.ac.ke")

---

## Page Responsibility Matrix

### Settings Page SHOULD HAVE
```
✅ Campus selection modal
✅ School email verification section
   ├─ Add school email input
   ├─ Send verification button
   ├─ OTP or link verification
   └─ Verification status display
✅ Show all campuses toggle
✅ Notification preferences (placeholder)
✅ Privacy settings (placeholder)
✅ Logout button
```

### Profile Page SHOULD HAVE
```
✅ Read-only campus display (with "Edit in Settings" link)
✅ Name edit
✅ Year edit (dropdown)
✅ Major edit
✅ Bio edit
✅ Avatar upload
✅ Verification status display (email, school_email, phone)
   └─ "Complete verification in Settings" link
✅ Premium status display
✅ Profile stats (followers, posts, rating)
✅ NO campus selection modal
✅ NO email verification buttons (moved to Settings)
```

---

## Data Flow Examples

### Example 1: User Signup
```
1. User enters email (personal): user@gmail.com
   └─ Stored in auth.users(email) [Supabase managed]
   └─ Stored in profiles(email) [copy for easy access]

2. User selects campus in CampusPicker
   └─ profiles(campus_id) = "kenyatta_u_id"

3. User sees home page
   └─ Shows: "Welcome John" + "📍 Kenyatta University (KU)"
   └─ Campus comes from profiles.campus_id → campuses table

4. User has not yet verified email
   └─ auth.users(email_confirmed_at) is NULL
   └─ profiles(email_verified) = FALSE
```

### Example 2: User Adds School Email
```
1. User goes to Settings
2. Clicks "Add School Email"
3. Enters: john@ku.ac.ke
   └─ profiles(school_email) = "john@ku.ac.ke"
   └─ profiles(school_email_verified) = FALSE

4. Clicks "Send Verification Link"
   └─ Supabase sends verification email to school_email
   └─ User clicks link in email

5. Email verified
   └─ profiles(school_email_verified) = TRUE
   └─ profiles(school_email_verified_at) = NOW()

6. Profile page shows badge: "School Email ✓"
```

### Example 3: User Changes Campus
```
1. User in Settings, clicks campus modal
2. Selects "University of Nairobi"
   └─ profiles(campus_id) = "uon_id"
   └─ useCampusStore updated
   └─ authHook restores on next login

3. Home page updates
   └─ Shows: "📍 University of Nairobi (UoN)"

4. Profile shows read-only: "📍 University of Nairobi"
   └─ With link: "Change in Settings →"
```

---

## Migration SQL

```sql
-- Add missing fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_email TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_email_verified_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

-- Enhance campuses table
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS email_domain TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_school_email ON profiles(school_email);
CREATE INDEX IF NOT EXISTS idx_campuses_email_domain ON campuses(email_domain);

-- Add comments
COMMENT ON COLUMN profiles.email_verified IS 'Whether personal email is verified';
COMMENT ON COLUMN profiles.school_email IS 'User school/institutional email';
COMMENT ON COLUMN profiles.school_email_verified IS 'Whether school email is verified';
COMMENT ON COLUMN campuses.email_domain IS 'Email domain for verification (e.g., ku.ac.ke)';
```

---

## UI Component Mapping

### Settings.tsx SHOULD RENDER
```
<Settings>
  ├─ <Header>Settings</Header>
  ├─ <CampusSection>
  │  ├─ Your Campus: "Kenyatta University (KU)"
  │  └─ [Edit Campus] Modal
  ├─ <EmailVerificationSection>
  │  ├─ Personal Email: user@gmail.com [Verified ✓ / Not Verified]
  │  ├─ School Email: [Input to add/change]
  │  ├─ [Send Verification] Button
  │  └─ School Email: john@ku.ac.ke [Verified ✓ / Pending]
  ├─ <PhoneSection>
  │  ├─ Phone: +254 7XX XXX XXX
  │  └─ [Verify Phone] Button
  ├─ <PreferencesSection>
  │  └─ Show All Campuses [Toggle]
  ├─ <NotificationsSection> Placeholder
  ├─ <PrivacySection> Placeholder
  └─ <LogoutButton>Sign Out</LogoutButton>
```

### Profile.tsx SHOULD RENDER
```
<Profile>
  ├─ <Header>Profile</Header>
  ├─ <ProfileCard>
  │  ├─ [Avatar / Upload Picture]
  │  ├─ Name: John Doe [Edit]
  │  ├─ Campus: 📍 Kenyatta University (KU) [Change in Settings →]
  │  ├─ Year: 3rd Year [Edit]
  │  └─ Major: Computer Science [Edit]
  ├─ <BioSection>
  │  └─ Bio: "Tech enthusiast..." [Edit]
  ├─ <VerificationStatus>
  │  ├─ Email: user@gmail.com [Verified ✓ / Verify in Settings →]
  │  ├─ School Email: john@ku.ac.ke [Verified ✓ / Add in Settings →]
  │  └─ Phone: +254 7XX XXX XXX [Verified ✓ / Verify in Settings →]
  ├─ <PremiumStatus>
  │  └─ Upgrade to Premium [Button]
  └─ <ProfileStats>
     ├─ Posts: 42
     ├─ Followers: 128
     └─ Rating: 4.8/5
```

---

## Summary of Changes

| Component | Current | Should Be | Change |
|-----------|---------|-----------|--------|
| Campus Modal | In Profile + Settings | Only in Settings | Remove from Profile |
| Email Verification | In Profile only | In Settings only | Move to Settings |
| School Email | ❌ Missing | Add field | New field + migration |
| Profile Role | Edit + Settings | Read-only display | Remove settings actions |
| Settings Role | Preferences only | Edit + Verify | Add email verification |

---

## Next Implementation Steps

1. ✅ Create migration SQL (above)
2. ✅ Run migration on Supabase
3. ✅ Update Settings.tsx to include email verification UI
4. ✅ Remove CampusSheet from Profile.tsx
5. ✅ Remove ContactSheet from Profile.tsx (move to Settings)
6. ✅ Update Profile.tsx to show read-only verification status
7. ✅ Add "Change in Settings" links throughout Profile
8. ✅ Create unified EmailVerificationSheet component in Settings

This design eliminates redundancy, improves UX clarity, and properly tracks multiple email types for verification.
