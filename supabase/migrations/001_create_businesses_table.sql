
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

-- Indexes for performance
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_region ON businesses(region);
CREATE INDEX idx_businesses_brands ON businesses USING GIN(secondary_brands);
