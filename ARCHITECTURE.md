# Architecture & Data Flow Diagrams

## 1. Campus Persistence Data Flow

### User Signup Flow (Initial Selection)
```
┌─────────────────┐
│ SignUp Page     │
│  (email, pass)  │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────┐
│ supabase.auth.signUp()          │
│ Creates auth user               │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ CampusPicker Modal              │
│ (user selects campus)           │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ profiles.upsert({               │
│   id: user_id,                  │
│   campus_id: selected_campus_id │
│ })                              │
│                                 │
│ 💾 Saved to Supabase!           │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ useCampusStore.setCampus()      │
│ (update app state)              │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Home Page                       │
│ Shows campus short_name: "KU"   │
└─────────────────────────────────┘
```

### User Logout & Login Flow (Persistence)
```
┌─────────────────────────────────┐
│ Home Page                       │
│ Campus showing: "Kenyatta U"    │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ User clicks Logout              │
│ Settings page                   │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ supabase.auth.signOut()         │
│ Session destroyed               │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ authHook detects logout         │
│ clearCampus()                   │
│ setUser(null)                   │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Landing Page                    │
│ (user logged out)               │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ User logs in with email & pass  │
│ Login Page                      │
└────────┬────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ 🔧 useAuthSession() Hook Runs            │
│                                          │
│ 1. getSession() → Get auth user          │
│    └─ user_id = "abc123"                 │
│                                          │
│ 2. Query profiles table:                 │
│    └─ SELECT campus_id                   │
│       WHERE id = "abc123"                │
│    └─ Result: campus_id = "xyz789"      │
│                                          │
│ 3. Query campuses table:                 │
│    └─ SELECT id, name, short_name        │
│       WHERE id = "xyz789"                │
│    └─ Result:                            │
│       id: "xyz789"                       │
│       name: "Kenyatta University"        │
│       short_name: "KU"                   │
│                                          │
│ 4. useCampusStore.setCampus(campus)      │
│    └─ Campus restored to app state! ✅  │
└──────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Home Page                       │
│ Campus showing: "KU" ✅         │
│ (Persisted from DB!)            │
└─────────────────────────────────┘
```

---

## 2. Settings Page Architecture

```
Settings Page (/settings)
│
├─ Header
│  ├─ Title: "Settings"
│  └─ Back button
│
├─ Campus & Preferences Section
│  │
│  ├─ Your Campus Card
│  │  ├─ Icon: 🎓
│  │  ├─ Shows: Current campus short_name
│  │  └─ On click → Opens CampusModal
│  │
│  └─ See All Campuses Toggle Card
│     ├─ Icon: ◉/○ (toggle)
│     ├─ Shows: show_all_campuses state
│     ├─ On toggle → Saves to profiles.show_all_campuses
│     └─ Persists in DB ✅
│
├─ Notifications Section
│  └─ Placeholder (future: email, push, in-app)
│
├─ Privacy Section
│  └─ Placeholder (future: visibility, DMs, blocking)
│
└─ Logout Button
   └─ On click → supabase.auth.signOut()
```

---

## 3. Database Schema (Profiles Table)

```sql
profiles
├── id (UUID, PRIMARY KEY)
│   └─ Links to auth.users(id)
│
├── email (TEXT)
│   └─ User email address
│
├── name (TEXT)
│   └─ User's full name
│
├── year (TEXT)
│   └─ Academic year (1st, 2nd, 3rd, etc)
│
├── major (TEXT)
│   └─ Field of study
│
├── campus_id (UUID, FOREIGN KEY) ⭐
│   └─ Links to campuses(id)
│   └─ Set during CampusPicker
│   └─ Fetched during login (authHook)
│
├── is_premium (BOOLEAN)
│   └─ Premium account status
│
├── phone (TEXT) [NEW]
│   └─ Phone number for verification
│
├── bio (TEXT) [NEW]
│   └─ User bio/description
│
├── avatar_url (TEXT) [NEW]
│   └─ Profile picture URL
│
└── show_all_campuses (BOOLEAN) [NEW] ⭐
    └─ Settings toggle preference
    └─ Default: FALSE
    └─ Updated when user toggles in Settings
```

