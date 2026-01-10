-- Test script: simulate a confession like and observe notification + count increment
-- Replace the placeholders: <confession_id>, <campus_id>, <owner_id>, <liker_id>
-- Run this in Supabase SQL editor or any Postgres client with sufficient privileges

-- 1) Create a test confession (optional)
-- INSERT INTO confessions(id, content, campus_id, user_id)
-- VALUES ('<confession_id>', 'Test confession for like → notification', <campus_id>, '<owner_id>');

-- 2) Insert a like (this should trigger notification and increment likes_count)
INSERT INTO confession_likes(confession_id, user_id) VALUES ('<confession_id>', '<liker_id>');

-- 3) Verify notification exists
SELECT id, type, title, message, user_id, related_post_id, related_user_id, action_url, created_at
FROM notifications
WHERE related_post_id = '<confession_id>'
ORDER BY created_at DESC LIMIT 10;

-- 4) Verify likes_count was incremented
SELECT id, likes_count FROM confessions WHERE id = '<confession_id>';

-- 5) Cleanup (if you created test data)
-- DELETE FROM confession_likes WHERE confession_id = '<confession_id>' AND user_id = '<liker_id>';
-- DELETE FROM notifications WHERE related_post_id = '<confession_id>' AND related_user_id = '<liker_id>';
-- DELETE FROM confessions WHERE id = '<confession_id>' AND user_id = '<owner_id>';
