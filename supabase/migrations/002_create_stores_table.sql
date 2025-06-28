
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

-- Public view for search
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

-- Indexes for geographic search
CREATE INDEX idx_stores_location ON stores USING GIST(
  point(longitude, latitude)
);
CREATE INDEX idx_stores_brand ON stores(brand);
CREATE INDEX idx_stores_city ON stores(city);
