-- Migration: Clean recreation of all tables with correct names and types
-- This drops the existing tables and recreates them properly

-- ===========================================
-- DROP EXISTING TABLES (in correct order due to dependencies)
-- ===========================================

DROP TABLE IF EXISTS confession_likes CASCADE;
DROP TABLE IF EXISTS confession_comments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS roommate_posts CASCADE;
DROP TABLE IF EXISTS marketplace_items CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS confessions CASCADE;

-- ===========================================
-- RECREATE TABLES WITH CORRECT NAMES AND TYPES
-- ===========================================

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  banner TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Food table (correctly named)
CREATE TABLE food (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  course TEXT NOT NULL,
  year TEXT,
  file TEXT NOT NULL,
  filename TEXT,
  description TEXT,
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Marketplace table (correctly named)
CREATE TABLE marketplace (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[],
  price NUMERIC,
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Confessions table
CREATE TABLE confessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Confession comments table
CREATE TABLE confession_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confession_id UUID NOT NULL REFERENCES confessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES confession_comments(id) ON DELETE CASCADE
);

-- Confession likes table
CREATE TABLE confession_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id UUID NOT NULL REFERENCES confessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(confession_id, user_id)
);

-- Roommates table (correctly named)
CREATE TABLE roommates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  room_type TEXT,
  description TEXT NOT NULL,
  image TEXT,
  budget NUMERIC,
  contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'message', 'event', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  related_post_id UUID,
  related_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- CREATE INDEXES
-- ===========================================

CREATE INDEX idx_events_campus_id ON events(campus_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_created_at ON events(created_at DESC);

CREATE INDEX idx_food_campus_id ON food(campus_id);
CREATE INDEX idx_food_user_id ON food(user_id);
CREATE INDEX idx_food_created_at ON food(created_at DESC);

CREATE INDEX idx_notes_campus_id ON notes(campus_id);
CREATE INDEX idx_notes_course ON notes(course);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

CREATE INDEX idx_marketplace_campus_id ON marketplace(campus_id);
CREATE INDEX idx_marketplace_category ON marketplace(category);
CREATE INDEX idx_marketplace_user_id ON marketplace(user_id);
CREATE INDEX idx_marketplace_created_at ON marketplace(created_at DESC);

CREATE INDEX idx_confessions_campus_id ON confessions(campus_id);
CREATE INDEX idx_confessions_user_id ON confessions(user_id);
CREATE INDEX idx_confessions_created_at ON confessions(created_at DESC);
CREATE INDEX idx_confessions_likes_count ON confessions(likes_count DESC);

CREATE INDEX idx_confession_comments_confession_id ON confession_comments(confession_id);
CREATE INDEX idx_confession_comments_user_id ON confession_comments(user_id);
CREATE INDEX idx_confession_comments_parent_comment_id ON confession_comments(parent_comment_id);
CREATE INDEX idx_confession_comments_created_at ON confession_comments(created_at DESC);

CREATE INDEX idx_confession_likes_confession_id ON confession_likes(confession_id);
CREATE INDEX idx_confession_likes_user_id ON confession_likes(user_id);
CREATE INDEX idx_confession_likes_created_at ON confession_likes(created_at DESC);

CREATE INDEX idx_roommates_campus_id ON roommates(campus_id);
CREATE INDEX idx_roommates_room_type ON roommates(room_type);
CREATE INDEX idx_roommates_budget ON roommates(budget);
CREATE INDEX idx_roommates_user_id ON roommates(user_id);
CREATE INDEX idx_roommates_created_at ON roommates(created_at DESC);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ===========================================
-- ENABLE ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE food ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace ENABLE ROW LEVEL SECURITY;
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE confession_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE confession_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- CREATE RLS POLICIES
-- ===========================================

-- Events policies
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Food policies
CREATE POLICY "Anyone can view food" ON food FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert food" ON food FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own food" ON food FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own food" ON food FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Anyone can view notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

-- Marketplace policies
CREATE POLICY "Anyone can view marketplace" ON marketplace FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert marketplace" ON marketplace FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own marketplace" ON marketplace FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own marketplace" ON marketplace FOR DELETE USING (auth.uid() = user_id);

-- Confessions policies
CREATE POLICY "Anyone can view confessions" ON confessions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert confessions" ON confessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own confessions" ON confessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own confessions" ON confessions FOR DELETE USING (auth.uid() = user_id);

-- Confession comments policies
CREATE POLICY "Anyone can view confession_comments" ON confession_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert confession_comments" ON confession_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own confession_comments" ON confession_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own confession_comments" ON confession_comments FOR DELETE USING (auth.uid() = user_id);

-- Confession likes policies
CREATE POLICY "Anyone can view confession_likes" ON confession_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert confession_likes" ON confession_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own confession_likes" ON confession_likes FOR DELETE USING (auth.uid() = user_id);

-- Roommates policies
CREATE POLICY "Anyone can view roommates" ON roommates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert roommates" ON roommates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roommates" ON roommates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own roommates" ON roommates FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- ===========================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_food_updated_at BEFORE UPDATE ON food FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_updated_at BEFORE UPDATE ON marketplace FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_confessions_updated_at BEFORE UPDATE ON confessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_confession_comments_updated_at BEFORE UPDATE ON confession_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roommates_updated_at BEFORE UPDATE ON roommates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- CREATE FUNCTIONS FOR COUNTS
-- ===========================================

CREATE OR REPLACE FUNCTION update_confession_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE confessions SET likes_count = likes_count + 1 WHERE id = NEW.confession_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE confessions SET likes_count = likes_count - 1 WHERE id = OLD.confession_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_confession_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE confessions SET comments_count = comments_count + 1 WHERE id = NEW.confession_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE confessions SET comments_count = comments_count - 1 WHERE id = OLD.confession_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_confession_likes_count
  AFTER INSERT OR DELETE ON confession_likes
  FOR EACH ROW EXECUTE FUNCTION update_confession_likes_count();

CREATE TRIGGER trigger_update_confession_comments_count
  AFTER INSERT OR DELETE ON confession_comments
  FOR EACH ROW EXECUTE FUNCTION update_confession_comments_count();

-- ===========================================
-- ENABLE REALTIME
-- ===========================================

ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE food;
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
ALTER PUBLICATION supabase_realtime ADD TABLE marketplace;
ALTER PUBLICATION supabase_realtime ADD TABLE confessions;
ALTER PUBLICATION supabase_realtime ADD TABLE confession_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE confession_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE roommates;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ===========================================
-- CREATE STORAGE BUCKET
-- ===========================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);