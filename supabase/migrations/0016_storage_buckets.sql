-- ==============================================================================
-- 0016: Supabase Storage Buckets and Access Policies
-- ==============================================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'travel-images',
        'travel-images',
        true,
        10485760, -- 10MB
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
    ),
    (
        'travel-documents',
        'travel-documents',
        false, -- Strictly PRIVATE
        20971520, -- 20MB
        ARRAY['application/pdf', 'image/jpeg', 'image/png']
    ),
    (
        'quotation-files',
        'quotation-files',
        false, -- Strictly PRIVATE
        20971520, -- 20MB
        ARRAY['application/pdf']
    )
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 2. Storage Objects Security Policies
-- ==============================================================================

-- A. travel-images policies
DROP POLICY IF EXISTS "Public users can view travel images" ON storage.objects;
CREATE POLICY "Public users can view travel images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'travel-images');

DROP POLICY IF EXISTS "Admins and Staff can upload travel images" ON storage.objects;
CREATE POLICY "Admins and Staff can upload travel images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'travel-images' 
        AND (public.is_staff_or_admin() = true)
    );

DROP POLICY IF EXISTS "Admins and Staff can update travel images" ON storage.objects;
CREATE POLICY "Admins and Staff can update travel images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'travel-images' 
        AND (public.is_staff_or_admin() = true)
    );

DROP POLICY IF EXISTS "Admins can delete travel images" ON storage.objects;
CREATE POLICY "Admins can delete travel images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'travel-images' 
        AND (public.is_admin() = true)
    );

-- B. travel-documents policies (Private)
DROP POLICY IF EXISTS "Customers can read their own documents or Admins can read all" ON storage.objects;
CREATE POLICY "Customers can read their own documents or Admins can read all"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'travel-documents'
        AND (
            public.is_staff_or_admin() = true
            OR (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
        )
    );

DROP POLICY IF EXISTS "Admins and Staff can upload customer documents" ON storage.objects;
CREATE POLICY "Admins and Staff can upload customer documents"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'travel-documents'
        AND (public.is_staff_or_admin() = true)
    );

DROP POLICY IF EXISTS "Admins and Staff can delete customer documents" ON storage.objects;
CREATE POLICY "Admins and Staff can delete customer documents"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'travel-documents'
        AND (public.is_staff_or_admin() = true)
    );

-- C. quotation-files policies (Private)
DROP POLICY IF EXISTS "Authorized clients or Admins can view quotation PDFs" ON storage.objects;
CREATE POLICY "Authorized clients or Admins can view quotation PDFs"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'quotation-files'
        AND (
            public.is_staff_or_admin() = true
            OR (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
        )
    );

DROP POLICY IF EXISTS "Admins and Staff can upload quotation PDFs" ON storage.objects;
CREATE POLICY "Admins and Staff can upload quotation PDFs"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'quotation-files'
        AND (public.is_staff_or_admin() = true)
    );
