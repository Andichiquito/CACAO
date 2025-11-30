-- Script mejorado para actualizar LICUADO con múltiples selectores
-- Ejecutar en el SQL Editor de Supabase

-- Primero, ver qué productos de LICUADO existen
SELECT id, name, description, price, category_id
FROM products 
WHERE name ILIKE '%LICUADO%'
ORDER BY name;

-- Actualizar el producto LICUADO (sin "CON AGUA" en el nombre)
-- Este tendrá dos dropdowns: Base y Sabor
UPDATE products 
SET description = 'Base: Con agua, Con leche | Sabor: Piña con papaya, Frutos del bosque, Copoazú con durazno, Limonada de frutilla, Piña hierba buena, Frutilla hierba buena, Mango maracuyá'
WHERE name = 'LICUADO'
  OR (name ILIKE 'LICUADO' AND name NOT ILIKE '%CON AGUA%' AND name NOT ILIKE '%CON LECHE%');

-- Si existe "LICUADO CON AGUA" como producto separado, eliminarlo
-- porque ahora es una opción del dropdown
DELETE FROM products 
WHERE name ILIKE 'LICUADO CON AGUA'
  OR name ILIKE 'LICUADO CON LECHE';

-- Verificar el resultado final
SELECT id, name, description, price 
FROM products 
WHERE name ILIKE '%LICUADO%'
ORDER BY name;
