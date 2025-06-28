
-- Controlliamo tutti gli utenti nel database per vedere cosa c'è realmente
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users 
WHERE email ILIKE '%terra%' OR email ILIKE '%marche%'
ORDER BY created_at DESC;

-- Controlliamo se esiste un business Terra delle Marche
SELECT 
  id,
  business_name,
  email,
  user_id,
  is_verified
FROM businesses 
WHERE business_name ILIKE '%terra%marche%'
   OR business_name ILIKE '%terra delle marche%'
   OR email ILIKE '%terra%'
   OR email ILIKE '%marche%';

-- Se l'utente esiste ma l'email non è confermata, la confermiamo
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email ILIKE '%terra%' OR email ILIKE '%marche%'
  AND email_confirmed_at IS NULL;

-- Se il business esiste, assicuriamoci che sia verificato
UPDATE businesses 
SET is_verified = true 
WHERE business_name ILIKE '%terra%marche%'
   OR business_name ILIKE '%terra delle marche%';
