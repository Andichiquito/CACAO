-- Script simplificado para insertar el producto LICUADO
-- Ejecutar en el SQL Editor de Supabase

-- Insertar el producto LICUADO
INSERT INTO products (name, description, price, category_id, is_available)
VALUES (
  'LICUADO',
  'Base: Con agua, Con leche | Sabor: Piña con papaya, Frutos del bosque, Copoazú con durazno, Limonada de frutilla, Piña hierba buena, Frutilla hierba buena, Mango maracuyá',
  16.00,
  (SELECT id FROM categories WHERE name ILIKE '%BEBIDAS FRÍAS%' OR name ILIKE '%BEBIDAS FRIAS%' LIMIT 1),
  true
);

-- Verificar el producto insertado
SELECT id, name, description, price, category_id, is_available
FROM products
WHERE name = 'LICUADO'
ORDER BY id DESC
LIMIT 1;
