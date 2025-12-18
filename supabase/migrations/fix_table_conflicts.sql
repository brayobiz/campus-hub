-- Migration: Fix table names and types to match application code
-- This fixes conflicts between the existing feature_table_schema.sql and the app code

-- ===========================================
-- FIX CAMPUSES TABLE ID TYPE TO UUID FIRST
-- ===========================================

-- First, drop all foreign key constraints that reference campuses.id
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_campus_id_fkey;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_campus_id_fkey;
ALTER TABLE food_items DROP CONSTRAINT IF EXISTS food_items_campus_id_fkey;
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_campus_id_fkey;
ALTER TABLE marketplace_items DROP CONSTRAINT IF EXISTS marketplace_items_campus_id_fkey;
ALTER TABLE confessions DROP CONSTRAINT IF EXISTS confessions_campus_id_fkey;
ALTER TABLE roommate_posts DROP CONSTRAINT IF EXISTS roommate_posts_campus_id_fkey;

-- Now we can safely drop the primary key constraint
ALTER TABLE campuses DROP CONSTRAINT IF EXISTS campuses_pkey;

-- Drop the old integer id column
ALTER TABLE campuses DROP COLUMN IF EXISTS id CASCADE;

-- Add new UUID id column
ALTER TABLE campuses ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Generate new UUIDs for existing rows (if any)
UPDATE campuses SET id = gen_random_uuid() WHERE id IS NULL;

-- ===========================================
-- DROP ALL RLS POLICIES THAT DEPEND ON CAMPUS_ID
-- ===========================================

-- Drop all existing policies that reference campus_id to avoid dependency issues
DROP POLICY IF EXISTS "Users can view events from their campus or all campuses if show_all_campuses is true" ON events;
DROP POLICY IF EXISTS "Users can insert events for their campus" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

DROP POLICY IF EXISTS "Users can view food items from their campus or all campuses if show_all_campuses is true" ON food_items;
DROP POLICY IF EXISTS "Users can insert food items for their campus" ON food_items;
DROP POLICY IF EXISTS "Users can update their own food items" ON food_items;
DROP POLICY IF EXISTS "Users can delete their own food items" ON food_items;

DROP POLICY IF EXISTS "Users can view notes from their campus or all campuses if show_all_campuses is true" ON notes;
DROP POLICY IF EXISTS "Users can insert notes for their campus" ON notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;

DROP POLICY IF EXISTS "Users can view marketplace items from their campus or all campuses if show_all_campuses is true" ON marketplace_items;
DROP POLICY IF EXISTS "Users can insert marketplace items for their campus" ON marketplace_items;
DROP POLICY IF EXISTS "Users can update their own marketplace items" ON marketplace_items;
DROP POLICY IF EXISTS "Users can delete their own marketplace items" ON marketplace_items;

DROP POLICY IF EXISTS "Users can view confessions from their campus or all campuses if show_all_campuses is true" ON confessions;
DROP POLICY IF EXISTS "Users can insert confessions for their campus" ON confessions;
DROP POLICY IF EXISTS "Users can update their own confessions" ON confessions;
DROP POLICY IF EXISTS "Users can delete their own confessions" ON confessions;

DROP POLICY IF EXISTS "Users can view comments on confessions they can see" ON confession_comments;
DROP POLICY IF EXISTS "Users can insert comments on confessions they can see" ON confession_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON confession_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON confession_comments;

DROP POLICY IF EXISTS "Users can view likes on confessions they can see" ON confession_likes;
DROP POLICY IF EXISTS "Users can like/unlike confessions they can see" ON confession_likes;

DROP POLICY IF EXISTS "Users can view roommate posts from their campus or all campuses if show_all_campuses is true" ON roommate_posts;
DROP POLICY IF EXISTS "Users can insert roommate posts for their campus" ON roommate_posts;
DROP POLICY IF EXISTS "Users can update their own roommate posts" ON roommate_posts;
DROP POLICY IF EXISTS "Users can delete their own roommate posts" ON roommate_posts;

DROP POLICY IF EXISTS "Users can only see their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications (mark as read)" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications for users" ON notifications;