### Campuses Table
```sql
campuses
├── id (UUID, PRIMARY KEY)
├── name (TEXT)
│   └─ Full name: "Kenyatta University"
├── short_name (TEXT) [IMPORTANT]
│   └─ Short code: "KU"
│   └─ Displayed on Home page
└── (other fields as needed)
```

---

## 4. Component Hierarchy

```
App (Router)
│
├─ Layout (if needed)
│
├─ Routes
│  │
│  ├─ /home (Protected)
│  │  └─ Home Component
│  │     ├─ Reads: useCampusStore (campus)
│  │     ├─ Reads: useUserStore (user)
│  │     └─ Shows: "Welcome, [name]" + "📍 [campus]"
│  │
│  ├─ /settings (Protected)
│  │  └─ Settings Component
│  │     ├─ Reads: useCampusStore (campus)
│  │     ├─ State: show all campuses toggle
│  │     ├─ Actions:
│  │     │  ├─ handleSelectCampus → updates profiles.campus_id
│  │     │  ├─ handleToggleAllCampuses → updates profiles.show_all_campuses
│  │     │  └─ handleLogout → signOut()
│  │     └─ Modal: CampusModal (dropdown selector)
│  │
│  ├─ /profile (Protected)
│  │  └─ Profile Component
│  │     ├─ Reads: useUserStore
│  │     └─ Navigation: Gear icon → /settings
│  │
│  └─ /auth/campuspicker
│     └─ CampusPicker Component
│        └─ Actions:
│           ├─ Fetch campuses from DB
│           ├─ handleSelectCampus → profiles.upsert() + useCampusStore.setCampus()
│           └─ Navigate → /home
│
└─ BottomNav
   ├─ Home icon → /home
   ├─ Explore icon → /explore
   ├─ Plus icon → openPostModal()
   ├─ Alerts icon → /alerts
   ├─ Profile icon → /profile
   └─ Gear icon → /settings (NEW!)
```

---

## 5. State Management

### useCampusStore (Zustand + Persist)
```typescript
{
  campus: {
    id: "xyz789",
    name: "Kenyatta University",
    short_name: "KU"
  } | null,
  
  actions: {
    setCampus(campus) → updates state + localStorage
    clearCampus() → clears state + localStorage
  },
  
  persistence: {
    localStorage key: "campus-store"
    survives page refresh ✅
    NOT synced with Supabase (only synced on login/logout)
  }
}
```

### useUserStore (Zustand)
```typescript
{
  user: {
    id: "abc123",
    email: "user@example.com",
    name: "John Doe",
    is_premium: false
  } | null,
  
  actions: {
    setUser(user)
    updateUser(patch)
    clearUser()
  },
  
  persistence: {
    NO localStorage (auth-only)
    Cleared on logout ✅
  }
}
```

---

## 6. API Call Sequence (Campus Restore on Login)

```
Timeline: User Logs In

T0: supabase.auth.signIn(email, password)
    └─ Returns: session + user

T1: authHook.useEffect() triggered
    └─ getSession() called
    └─ Returns: authenticated user

T2: Query #1: Profiles Table
    Query:  SELECT campus_id FROM profiles WHERE id = user.id
    Result: campus_id = "xyz789"
    Time:   ~50ms

T3: Query #2: Campuses Table
    Query:  SELECT id, name, short_name FROM campuses WHERE id = "xyz789"
    Result: { id: "xyz789", name: "Kenyatta University", short_name: "KU" }
    Time:   ~50ms

T4: useCampusStore.setCampus(campus)
    └─ Updates app state
    └─ Saves to localStorage
    Time:   <1ms

T5: authHook loading = false
    └─ App renders normally

T6: useEffect in Home, Settings, etc.
    └─ Reads useCampusStore(s => s.campus)
    └─ Uses: campus.short_name = "KU"

TOTAL TIME: ~100ms (imperceptible to user) ✅
```

---

## 7. Settings Page: Save Flow

