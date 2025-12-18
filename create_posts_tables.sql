-- Complete schema for Campus Hub posts and interactions
-- Run this in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Campuses table (if not exists)
CREATE TABLE IF NOT EXISTS campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Confessions table
CREATE TABLE IF NOT EXISTS confessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Confession likes table
CREATE TABLE IF NOT EXISTS confession_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  confession_id UUID REFERENCES confessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(confession_id, user_id)
);

-- Confession comments table
CREATE TABLE IF NOT EXISTS confession_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  confession_id UUID REFERENCES confessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES confession_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  banner TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Marketplace table
CREATE TABLE IF NOT EXISTS marketplace (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  contact TEXT NOT NULL,
  images JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  course TEXT NOT NULL,
  year INTEGER NOT NULL,
  file TEXT,
  filename TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Food table
CREATE TABLE IF NOT EXISTS food (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Roommates table
CREATE TABLE IF NOT EXISTS roommates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_confessions_campus_id ON confessions(campus_id);
CREATE INDEX IF NOT EXISTS idx_confessions_created_at ON confessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_confession_likes_confession_id ON confession_likes(confession_id);
CREATE INDEX IF NOT EXISTS idx_confession_comments_confession_id ON confession_comments(confession_id);
CREATE INDEX IF NOT EXISTS idx_events_campus_id ON events(campus_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_marketplace_campus_id ON marketplace(campus_id);
CREATE INDEX IF NOT EXISTS idx_notes_campus_id ON notes(campus_id);
CREATE INDEX IF NOT EXISTS idx_food_campus_id ON food(campus_id);
CREATE INDEX IF NOT EXISTS idx_roommates_campus_id ON roommates(campus_id);

-- Enable Row Level Security (RLS)
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE confession_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE confession_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE food ENABLE ROW LEVEL SECURITY;
ALTER TABLE roommates ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users to read, only post authors to update/delete)
-- Confessions
CREATE POLICY "Anyone can view confessions" ON confessions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert confessions" ON confessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own confessions" ON confessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own confessions" ON confessions FOR DELETE USING (auth.uid() = user_id);

-- Confession likes
CREATE POLICY "Anyone can view confession likes" ON confession_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert confession likes" ON confession_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own confession likes" ON confession_likes FOR DELETE USING (auth.uid() = user_id);

-- Confession comments
CREATE POLICY "Anyone can view confession comments" ON confession_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert confession comments" ON confession_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own confession comments" ON confession_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own confession comments" ON confession_comments FOR DELETE USING (auth.uid() = user_id);

-- Events
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Marketplace
CREATE POLICY "Anyone can view marketplace" ON marketplace FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert marketplace" ON marketplace FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own marketplace" ON marketplace FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own marketplace" ON marketplace FOR DELETE USING (auth.uid() = user_id);

-- Notes
CREATE POLICY "Anyone can view notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

-- Food
CREATE POLICY "Anyone can view food" ON food FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert food" ON food FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own food" ON food FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own food" ON food FOR DELETE USING (auth.uid() = user_id);

-- Roommates
CREATE POLICY "Anyone can view roommates" ON roommates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert roommates" ON roommates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roommates" ON roommates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own roommates" ON roommates FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for uploads
CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);