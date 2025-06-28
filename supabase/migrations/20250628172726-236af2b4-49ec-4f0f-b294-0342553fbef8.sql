
-- Inserisce il business di test nel database
INSERT INTO businesses (
  id,
  business_name,
  owner_name,
  email,
  phone,
  category,
  region,
  description,
  website,
  primary_brand,
  secondary_brands,
  is_verified
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Terra delle Marche',
  'Test Owner',
  'direzione@terradellemarche.it',
  '123456789',
  'Alimentari',
  'Marche',
  'Azienda di test per sviluppo',
  'https://terradellemarche.it',
  'Terra delle Marche',
  ARRAY['Brand Secondario'],
  false
) ON CONFLICT (id) DO NOTHING;
