
-- Create businesses table for company registration
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  category VARCHAR(100),
  region VARCHAR(100),
  description TEXT,
  website VARCHAR(500),
  logo_url VARCHAR(500),
  primary_brand VARCHAR(255) NOT NULL,
  secondary_brands TEXT[], -- Array for multiple brands
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own business" ON businesses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business" ON businesses
  FOR UPDATE USING (auth.uid() = user_id);

-- Create stores table for points of sale
CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  store_name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(500),
  opening_hours JSONB,
  services TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Business owners can manage their stores" ON stores
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

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

-- Public view for search functionality
CREATE VIEW public_businesses AS
SELECT 
  id,
  business_name,
  category,
  region,
  description,
  website,
  logo_url,
  primary_brand,
  secondary_brands,
  created_at
FROM businesses 
WHERE is_verified = TRUE;

-- Public view for stores search
CREATE VIEW public_stores AS
SELECT 
  s.id,
  s.store_name,
  s.brand,
  s.address,
  s.city,
  s.province,
  s.latitude,
  s.longitude,
  s.phone,
  s.email,
  s.website,
  s.opening_hours,
  s.services,
  b.business_name,
  b.category,
  b.logo_url
FROM stores s
JOIN businesses b ON s.business_id = b.id
WHERE s.is_active = TRUE AND b.is_verified = TRUE;

-- Indexes for performance
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_region ON businesses(region);
CREATE INDEX idx_businesses_brands ON businesses USING GIN(secondary_brands);
CREATE INDEX idx_stores_location ON stores USING GIST(point(longitude, latitude));
CREATE INDEX idx_stores_brand ON stores(brand);
CREATE INDEX idx_stores_city ON stores(city);
