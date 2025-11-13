-- Cleanup script to remove all existing tables and policies
-- Run this BEFORE running schema.sql if you get "already exists" errors

-- Drop all policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Tutorials are viewable by everyone" ON tutorials;
DROP POLICY IF EXISTS "Authenticated users can create tutorials" ON tutorials;
DROP POLICY IF EXISTS "Authenticated users can update tutorials" ON tutorials;
DROP POLICY IF EXISTS "Authenticated users can delete tutorials" ON tutorials;
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Authors can update own posts" ON posts;
DROP POLICY IF EXISTS "Authors can delete own posts" ON posts;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Authors can delete own comments" ON comments;
DROP POLICY IF EXISTS "Users can view own progress" ON progress;
DROP POLICY IF EXISTS "Users can create own progress" ON progress;
DROP POLICY IF EXISTS "Users can update own progress" ON progress;
DROP POLICY IF EXISTS "Users can view own progress photos" ON progress_photos;
DROP POLICY IF EXISTS "Users can create own progress photos" ON progress_photos;
DROP POLICY IF EXISTS "Users can update own progress photos" ON progress_photos;
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can create own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
DROP POLICY IF EXISTS "System can create achievements" ON achievements;
DROP POLICY IF EXISTS "Daily trick is viewable by everyone" ON daily_trick;
DROP POLICY IF EXISTS "System can create daily trick" ON daily_trick;
DROP POLICY IF EXISTS "Post likes are viewable by everyone" ON post_likes;
DROP POLICY IF EXISTS "Users can create own post likes" ON post_likes;
DROP POLICY IF EXISTS "Users can delete own post likes" ON post_likes;

-- Drop all triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_tutorials_updated_at ON tutorials;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
DROP TRIGGER IF EXISTS update_progress_updated_at ON progress;
DROP TRIGGER IF EXISTS update_progress_photos_updated_at ON progress_photos;
DROP TRIGGER IF EXISTS update_post_likes_count_trigger ON post_likes;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop all functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS update_post_likes_count();
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop all tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS daily_trick CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS progress_photos CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS tutorials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Confirm cleanup
SELECT 'Database cleanup complete! Now run schema.sql' AS status;

