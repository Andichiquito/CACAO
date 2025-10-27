-- Ejemplo de SQL para crear tablas en Supabase
-- Puedes ejecutar estos comandos en el SQL Editor de Supabase

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  emoji VARCHAR(10),
  image_url TEXT,
  category VARCHAR(100),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar algunos productos de ejemplo
INSERT INTO products (name, description, price, emoji, category) VALUES
('Café Especial', 'Nuestro blend premium', 4.50, '☕', 'bebidas'),
('Cupcakes Artesanales', 'Hechos a mano diariamente', 3.25, '🧁', 'postres'),
('Croissants Frescos', 'Horneados cada mañana', 2.75, '🥐', 'panadería'),
('Latte con Arte', 'Preparado por nuestros baristas', 5.00, '🎨', 'bebidas'),
('Torta de Chocolate', 'Receta secreta de la casa', 6.50, '🍰', 'postres');

-- Tabla de usuarios (opcional, para autenticación)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para productos (lectura pública)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Políticas de seguridad para perfiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
