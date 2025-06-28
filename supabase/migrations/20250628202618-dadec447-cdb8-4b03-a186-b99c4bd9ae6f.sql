
-- Controlliamo tutte le aziende nel database per vedere cosa c'è realmente
SELECT 
  id,
  business_name,
  is_verified,
  created_at
FROM businesses 
ORDER BY business_name;

-- Controlliamo se esiste Terra delle Marche (anche non verificata)
SELECT 
  id,
  business_name,
  is_verified,
  user_id
FROM businesses 
WHERE business_name ILIKE '%terra%marche%'
   OR business_name ILIKE '%terra delle marche%';

-- Se esiste, verifichiamola
UPDATE businesses 
SET is_verified = true 
WHERE business_name ILIKE '%terra%marche%'
   OR business_name ILIKE '%terra delle marche%';

-- Controlliamo i punti vendita di Terra delle Marche
SELECT 
  s.id,
  s.store_name,
  s.city,
  s.is_active,
  b.business_name,
  b.is_verified
FROM stores s
JOIN businesses b ON s.business_id = b.id
WHERE b.business_name ILIKE '%terra%marche%'
   OR b.business_name ILIKE '%terra delle marche%';
