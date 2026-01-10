-- Migration: add trigger to create notifications when a confession is liked

CREATE OR REPLACE FUNCTION create_notification_on_confession_like()
RETURNS TRIGGER AS $$
DECLARE
  confession_owner UUID;
  liker UUID;
BEGIN
  SELECT user_id INTO confession_owner FROM confessions WHERE id = NEW.confession_id;
  IF confession_owner IS NULL THEN
    RETURN NEW;
  END IF;

  liker := NEW.user_id;
  IF confession_owner = liker THEN
    RETURN NEW; -- do not notify self-like
  END IF;

  INSERT INTO notifications(type, title, message, user_id, related_post_id, related_user_id, action_url)
  VALUES(
    'like',
    'Someone liked your confession',
    'Your confession received a new like.',
    confession_owner,
    NEW.confession_id,
    liker,
    concat('/confessions/', NEW.confession_id::text)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists (drop and recreate to be idempotent)
DROP TRIGGER IF EXISTS trigger_create_notification_on_confession_like ON confession_likes;

CREATE TRIGGER trigger_create_notification_on_confession_like
  AFTER INSERT ON confession_likes
  FOR EACH ROW EXECUTE FUNCTION create_notification_on_confession_like();
