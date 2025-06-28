
-- Resettiamo la password per l'utente Terra delle Marche esistente
UPDATE auth.users 
SET 
    encrypted_password = crypt('terradellemarche2024', gen_salt('bf')),
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'direzione@terradellemarche.it';

-- Assicuriamoci che il business sia verificato
UPDATE businesses 
SET is_verified = true 
WHERE email = 'direzione@terradellemarche.it';

-- Verifichiamo che tutto sia corretto
SELECT 
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmed,
    b.business_name,
    b.is_verified
FROM auth.users u
JOIN businesses b ON u.id = b.user_id
WHERE u.email = 'direzione@terradellemarche.it';
