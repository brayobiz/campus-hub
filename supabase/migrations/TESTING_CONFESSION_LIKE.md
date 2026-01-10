# Testing: Confession Like → Notification (Realtime)

This document explains how to verify that:
- Liking a confession updates the confession's likes count in realtime for other clients
- A notification is created for the confession owner when another user likes their confession
- The Alerts page receives the notification in realtime

⚠️ Notes before testing
- If Row Level Security (RLS) is enabled, run any raw SQL tests using the Service Role key or as a superuser in the Supabase SQL editor.
- Prefer manual testing with two browser windows/devices logged in as two different users for full end-to-end verification.

Manual test (recommended)
1. Apply the migration (if not already applied):
   - Using Supabase CLI: `supabase migration up`
   - Or paste `supabase/migrations/2026-01-09_add_confession_like_notification.sql` into the SQL editor and run it

2. Create two test users (Owner and Liker) and sign into two browser windows (A = owner, B = liker).

3. On window A (owner):
   - Create a confession via the UI (Confessions → Post).
   - Note the `confession id` (you can open the Confession in the network inspector or query the `confessions` table in the SQL editor:
     `SELECT id, content, likes_count FROM confessions WHERE user_id = '<owner_id>' ORDER BY created_at DESC LIMIT 1;`

4. On window B (liker):
   - Open Confessions feed, find the confession, and click like.
   - EXPECTED: Like count increments immediately for B and the like button goes into the liked state.

5. On window A (owner):
   - EXPECTED: Confessions feed updates (likes_count increment) and a new notification appears in Alerts (open `/alerts` or use BottomNav → Alerts).
   - Alerts should show a new entry with type = `like`, title/message set by the trigger, and `related_post_id` equal to the confession id.

6. Optionally, open the Supabase SQL editor and run:
```sql
-- Check notifications created for the confession
SELECT * FROM notifications WHERE related_post_id = '<confession_id>' ORDER BY created_at DESC LIMIT 5;

-- Check the likes_count on the confession
SELECT id, likes_count FROM confessions WHERE id = '<confession_id>';
```

SQL simulation test (run as superuser/service role)
- Replace `<confession_id>`, `<campus_id>`, `<owner_id>`, `<liker_id>` with actual UUIDs from your DB.

```sql
-- 1) Create a test confession (if you don't want to use the UI)
INSERT INTO confessions(id, content, campus_id, user_id)
VALUES ('<confession_id>', '☑️ Test confession for realtime like → notification', <campus_id>, '<owner_id>');

-- 2) Simulate a like from <liker_id>
INSERT INTO confession_likes(confession_id, user_id) VALUES ('<confession_id>', '<liker_id>');

-- 3) Verify notification exists
SELECT id, type, title, message, user_id, related_post_id, related_user_id, action_url, created_at
FROM notifications
WHERE related_post_id = '<confession_id>'
ORDER BY created_at DESC LIMIT 5;

-- 4) Verify likes_count was incremented
SELECT likes_count FROM confessions WHERE id = '<confession_id>';

-- 5) Cleanup test records
DELETE FROM confession_likes WHERE confession_id = '<confession_id>' AND user_id = '<liker_id>';
DELETE FROM notifications WHERE related_post_id = '<confession_id>' AND related_user_id = '<liker_id>';
DELETE FROM confessions WHERE id = '<confession_id>' AND user_id = '<owner_id>';
```

Troubleshooting
- If you don't see a notification after inserting a like:
  - Verify the trigger/function exists: `SELECT proname FROM pg_proc WHERE proname ILIKE 'create_notification_on_confession_like%';`
  - Check the trigger was created on `confession_likes`: `SELECT tgname FROM pg_trigger WHERE tgrelid = 'confession_likes'::regclass;`
  - If RLS prohibits inserts, run the test as the service role or temporarily disable RLS on affected tables.
  - Inspect Supabase logs to see any DB errors raised by the trigger.

What to expect in the UI
- Confessions feed: like button state updates and like count increments immediately for both liker and owner (via realtime subscriptions)
- Alerts page: new notification with `type: 'like'` and `related_post_id` pointing at the confession

If you want, I can also create an automated test script (Node.js script using Supabase client) to run the SQL simulation and assert expected rows. Let me know if you'd like that. 🎯
