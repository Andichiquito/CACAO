-- Script para insertar el menú completo de CACAO
-- Ejecutar este script en el SQL Editor de Supabase
-- Asegúrate de que las categorías base ya existan o ejecuta primero insert-sample-data.sql

-- ============================================
-- BRUNCH ALL DAY
-- ============================================
-- Insertar categoría BRUNCH ALL DAY
INSERT INTO categories (name, description, is_active) VALUES
('BRUNCH ALL DAY', 'Brunch disponible todo el día', true)
ON CONFLICT (name) DO NOTHING;

-- Obtener el ID de la categoría BRUNCH ALL DAY (asumiendo que se inserta después de las categorías existentes)
-- Si ya existe, usar el ID existente. Para este script, asumimos que el ID será el siguiente disponible.

-- Insertar productos de WAFFLES
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'AMERICANO', 
  'Waffle, fried egg, bacon, chives, and syrup', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'AMERICANO' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PALTOS', 
  'Waffle, herb quenelle, avocado, fried egg, and sprouts', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PALTOS' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'WAFFLE DULCE', 
  'Waffle, vanilla ice cream, seasonal fruit, whipped cream, and good herb sugar', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'WAFFLE DULCE' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

-- Insertar productos de SOBRE PAN
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'AMERICANO SOBRE PAN', 
  'Country bread, scrambled egg, crunchy bacon, chives, and syrup', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'AMERICANO SOBRE PAN' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'AVOCADO SOBRE PAN', 
  'Country bread, special avocado cheese base, fried egg, confit tomato, and sprouts', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'AVOCADO SOBRE PAN' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'CRIOLLO SOBRE PAN', 
  'Country bread, mix of green leaves, jerky, confit tomato, pickled onion, pickled locoto, sprouts, and quirquiña oil', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'CRIOLLO SOBRE PAN' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

