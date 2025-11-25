-- Add is_admin field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create an index on is_admin for faster queries
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = true;

-- Update RLS policy for users table to prevent non-admins from changing their admin status
-- Drop old policy if it exists
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policy that prevents users from changing is_admin
CREATE POLICY "Users can update own profile" ON users 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    -- Prevent users from setting themselves as admin
    (is_admin IS NULL OR is_admin = (SELECT is_admin FROM users WHERE id = auth.uid()))
  );

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Set your first user as admin (replace with your actual user email)
-- Uncomment and run this line with your email after creating your account:
-- UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';

-- Comment: To make a user an admin, run this query in Supabase SQL editor:
-- UPDATE users SET is_admin = true WHERE email = 'admin@example.com';




