-- Script para insertar productos COCA COLA y AGUA en REFRESCANTES
-- Ejecutar en el SQL Editor de Supabase

-- Insertar AGUA
INSERT INTO products (name, description, price, category_id, is_available)
VALUES (
  'AGUA',
  '(con gas/sin gas)',
  7.00,
  (SELECT id FROM categories WHERE name ILIKE '%BEBIDAS FRÍAS%' OR name ILIKE '%BEBIDAS FRIAS%' LIMIT 1),
  true
);

-- Insertar COCA COLA
INSERT INTO products (name, description, price, category_id, is_available)
VALUES (
  'COCA COLA',
  '(normal/sin azúcar)',
  10.00,
  (SELECT id FROM categories WHERE name ILIKE '%BEBIDAS FRÍAS%' OR name ILIKE '%BEBIDAS FRIAS%' LIMIT 1),
  true
);

-- Verificar los productos insertados
SELECT id, name, description, price, category_id, is_available
FROM products
WHERE name IN ('AGUA', 'COCA COLA')
ORDER BY name;
