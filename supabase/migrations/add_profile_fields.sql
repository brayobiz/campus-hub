-- Migration: Add missing fields to profiles table
-- Purpose: Support user profile enhancements (phone, bio, avatar, campus content filtering)

-- Add missing columns to profiles table if they don't already exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_all_campuses BOOLEAN DEFAULT FALSE;

-- Add index on campus_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_campus_id ON profiles(campus_id);

-- Add comment for documentation
COMMENT ON COLUMN profiles.phone IS 'User phone number for verification';
COMMENT ON COLUMN profiles.bio IS 'User bio/description';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image';
COMMENT ON COLUMN profiles.show_all_campuses IS 'Whether user wants to see content from all campuses';
-- Migration: Complete user profile schema enhancements
-- Purpose: Support comprehensive user profiles with multiple email types, verification tracking, and campus info

-- PHASE 1: Add core profile fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- PHASE 2: Add school/institutional email support
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_email TEXT UNIQUE;

-- PHASE 3: Add email verification tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school_email_verified_at TIMESTAMP;

-- PHASE 4: Add phone verification tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMP;

-- PHASE 5: Add preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_all_campuses BOOLEAN DEFAULT FALSE;

-- PHASE 6: Enhance campuses table for email domain validation
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS email_domain TEXT;

-- PHASE 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_campus_id ON profiles(campus_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_school_email ON profiles(school_email);
CREATE INDEX IF NOT EXISTS idx_campuses_email_domain ON campuses(email_domain);

-- PHASE 8: Add documentation comments
COMMENT ON COLUMN profiles.phone IS 'User phone number for contact/verification';
COMMENT ON COLUMN profiles.bio IS 'User bio or description';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user profile picture';
COMMENT ON COLUMN profiles.school_email IS 'School/institutional email for campus verification';
COMMENT ON COLUMN profiles.email_verified IS 'Is personal email (from signup) verified?';
COMMENT ON COLUMN profiles.email_verified_at IS 'When personal email was verified';
COMMENT ON COLUMN profiles.school_email_verified IS 'Is school email verified?';
COMMENT ON COLUMN profiles.school_email_verified_at IS 'When school email was verified';
COMMENT ON COLUMN profiles.phone_verified IS 'Is phone number verified?';
COMMENT ON COLUMN profiles.phone_verified_at IS 'When phone was verified';
COMMENT ON COLUMN profiles.show_all_campuses IS 'Whether user wants to see content from all campuses';
COMMENT ON COLUMN campuses.email_domain IS 'Email domain for school email validation (e.g., ku.ac.ke)';
