-- 🔧 FIX STORAGE POLICIES FOR UPLOADS
-- This script fixes the storage bucket policies to allow file uploads

-- Step 1: Update tutorials bucket policy to allow uploads for authenticated users
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload to tutorials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tutorials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from tutorials bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can view tutorials" ON storage.objects;

-- Step 2: Create new policies for tutorials bucket
-- Allow authenticated users to upload (INSERT)
CREATE POLICY "Authenticated users can upload to tutorials bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tutorials');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update tutorials bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tutorials');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete from tutorials bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tutorials');

-- Allow public to view (SELECT) all files in tutorials bucket
CREATE POLICY "Public can view tutorials"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tutorials');

-- Step 3: Update posts bucket policies
DROP POLICY IF EXISTS "Authenticated users can upload to posts bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can view posts" ON storage.objects;

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

-- Step 4: Update progress-photos bucket policies
DROP POLICY IF EXISTS "Authenticated users can upload to progress-photos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own progress photos" ON storage.objects;

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

CREATE POLICY "Users can view their own progress photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'progress-photos');

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Storage policies updated successfully!';
  RAISE NOTICE 'You can now upload videos, thumbnails, and photos.';
END $$;

