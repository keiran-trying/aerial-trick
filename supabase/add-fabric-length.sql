-- 📏 ADD FABRIC LENGTH COLUMN TO USER PREFERENCES
-- Run this if you already created the user_preferences table earlier

ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS fabric_length TEXT CHECK (fabric_length IN ('long', 'short', 'both'));

COMMENT ON COLUMN user_preferences.fabric_length IS 'User preference for fabric length: long, short, or both';

