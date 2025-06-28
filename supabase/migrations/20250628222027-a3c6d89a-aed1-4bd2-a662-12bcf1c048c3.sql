
-- Prima vediamo se l'utente esiste
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'direzione@terradellemarche.it';

-- Poi vediamo se il business esiste
SELECT id, business_name, email, user_id 
FROM businesses 
WHERE email = 'direzione@terradellemarche.it' 
   OR business_name ILIKE '%terra%marche%';

-- Se entrambi esistono ma non sono collegati, li colleghiamo
UPDATE businesses 
SET user_id = (
    SELECT id FROM auth.users WHERE email = 'direzione@terradellemarche.it'
)
WHERE email = 'direzione@terradellemarche.it' AND user_id IS NULL;

-- Verifichiamo che il collegamento sia avvenuto
SELECT 
    u.id as user_id,
    u.email as user_email,
    b.id as business_id,
    b.business_name,
    b.user_id
FROM auth.users u
JOIN businesses b ON u.id = b.user_id
WHERE u.email = 'direzione@terradellemarche.it';