### When User Changes Campus
```
User clicks campus dropdown
    ↓
Modal opens with campus list
    ↓
User selects new campus
    ↓
handleSelectCampus(newCampus)
    ├─ setLoading(true)
    ├─ supabase.profiles.update({
    │   id: user.id,
    │   campus_id: newCampus.id
    │ })
    ├─ Wait for success
    ├─ useCampusStore.setCampus(newCampus)
    ├─ setLoading(false)
    └─ Close modal
    ↓
✅ Campus updated in DB + app state
```

### When User Toggles Show All Campuses
```
User clicks toggle
    ↓
setShowAllCampuses(!current)
    ├─ Visual feedback (toggle animates)
    └─ Call handleToggleAllCampuses()
    ↓
handleToggleAllCampuses()
    ├─ setLoading(true)
    ├─ supabase.profiles.update({
    │   id: user.id,
    │   show_all_campuses: !current
    │ })
    ├─ Wait for success
    ├─ Local state already updated (optimistic)
    ├─ setLoading(false)
    └─ No modal to close
    ↓
✅ Preference saved to DB
```

---

## 8. Error Handling Flow

```
Campus fetch fails
    ↓
│
├─ Profile query fails
│  └─ Try to load campus_id
│  └─ Catch error
│  └─ Log: "Failed to fetch profile"
│  └─ Campus = null
│  └─ User can still use app
│  └─ Can fix later in Settings
│
└─ Campuses query fails
   └─ Campus_id exists but campus not found
   └─ Log: "Campus not found in DB"
   └─ Campus = null
   └─ User still logged in
   └─ No crash! ✅

Settings update fails
    ↓
├─ Show error alert to user
├─ Revert local state
├─ Suggest retry
└─ Allow user to dismiss
```

---

## 9. Data Consistency

### On Signup
```
1. User creates account
   └─ auth.users(id, email)

2. User picks campus
   └─ profiles(id, campus_id) ← Saved immediately
   └─ useCampusStore ← Updated

3. User navigates
   └─ Both sources consistent ✅
```

### On Login (After Logout)
```
Before Fix ❌
├─ profiles.campus_id: "xyz789" (in DB)
├─ useCampusStore.campus: null (lost)
└─ Result: Campus forgotten 😞

After Fix ✅
├─ profiles.campus_id: "xyz789" (in DB)
├─ authHook restores from DB
├─ useCampusStore.campus: restored (from DB)
└─ Result: Campus remembered! 🎉
```

---

## 10. Settings Page UI Flow

```
Settings Loaded
    ↓
[Header: Settings]
    ↓
[Card: Your Campus]
│  Title: "Your Campus"
│  Value: "Kenyatta University (KU)"
│  Action: Click → CampusModal opens
│
└─ CampusModal
   ├─ Dropdown: Shows all campuses
   ├─ Currently Selected: Highlighted
   ├─ On Select:
   │  ├─ Loading spinner appears
   │  ├─ API call to update profiles
   │  ├─ On success: Close modal, show updated value
   │  └─ On error: Show error message, allow retry
   └─ On Cancel: Close modal, no changes
    ↓
[Card: See All Campuses]
│  Title: "See All Campuses"
│  Toggle: ◉ (on) or ○ (off)
│  Subtitle: Shows current state
│  Action: Click → Toggle + Save to DB
│
└─ On Save:
   ├─ Visual feedback (check mark)
   ├─ API call to update profiles.show_all_campuses
   ├─ On success: State locked in
   └─ On error: Revert toggle, show error
    ↓
[Notifications Placeholder]
    ↓
[Privacy Placeholder]
    ↓
[Logout Button]
└─ On Click:
   ├─ Show confirmation
   ├─ supabase.auth.signOut()
   ├─ useAuthSession clears state
   ├─ Redirect to Landing page
   └─ Campus cleared (on logout)
```

---

This architecture ensures:
✅ **Persistence** — Campus saved to DB, restored on every login
✅ **Performance** — Single query per login (~100ms)
✅ **Reliability** — Error handling prevents crashes
✅ **Simplicity** — Clear, predictable data flow
✅ **Scalability** — Easy to add more settings (bio, avatar, etc.)
