
-- Create storage bucket for business logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-logos', 'business-logos', true);

-- Allow authenticated users to upload their logos
CREATE POLICY "Business owners can upload logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'business-logos' AND
  auth.role() = 'authenticated'
);

-- Allow public access to view logos
CREATE POLICY "Anyone can view business logos" ON storage.objects
FOR SELECT USING (bucket_id = 'business-logos');
