-- Migration: Create all feature tables for Campus Hub
-- Purpose: Set up complete database schema for events, food, notes, marketplace, confessions, roommates, and notifications

-- ===========================================
-- EVENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  banner TEXT, -- URL to banner image
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for events
CREATE INDEX IF NOT EXISTS idx_events_campus_id ON events(campus_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- ===========================================
-- FOOD ITEMS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS food_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL, -- Can be "KSh 150" or number
  image TEXT NOT NULL, -- URL to food image
  contact TEXT NOT NULL, -- Phone number
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for food_items
CREATE INDEX IF NOT EXISTS idx_food_items_campus_id ON food_items(campus_id);
CREATE INDEX IF NOT EXISTS idx_food_items_user_id ON food_items(user_id);
CREATE INDEX IF NOT EXISTS idx_food_items_created_at ON food_items(created_at DESC);

-- ===========================================
-- NOTES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  course TEXT NOT NULL,
  year TEXT, -- e.g., "Year 1", "Year 2", etc.
  file TEXT NOT NULL, -- URL to file
  filename TEXT, -- Original filename
  description TEXT,
  contact TEXT, -- Phone/WhatsApp contact
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for notes
CREATE INDEX IF NOT EXISTS idx_notes_campus_id ON notes(campus_id);
CREATE INDEX IF NOT EXISTS idx_notes_course ON notes(course);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- ===========================================
-- MARKETPLACE ITEMS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[], -- Array of image URLs
  price INTEGER, -- Price in cents (optional)
  contact TEXT, -- Contact info
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for marketplace_items
CREATE INDEX IF NOT EXISTS idx_marketplace_items_campus_id ON marketplace_items(campus_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_user_id ON marketplace_items(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_created_at ON marketplace_items(created_at DESC);

-- ===========================================
-- CONFESSIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS confessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for confessions
CREATE INDEX IF NOT EXISTS idx_confessions_campus_id ON confessions(campus_id);
CREATE INDEX IF NOT EXISTS idx_confessions_user_id ON confessions(user_id);
CREATE INDEX IF NOT EXISTS idx_confessions_created_at ON confessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_confessions_likes_count ON confessions(likes_count DESC);

-- ===========================================
-- CONFESSION COMMENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS confession_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confession_id UUID NOT NULL REFERENCES confessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES confession_comments(id) ON DELETE CASCADE -- For nested replies
);

-- Indexes for confession_comments
CREATE INDEX IF NOT EXISTS idx_confession_comments_confession_id ON confession_comments(confession_id);
CREATE INDEX IF NOT EXISTS idx_confession_comments_user_id ON confession_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_confession_comments_parent_comment_id ON confession_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_confession_comments_created_at ON confession_comments(created_at DESC);

-- ===========================================
-- ROOMMATE POSTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS roommate_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  campus TEXT NOT NULL,
  room_type TEXT, -- e.g., "Single", "Double", "Shared"
  description TEXT NOT NULL,
  image TEXT, -- URL to image
  budget INTEGER, -- Monthly budget in currency
  contact TEXT NOT NULL, -- Contact info
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for roommate_posts
CREATE INDEX IF NOT EXISTS idx_roommate_posts_campus_id ON roommate_posts(campus_id);
CREATE INDEX IF NOT EXISTS idx_roommate_posts_room_type ON roommate_posts(room_type);
CREATE INDEX IF NOT EXISTS idx_roommate_posts_budget ON roommate_posts(budget);
CREATE INDEX IF NOT EXISTS idx_roommate_posts_user_id ON roommate_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_roommate_posts_created_at ON roommate_posts(created_at DESC);

-- ===========================================
-- NOTIFICATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'message', 'event', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  related_post_id UUID, -- Can reference different post types
  related_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_url TEXT, -- URL to navigate to when clicked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ===========================================
-- UPDATED AT TRIGGERS
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON food_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_confessions_updated_at BEFORE UPDATE ON confessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_confession_comments_updated_at BEFORE UPDATE ON confession_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roommate_posts_updated_at BEFORE UPDATE ON roommate_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE confession_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommate_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can view events from their campus or all campuses if show_all_campuses is true" ON events
  FOR SELECT USING (
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT show_all_campuses FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert events for their campus" ON events
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (user_id = auth.uid());

-- Food items policies
CREATE POLICY "Users can view food items from their campus or all campuses if show_all_campuses is true" ON food_items
  FOR SELECT USING (
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT show_all_campuses FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert food items for their campus" ON food_items
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own food items" ON food_items
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own food items" ON food_items
  FOR DELETE USING (user_id = auth.uid());

-- Notes policies
CREATE POLICY "Users can view notes from their campus or all campuses if show_all_campuses is true" ON notes
  FOR SELECT USING (
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT show_all_campuses FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert notes for their campus" ON notes
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (user_id = auth.uid());

-- Marketplace items policies
CREATE POLICY "Users can view marketplace items from their campus or all campuses if show_all_campuses is true" ON marketplace_items
  FOR SELECT USING (
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT show_all_campuses FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert marketplace items for their campus" ON marketplace_items
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own marketplace items" ON marketplace_items
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own marketplace items" ON marketplace_items
  FOR DELETE USING (user_id = auth.uid());

-- Confessions policies (anonymous, but users can only see from their campus)
CREATE POLICY "Users can view confessions from their campus or all campuses if show_all_campuses is true" ON confessions
  FOR SELECT USING (
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT show_all_campuses FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert confessions for their campus" ON confessions
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own confessions" ON confessions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own confessions" ON confessions
  FOR DELETE USING (user_id = auth.uid());

-- Confession comments policies
CREATE POLICY "Users can view comments on confessions they can see" ON confession_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM confessions c
      WHERE c.id = confession_comments.confession_id
      AND (c.campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
           (SELECT show_all_campuses FROM profiles WHERE id = auth.uid()))
    )
  );

CREATE POLICY "Users can insert comments on confessions they can see" ON confession_comments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM confessions c
      WHERE c.id = confession_comments.confession_id
      AND (c.campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
           (SELECT show_all_campuses FROM profiles WHERE id = auth.uid()))
    )
  );

CREATE POLICY "Users can update their own comments" ON confession_comments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON confession_comments
  FOR DELETE USING (user_id = auth.uid());

-- Roommate posts policies
CREATE POLICY "Users can view roommate posts from their campus or all campuses if show_all_campuses is true" ON roommate_posts
  FOR SELECT USING (
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
    (SELECT show_all_campuses FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert roommate posts for their campus" ON roommate_posts
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own roommate posts" ON roommate_posts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own roommate posts" ON roommate_posts
  FOR DELETE USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can only see their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications (mark as read)" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications for users" ON notifications
  FOR INSERT WITH CHECK (true); -- Allow system to create notifications

-- ===========================================
-- FUNCTIONS FOR LIKES AND COMMENTS COUNT
-- ===========================================

-- Function to update confession likes count
CREATE OR REPLACE FUNCTION update_confession_likes_count()
RETURNS TRIGGER AS $$ BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE confessions SET likes_count = likes_count + 1 WHERE id = NEW.confession_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE confessions SET likes_count = likes_count - 1 WHERE id = OLD.confession_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- Function to update confession comments count
CREATE OR REPLACE FUNCTION update_confession_comments_count()
RETURNS TRIGGER AS $$ BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE confessions SET comments_count = comments_count + 1 WHERE id = NEW.confession_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE confessions SET comments_count = comments_count - 1 WHERE id = OLD.confession_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql;

-- ===========================================
-- CONFESSION LIKES TABLE (if needed for detailed tracking)
-- ===========================================
CREATE TABLE IF NOT EXISTS confession_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id UUID NOT NULL REFERENCES confessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(confession_id, user_id) -- Prevent duplicate likes
);

-- Indexes for confession_likes
CREATE INDEX IF NOT EXISTS idx_confession_likes_confession_id ON confession_likes(confession_id);
CREATE INDEX IF NOT EXISTS idx_confession_likes_user_id ON confession_likes(user_id);

-- Enable RLS for confession_likes
ALTER TABLE confession_likes ENABLE ROW LEVEL SECURITY;

-- Confession likes policies
CREATE POLICY "Users can view likes on confessions they can see" ON confession_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM confessions c
      WHERE c.id = confession_likes.confession_id
      AND (c.campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
           (SELECT show_all_campuses FROM profiles WHERE id = auth.uid()))
    )
  );

CREATE POLICY "Users can like/unlike confessions they can see" ON confession_likes
  FOR ALL USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM confessions c
      WHERE c.id = confession_likes.confession_id
      AND (c.campus_id = (SELECT campus_id FROM profiles WHERE id = auth.uid()) OR
           (SELECT show_all_campuses FROM profiles WHERE id = auth.uid()))
    )
  );

