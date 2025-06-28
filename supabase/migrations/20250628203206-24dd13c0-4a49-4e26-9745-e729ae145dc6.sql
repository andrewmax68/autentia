
-- Creiamo una tabella per gli amministratori
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Inseriamo un admin di default (password: admin123)
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('admin@dovesivende.it', '$2b$12$LQv3c1yqBWVHxkd0LQ1lHuUQTiubPjWdNl3lZp8XUl4xWkD.gKQ5e', 'Amministratore');

-- Creiamo indici per performance
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Aggiungiamo una colonna per tracking delle sessioni admin
ALTER TABLE businesses ADD COLUMN last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();