-- ===========================================
-- UPDATE CAMPUS_ID TYPE FROM INTEGER TO UUID
-- ===========================================

-- Add temporary UUID column for campus_id
ALTER TABLE events ADD COLUMN campus_id_uuid UUID;
ALTER TABLE food ADD COLUMN campus_id_uuid UUID;
ALTER TABLE notes ADD COLUMN campus_id_uuid UUID;
ALTER TABLE marketplace ADD COLUMN campus_id_uuid UUID;
ALTER TABLE confessions ADD COLUMN campus_id_uuid UUID;
ALTER TABLE roommates ADD COLUMN campus_id_uuid UUID;

-- Update the UUID columns with cast values (assuming campuses.id is already UUID)
UPDATE events SET campus_id_uuid = campus_id::text::uuid WHERE campus_id IS NOT NULL;
UPDATE food SET campus_id_uuid = campus_id::text::uuid WHERE campus_id IS NOT NULL;
UPDATE notes SET campus_id_uuid = campus_id::text::uuid WHERE campus_id IS NOT NULL;
UPDATE marketplace SET campus_id_uuid = campus_id::text::uuid WHERE campus_id IS NOT NULL;
UPDATE confessions SET campus_id_uuid = campus_id::text::uuid WHERE campus_id IS NOT NULL;
UPDATE roommates SET campus_id_uuid = campus_id::text::uuid WHERE campus_id IS NOT NULL;

-- Drop old integer columns
ALTER TABLE events DROP COLUMN campus_id;
ALTER TABLE food DROP COLUMN campus_id;
ALTER TABLE notes DROP COLUMN campus_id;
ALTER TABLE marketplace DROP COLUMN campus_id;
ALTER TABLE confessions DROP COLUMN campus_id;
ALTER TABLE roommates DROP COLUMN campus_id;

-- Rename UUID columns to campus_id
ALTER TABLE events RENAME COLUMN campus_id_uuid TO campus_id;
ALTER TABLE food RENAME COLUMN campus_id_uuid TO campus_id;
ALTER TABLE notes RENAME COLUMN campus_id_uuid TO campus_id;
ALTER TABLE marketplace RENAME COLUMN campus_id_uuid TO campus_id;
ALTER TABLE confessions RENAME COLUMN campus_id_uuid TO campus_id;
ALTER TABLE roommates RENAME COLUMN campus_id_uuid TO campus_id;

-- Add NOT NULL constraints back
ALTER TABLE events ALTER COLUMN campus_id SET NOT NULL;
ALTER TABLE food ALTER COLUMN campus_id SET NOT NULL;
ALTER TABLE notes ALTER COLUMN campus_id SET NOT NULL;
ALTER TABLE marketplace ALTER COLUMN campus_id SET NOT NULL;
ALTER TABLE confessions ALTER COLUMN campus_id SET NOT NULL;
ALTER TABLE roommates ALTER COLUMN campus_id SET NOT NULL;

-- Recreate foreign key constraints (now that campuses.id is UUID)
ALTER TABLE events ADD CONSTRAINT fk_events_campus_id FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE CASCADE;
ALTER TABLE food ADD CONSTRAINT fk_food_campus_id FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE CASCADE;
ALTER TABLE notes ADD CONSTRAINT fk_notes_campus_id FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE CASCADE;
ALTER TABLE marketplace ADD CONSTRAINT fk_marketplace_campus_id FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE CASCADE;
ALTER TABLE confessions ADD CONSTRAINT fk_confessions_campus_id FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE CASCADE;
ALTER TABLE roommates ADD CONSTRAINT fk_roommates_campus_id FOREIGN KEY (campus_id) REFERENCES campuses(id) ON DELETE CASCADE;

-- ===========================================
-- FIX MARKETPLACE PRICE TYPE (should be NUMERIC, not INTEGER)
-- ===========================================
ALTER TABLE marketplace ALTER COLUMN price TYPE NUMERIC;

-- ===========================================
-- FIX FOOD PRICE TYPE (should be NUMERIC, not TEXT)
-- ===========================================
ALTER TABLE food ALTER COLUMN price TYPE NUMERIC USING (regexp_replace(price, '[^0-9.]', '', 'g')::numeric);