-- Triggers for likes count
CREATE TRIGGER trigger_update_confession_likes_count
  AFTER INSERT OR DELETE ON confession_likes
  FOR EACH ROW EXECUTE FUNCTION update_confession_likes_count();

-- Triggers for comments count
CREATE TRIGGER trigger_update_confession_comments_count
  AFTER INSERT OR DELETE ON confession_comments
  FOR EACH ROW EXECUTE FUNCTION update_confession_comments_count();

-- ===========================================
-- REALTIME SUBSCRIPTIONS
-- ===========================================
-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE food_items;
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
ALTER PUBLICATION supabase_realtime ADD TABLE marketplace_items;
ALTER PUBLICATION supabase_realtime ADD TABLE confessions;
ALTER PUBLICATION supabase_realtime ADD TABLE confession_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE confession_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE roommate_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ===========================================
-- FINAL COMMENTS
-- ===========================================
COMMENT ON TABLE events IS 'Campus events posted by users';
COMMENT ON TABLE food_items IS 'Food delivery items posted by users';
COMMENT ON TABLE notes IS 'Study notes and past papers shared by users';
COMMENT ON TABLE marketplace_items IS 'Items for sale in the campus marketplace';
COMMENT ON TABLE confessions IS 'Anonymous confessions shared by users';
COMMENT ON TABLE confession_comments IS 'Comments and replies on confessions';
COMMENT ON TABLE confession_likes IS 'User likes on confessions';
COMMENT ON TABLE roommate_posts IS 'Roommate wanted/looking posts';
COMMENT ON TABLE notifications IS 'User notifications for various activities';