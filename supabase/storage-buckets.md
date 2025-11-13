# Supabase Storage Buckets Setup

After setting up your Supabase project, you need to create the following storage buckets:

## Required Buckets

### 1. tutorials
- **Purpose**: Store tutorial videos and thumbnails
- **Public**: Yes (Enable public access)
- **File size limit**: 100MB recommended
- **Allowed MIME types**: video/*, image/*

### 2. posts
- **Purpose**: Store community post images and videos
- **Public**: Yes (Enable public access)
- **File size limit**: 50MB recommended
- **Allowed MIME types**: video/*, image/*

### 3. progress-photos
- **Purpose**: Store user progress photos
- **Public**: Yes (Enable public access)
- **File size limit**: 10MB recommended
- **Allowed MIME types**: image/*

## How to Create Buckets

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Enter the bucket name (exactly as listed above)
5. Toggle **Public bucket** to ON
6. Click **Create bucket**

## Storage Policies

The buckets are set to public, so RLS policies are automatically handled. Users can:
- Upload files to their own folders
- Read all files (since they're public)

## Alternative: SQL Command

You can also create buckets via SQL:

```sql
-- Create tutorials bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('tutorials', 'tutorials', true);

-- Create posts bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true);

-- Create progress-photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true);
```

