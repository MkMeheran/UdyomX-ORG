-- ============================================
-- SUPABASE STORAGE BUCKETS SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Create Gallery bucket (for images and videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gallery',
    'gallery',
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];

-- Create Downloads bucket (for PDFs, docs, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'downloads',
    'downloads',
    true,
    26214400, -- 25MB limit
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
        'application/x-rar-compressed',
        'image/jpeg',
        'image/png',
        'image/gif'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 26214400,
    allowed_mime_types = ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
        'application/x-rar-compressed',
        'image/jpeg',
        'image/png',
        'image/gif'
    ];

-- Create Thumbnails bucket (for cover images, thumbnails)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'thumbnails',
    'thumbnails',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- ============================================
-- STORAGE POLICIES - Allow public read, authenticated upload
-- ============================================

-- Gallery Bucket Policies
CREATE POLICY "Public gallery read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Allow gallery uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow gallery updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery');

CREATE POLICY "Allow gallery deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery');

-- Downloads Bucket Policies
CREATE POLICY "Public downloads read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'downloads');

CREATE POLICY "Allow downloads uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'downloads');

CREATE POLICY "Allow downloads updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'downloads');

CREATE POLICY "Allow downloads deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'downloads');

-- Thumbnails Bucket Policies
CREATE POLICY "Public thumbnails read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

CREATE POLICY "Allow thumbnails uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Allow thumbnails updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'thumbnails');

CREATE POLICY "Allow thumbnails deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'thumbnails');

-- ============================================
-- DONE! Now you can upload files to these buckets
-- ============================================