-- ===========================================
-- RE-ENABLE RLS AND CREATE SIMPLE POLICIES
-- ===========================================

-- Re-enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE food ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace ENABLE ROW LEVEL SECURITY;
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE confession_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE confession_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create simple policies (anyone can view, authenticated users can insert/update/delete own posts)
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view food" ON food FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert food" ON food FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own food" ON food FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own food" ON food FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view marketplace" ON marketplace FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert marketplace" ON marketplace FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own marketplace" ON marketplace FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own marketplace" ON marketplace FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view confessions" ON confessions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert confessions" ON confessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own confessions" ON confessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own confessions" ON confessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view confession_comments" ON confession_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert confession_comments" ON confession_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own confession_comments" ON confession_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own confession_comments" ON confession_comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view confession_likes" ON confession_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert confession_likes" ON confession_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own confession_likes" ON confession_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view roommates" ON roommates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert roommates" ON roommates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roommates" ON roommates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own roommates" ON roommates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- ===========================================
-- UPDATE INDEXES FOR NEW TABLE NAMES
-- ===========================================

-- Drop old indexes
DROP INDEX IF EXISTS idx_food_items_campus_id;
DROP INDEX IF EXISTS idx_food_items_user_id;
DROP INDEX IF EXISTS idx_food_items_created_at;
DROP INDEX IF EXISTS idx_marketplace_items_campus_id;
DROP INDEX IF EXISTS idx_marketplace_items_category;
DROP INDEX IF EXISTS idx_marketplace_items_user_id;
DROP INDEX IF EXISTS idx_marketplace_items_created_at;
DROP INDEX IF EXISTS idx_roommate_posts_campus_id;
DROP INDEX IF EXISTS idx_roommate_posts_room_type;
DROP INDEX IF EXISTS idx_roommate_posts_budget;
DROP INDEX IF EXISTS idx_roommate_posts_user_id;
DROP INDEX IF EXISTS idx_roommate_posts_created_at;

-- Create new indexes with correct table names
CREATE INDEX IF NOT EXISTS idx_food_campus_id ON food(campus_id);
CREATE INDEX IF NOT EXISTS idx_food_user_id ON food(user_id);
CREATE INDEX IF NOT EXISTS idx_food_created_at ON food(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_campus_id ON marketplace(campus_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_user_id ON marketplace(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_created_at ON marketplace(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roommates_campus_id ON roommates(campus_id);
CREATE INDEX IF NOT EXISTS idx_roommates_room_type ON roommates(room_type);
CREATE INDEX IF NOT EXISTS idx_roommates_budget ON roommates(budget);
CREATE INDEX IF NOT EXISTS idx_roommates_user_id ON roommates(user_id);
CREATE INDEX IF NOT EXISTS idx_roommates_created_at ON roommates(created_at DESC);

-- ===========================================
-- UPDATE TRIGGERS FOR NEW TABLE NAMES
-- ===========================================

-- Drop old triggers
DROP TRIGGER IF EXISTS update_food_items_updated_at ON food;
DROP TRIGGER IF EXISTS update_marketplace_items_updated_at ON marketplace;
DROP TRIGGER IF EXISTS update_roommate_posts_updated_at ON roommates;

-- Recreate triggers with correct table names
CREATE TRIGGER update_food_updated_at BEFORE UPDATE ON food FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_updated_at BEFORE UPDATE ON marketplace FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roommates_updated_at BEFORE UPDATE ON roommates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ADD CONFESSION LIKES TABLE (MISSING FROM ORIGINAL)
-- ===========================================
CREATE TABLE IF NOT EXISTS confession_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id UUID NOT NULL REFERENCES confessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(confession_id, user_id)
);

-- Indexes for confession_likes
CREATE INDEX IF NOT EXISTS idx_confession_likes_confession_id ON confession_likes(confession_id);
CREATE INDEX IF NOT EXISTS idx_confession_likes_user_id ON confession_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_confession_likes_created_at ON confession_likes(created_at DESC);

