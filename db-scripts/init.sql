
-- Se connecter à la base de données products
\c products;

-- Donner tous les privilèges à l'utilisateur admin sur la base products
GRANT ALL PRIVILEGES ON DATABASE products TO admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- Permettre à admin de créer des tables et autres objets
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin;

-- Créer les tables nécessaires (exemple)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer une table pour les utilisateurs admin (si nécessaire)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer des données de test
INSERT INTO products (name, description, price) VALUES 
('Produit Test 1', 'Description du produit 1', 19.99),
('Produit Test 2', 'Description du produit 2', 29.99)
ON CONFLICT DO NOTHING;

-- Insérer un utilisateur admin de test (mot de passe: password)
-- Note: En production, utilisez un hash sécurisé !
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2b$10$rOGTkJYrwlUYOLGzqjFcxuxmyKJvqZLqbhPiLo.PUiYgNGdCOuZei', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;

-- Afficher les tables créées
\dt