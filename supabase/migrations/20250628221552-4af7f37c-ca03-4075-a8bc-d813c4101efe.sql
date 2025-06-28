
-- Controlliamo lo stato attuale del database per capire cosa è successo
SELECT 
    u.id as user_id,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    b.id as business_id,
    b.business_name,
    b.email as business_email,
    b.user_id as business_user_id,
    b.is_verified
FROM auth.users u
LEFT JOIN businesses b ON (u.id = b.user_id OR u.email = b.email)
WHERE u.email = 'direzione@terradellemarche.it'
ORDER BY b.created_at;

-- Controlliamo se ci sono business duplicati
SELECT 
    id,
    business_name,
    email,
    user_id,
    created_at
FROM businesses 
WHERE email = 'direzione@terradellemarche.it' OR business_name ILIKE '%terra%marche%'
ORDER BY created_at;
