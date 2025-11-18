-- 🔄 RESET ONBOARDING FOR TESTING
-- This script clears your onboarding completion so you can test the new flow

-- Option 1: Reset YOUR onboarding only (use your email)
-- Replace 'your-email@example.com' with your actual email
DELETE FROM user_preferences 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'  -- ⚠️ CHANGE THIS TO YOUR EMAIL
);

-- Option 2: Reset ALL users' onboarding (if testing with multiple accounts)
-- Uncomment the line below if you want to reset everyone
-- DELETE FROM user_preferences;

-- Verify it's gone
SELECT 
  u.email,
  up.onboarding_completed_at,
  up.skill_level,
  up.interests,
  up.likes_drop
FROM auth.users u
LEFT JOIN user_preferences up ON u.id = up.user_id
ORDER BY u.created_at DESC
LIMIT 10;