-- Insertar productos de ENTRE PAN
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'STEAK', 
  'Country bread, mix of green leaves, sautéed sirloin, pickles, confit tomato, house mayonnaise, and sprouts', 
  33.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'STEAK' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PERNIL', 
  'Country bread, special cheese base, arugula, fresh tomato slices, pork leg, and pickled pickles', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PERNIL' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'HONEY MUSTARD CHICKEN', 
  'Country bread, mix of green leaves, fresh tomato slices, chicken marinated in honey and mustard, melted cheddar cheese, and pickled onion', 
  30.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'HONEY MUSTARD CHICKEN' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'EL PHILI', 
  'Country bread, mozzarella cheese, marinated meat sautéed with cream mushrooms, crunchy bacon, caramelized onion, and mozzarella cheese', 
  33.00, 
  (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'EL PHILI' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY'));

-- ============================================
-- SALADOS
-- ============================================
-- Insertar categoría SALADOS
INSERT INTO categories (name, description, is_active) VALUES
('SALADOS', 'Platos salados y sandwiches', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar productos de SANDWICHES
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'POLLO AL PESTO', 
  'Pan molde de masa madre, queso mozzarella, pollo desmenuzado con pesto y pimentón asada', 
  18.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'POLLO AL PESTO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'NAPOLITANO', 
  'Pan molde de masa madre, queso mozzarella, jamón, tomate fresco en rodajas, orégano', 
  18.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'NAPOLITANO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'CAPRESE', 
  'Pan molde de masa madre untado con pesto de albahaca, queso mozzarella y tomate fresco en rodajas', 
  16.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'CAPRESE' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'MIXTO', 
  'Pan molde de masa madre untado con mantequilla, queso mozzarella y jamón', 
  16.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'MIXTO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

-- Insertar productos de PANINIS
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PANINI DE LA CASA', 
  'Queso mozzarella, lomo de cerdo, queso roquefort, rúcula y tomate confitada', 
  27.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PANINI DE LA CASA' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PANINI CACAO', 
  'Pan untado con salsa miel y mostaza, queso mozzarella, lomo de cerdo, tomate fresco y pepinillos', 
  27.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PANINI CACAO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PANINI CHICKEN BBQ', 
  'Queso mozzarella, pollo desmenuzado con salsa bbq y cebolla caramelizada', 
  27.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PANINI CHICKEN BBQ' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PANINI CRIOLLO', 
  'Pan untado con pesto de quirquiña, queso mozzarella, charque, locoto en escabeche, tomate fresco y queso roquefort', 
  27.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PANINI CRIOLLO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

-- Insertar productos de CUÑAPES
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'CUÑAPE CLÁSICO', 
  'Cuñawaffle', 
  10.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'CUÑAPE CLÁSICO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'CUÑAPE CON TOPPING - QUESO CREMA Y PESTO', 
  'Cuñape con queso crema y pesto de albahaca', 
  15.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'CUÑAPE CON TOPPING - QUESO CREMA Y PESTO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'CUÑAPE CON TOPPING - DULCE DE LECHE Y MERMELADA', 
  'Cuñape con dulce de leche y mermelada de frutilla', 
  15.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'CUÑAPE CON TOPPING - DULCE DE LECHE Y MERMELADA' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

-- Insertar productos de BAGELS
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'BAGEL GRINGO', 
  'Queso cheddar, revuelto de huevo y tocino', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BAGEL GRINGO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'BAGEL GRINGO XL', 
  'Queso cheddar, palta laminada, revuelto de huevo y tocino', 
  30.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BAGEL GRINGO XL' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'BAGEL DEL CAMPO', 
  'Base de queso crema especial rúcula, champiñones salteados, cebolla caramelizada y huevo frito', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BAGEL DEL CAMPO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'BAGEL DESMECHADO', 
  'Cama de palta, pollo desmechado en mayonesa de paprika y cebolla encurtida', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BAGEL DESMECHADO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'BAGEL DE PERNIL', 
  'Base de queso crema especial, rúcula, pernil, pepinillos', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BAGEL DE PERNIL' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'BAGEL NÓRDICO', 
  'Base de queso crema especial rúcula, salmón curado, pepinillos', 
  27.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BAGEL NÓRDICO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'BAGEL CURADO', 
  'Base de rúcula, lomo de res curado, queso brie, tomate confitado y un toque de miel de abeja', 
  27.00, 
  (SELECT id FROM categories WHERE name = 'SALADOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BAGEL CURADO' AND category_id = (SELECT id FROM categories WHERE name = 'SALADOS'));

-- ============================================
-- REPOSTERÍA
-- ============================================
-- Insertar categoría REPOSTERÍA
INSERT INTO categories (name, description, is_active) VALUES
('REPOSTERÍA', 'Tortas y postres artesanales', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar productos de TORTAS
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PORCIÓN DE TORTA DE ZANAHORIA', 
  'Deliciosa porción de torta de zanahoria', 
  22.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PORCIÓN DE TORTA DE ZANAHORIA' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PORCIÓN DE TORTA DE CHOCOLATE', 
  'Deliciosa porción de torta de chocolate', 
  22.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PORCIÓN DE TORTA DE CHOCOLATE' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PORCIÓN DE TORTA DE RED VELVET', 
  'Deliciosa porción de torta red velvet', 
  22.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PORCIÓN DE TORTA DE RED VELVET' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PORCIÓN TORTA DEL MES', 
  'Cada mes una diferente, consultar variedad', 
  25.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PORCIÓN TORTA DEL MES' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'TRES LECHES CLÁSICOS', 
  'Chocolate/Red velvet', 
  12.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'TRES LECHES CLÁSICOS' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'TRES LECHES PREMIUM', 
  'Chocomaracuya/Pie de limón/Café con dulce de leche', 
  15.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'TRES LECHES PREMIUM' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

-- Insertar productos de POSTRES
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'TOSTADAS FRANCESAS', 
  'A nuestro estilo y con helado de vainilla y frutillas', 
  22.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'TOSTADAS FRANCESAS' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'CINNAMON ROLL', 
  'Con o sin frosting', 
  12.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'CINNAMON ROLL' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'BROWNIE', 
  'Brownie artesanal', 
  12.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BROWNIE' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'BROWNIE CON HELADO', 
  'Brownie con helado', 
  18.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BROWNIE CON HELADO' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'ALFAJORES TIPO MARPLATENSES', 
  'Café y manjar/Chocomaracuya/Chocomenta/Chocolate y frambuesa/Dulce de leche', 
  12.00, 
  (SELECT id FROM categories WHERE name = 'REPOSTERÍA'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'ALFAJORES TIPO MARPLATENSES' AND category_id = (SELECT id FROM categories WHERE name = 'REPOSTERÍA'));

-- ============================================
-- COOKIE BAR
-- ============================================
-- Insertar categoría COOKIE BAR
INSERT INTO categories (name, description, is_active) VALUES
('COOKIE BAR', 'Cookies artesanales', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar productos de PAQUETES
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'COOKIES CLÁSICAS PAQUETE', 
  'Paquete de cookies clásicas', 
  18.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'COOKIES CLÁSICAS PAQUETE' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'COOKIES RED VELVET PAQUETE', 
  'Paquete de cookies red velvet', 
  18.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'COOKIES RED VELVET PAQUETE' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'COOKIES DE LIMÓN, ARÁNDANO DESHIDRATADO Y CHIPS DE CHOCOLATE BLANCO PAQUETE', 
  'Paquete de cookies de limón, arándano deshidratado y chips de chocolate blanco', 
  18.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'COOKIES DE LIMÓN, ARÁNDANO DESHIDRATADO Y CHIPS DE CHOCOLATE BLANCO PAQUETE' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'COOKIES DE AVENA Y CHIPS DE CHOCOLATE PAQUETE', 
  'Paquete de cookies de avena y chips de chocolate', 
  18.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'COOKIES DE AVENA Y CHIPS DE CHOCOLATE PAQUETE' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'COOKIES DE AVENA, ZANAHORIA Y UVAS PASAS PAQUETE', 
  'Paquete de cookies de avena, zanahoria y uvas pasas', 
  18.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'COOKIES DE AVENA, ZANAHORIA Y UVAS PASAS PAQUETE' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'COOKIES DE AVENA, CHOCOLATE, ARÁNDANO DESHIDRATADO Y CHIPS DE CHOCOLATE BLANCO PAQUETE', 
  'Paquete de cookies de avena, chocolate, arándano deshidratado y chips de chocolate blanco', 
  18.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'COOKIES DE AVENA, CHOCOLATE, ARÁNDANO DESHIDRATADO Y CHIPS DE CHOCOLATE BLANCO PAQUETE' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

-- Insertar productos de SUELTAS
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'COOKIE RED VELVET', 
  'Cookie red velvet individual', 
  8.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'COOKIE RED VELVET' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'COOKIE CLÁSICA', 
  'Cookie clásica individual', 
  8.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'COOKIE CLÁSICA' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'COOKIE AVENA CHIPS', 
  'Cookie de avena con chips individual', 
  8.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'COOKIE AVENA CHIPS' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'MINI COOKIES 100grs', 
  'Clásica/Red velvet', 
  15.00, 
  (SELECT id FROM categories WHERE name = 'COOKIE BAR'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'MINI COOKIES 100grs' AND category_id = (SELECT id FROM categories WHERE name = 'COOKIE BAR'));

-- ============================================
-- DESAYUNOS
-- ============================================
-- Insertar categoría DESAYUNOS
INSERT INTO categories (name, description, is_active) VALUES
('DESAYUNOS', 'Desayunos completos y extras', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar productos de DESAYUNOS
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'DESAYUNO CACAO', 
  'Bagel, huevos revueltos, tocino, syrup, porción de queso crema y mermelada, zumo de naranja, latte', 
  45.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'DESAYUNO CACAO' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'DESAYUNO AMERICANO', 
  'Pan de campo, huevo revuelto, tocino, tomate confitado y syrup, café americano o infusión', 
  40.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'DESAYUNO AMERICANO' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'DESAYUNO EJECUTIVO', 
  'Tostada, palta, pernil y tomate confitado, iced tea o americano', 
  35.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'DESAYUNO EJECUTIVO' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'DESAYUNO COWORKER', 
  'Bagel, porción de queso crema y mermelada, cappuccino', 
  30.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'DESAYUNO COWORKER' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

-- Insertar productos de EXTRAS
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PORCIÓN DE TOCINO', 
  'Porción adicional de tocino', 
  12.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PORCIÓN DE TOCINO' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PORCIÓN DE HUEVO', 
  'Porción adicional de huevo', 
  6.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PORCIÓN DE HUEVO' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PORCIÓN DE QUESO CREMA Y MERMELADA', 
  'Porción de queso crema y mermelada', 
  5.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PORCIÓN DE QUESO CREMA Y MERMELADA' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PORCIÓN DE PALTA', 
  'Porción adicional de palta', 
  10.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PORCIÓN DE PALTA' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'PORCIÓN DE SYRUP', 
  'Porción adicional de syrup', 
  4.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PORCIÓN DE SYRUP' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'TOSTADAS', 
  'Tostadas adicionales', 
  5.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'TOSTADAS' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'CREMA BATIDA', 
  'Porción de crema batida', 
  5.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'CREMA BATIDA' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

-- Insertar productos de ZUMOS
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) 
SELECT 
  'ZUMO DE NARANJA (250 ML)', 
  'Zumo de naranja natural 250ml', 
  12.00, 
  (SELECT id FROM categories WHERE name = 'DESAYUNOS'), 
  true, 
  100
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'ZUMO DE NARANJA (250 ML)' AND category_id = (SELECT id FROM categories WHERE name = 'DESAYUNOS'));

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Verificar que todos los productos se insertaron correctamente
SELECT 
  c.name as categoria,
  COUNT(p.id) as total_productos
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE c.name IN ('BRUNCH ALL DAY', 'SALADOS', 'REPOSTERÍA', 'COOKIE BAR', 'DESAYUNOS')
GROUP BY c.name
ORDER BY c.name;

