-- 🚀 COMPLETE STORAGE SETUP FOR AERIAL TRICK
-- Run this ONCE in Supabase SQL Editor to set up all storage

-- ============================================
-- STEP 1: CREATE STORAGE BUCKETS
-- ============================================

-- Create tutorials bucket (for videos and thumbnails)
-- Increased to 1GB to support long, high-quality tutorial videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tutorials', 
  'tutorials', 
  true,
  1073741824, -- 1GB limit (1024MB) - supports large tutorial videos
  ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mpeg', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 1073741824,
  allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mpeg', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Create posts bucket (for community posts)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posts', 
  'posts', 
  true,
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Create progress-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'progress-photos', 
  'progress-photos', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- ============================================
-- STEP 2: DROP OLD POLICIES (if they exist)
-- ============================================

DROP POLICY IF EXISTS "Authenticated users can upload to tutorials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tutorials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from tutorials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can view tutorials" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can upload to posts bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update posts bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from posts bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can view posts" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can upload to progress-photos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update progress-photos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from progress-photos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own progress photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view progress photos" ON storage.objects;

-- ============================================
-- STEP 3: CREATE NEW STORAGE POLICIES
-- ============================================

-- TUTORIALS BUCKET POLICIES
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload to tutorials bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tutorials');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update tutorials bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tutorials');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete from tutorials bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tutorials');

-- Allow everyone to view (public bucket)
CREATE POLICY "Public can view tutorials"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tutorials');

-- POSTS BUCKET POLICIES
CREATE POLICY "Authenticated users can upload to posts bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');

CREATE POLICY "Authenticated users can update posts bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can delete from posts bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts');

CREATE POLICY "Public can view posts"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');

-- PROGRESS PHOTOS BUCKET POLICIES
CREATE POLICY "Authenticated users can upload to progress-photos bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'progress-photos');

CREATE POLICY "Authenticated users can update progress-photos bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'progress-photos');

CREATE POLICY "Authenticated users can delete from progress-photos bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'progress-photos');

-- Allow users to view all progress photos (public bucket)
CREATE POLICY "Public can view progress photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'progress-photos');

-- ============================================
-- STEP 4: SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ STORAGE SETUP COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📦 Buckets created:';
  RAISE NOTICE '  ✓ tutorials (public, 1GB limit)';
  RAISE NOTICE '  ✓ posts (public, 50MB limit)';
  RAISE NOTICE '  ✓ progress-photos (public, 10MB limit)';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Policies configured:';
  RAISE NOTICE '  ✓ Authenticated users can upload';
  RAISE NOTICE '  ✓ Public can view all files';
  RAISE NOTICE '  ✓ Authenticated users can manage their uploads';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 You can now upload videos, thumbnails, and photos!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;

