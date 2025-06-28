
-- Aggiungiamo politiche RLS per permettere agli admin di accedere ai dati
-- Prima creiamo una policy per permettere agli admin di leggere tutti i businesses
CREATE POLICY "Admins can view all businesses" ON businesses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = current_setting('request.jwt.claims', true)::json->>'sub'
      AND is_active = true
    )
  );

-- Stessa cosa per gli stores
CREATE POLICY "Admins can view all stores" ON stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = current_setting('request.jwt.claims', true)::json->>'sub'
      AND is_active = true
    )
  );
