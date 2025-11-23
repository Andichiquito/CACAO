-- Script para insertar datos de ejemplo en las tablas de categorías y productos
-- Ejecutar este script en el SQL Editor de Supabase

-- Insertar categorías
INSERT INTO categories (name, description, is_active) VALUES
('BEBIDAS CALIENTES', 'Café y bebidas calientes tradicionales', true),
('CAFETERÍA FRÍA', 'Bebidas frías a base de café', true),
('INFUSIONES CALIENTES', 'Tés e infusiones naturales', true),
('CHOCOLATES', 'Bebidas de chocolate calientes', true),
('BEBIDAS FRÍAS', 'Refrescos y bebidas frías', true);

-- Insertar productos para BEBIDAS CALIENTES
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) VALUES
('ESPRESSO', 'Café concentrado, preparado en máquina espresso (40ml)', 14.00, 1, true, 100),
('AMERICANO', 'Doble espresso diluido con agua caliente', 15.00, 1, true, 100),
('MACCHIATO', 'Doble espresso con un poco de leche texturizada', 15.00, 1, true, 100),
('CAPPUCCINO', 'Doble espresso con leche texturizada', 20.00, 1, true, 100),
('MOCACCINO', 'Doble espresso con leche texturizada y chocolate', 21.00, 1, true, 100),
('LATTE', 'Doble espresso con leche texturizada', 22.00, 1, true, 100),
('MOCHA LATTE', 'Doble espresso con leche texturizada y chocolate', 23.00, 1, true, 100);

-- Insertar productos para CAFETERÍA FRÍA
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) VALUES
('FRAPPUCCINO', 'Bebida fría y cremosa a base de café, hielo triturado y leche', 20.00, 2, true, 100),
('ICED AMERICANO', 'Hielo, agua y espresso doble', 15.00, 2, true, 100),
('ICED LATTE', 'Hielo, leche y espresso doble', 22.00, 2, true, 100),
('ICED MOCHA LATTE', 'Hielo, salsa de chocolate, leche y espresso doble', 23.00, 2, true, 100),
('ICED SULTANA ESPRESSO', 'Almíbar de sultana, hielo, agua tónica y espresso doble', 18.00, 2, true, 100),
('AFFOGATO DE LA CASA', 'Helado de vainilla, trazos de cookie y espresso doble', 22.00, 2, true, 100),
('CITRUS ESPRESSO', 'Almíbar de limón, hielo, agua tónica y espresso doble', 18.00, 2, true, 100),
('AEROCANO', 'Hielo, agua, espresso doble texturizada', 18.00, 2, true, 100),
('PASSION ESPRESSO', 'Almíbar de maracuyá, hielo, agua tónica y espresso doble', 18.00, 2, true, 100),
('ESPRESSO TONIC', 'Hielo, agua tónica y espresso doble', 18.00, 2, true, 100),
('ORANGE COFFEE', 'Zumo de naranja, hielo, agua tónica, expresso doble', 20.00, 2, true, 100);

-- Insertar productos para INFUSIONES CALIENTES
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) VALUES
('TÉ CON LECHE', 'Té negro aromático y leche cremosa', 13.00, 3, true, 100),
('TÉ', 'Té negro aromático', 10.00, 3, true, 100),
('SULTANA', 'Infusión delicada y natural hecha a base de cascara de café', 10.00, 3, true, 100),
('COCA', 'Infusión delicada y natural a base de hojas de coca', 10.00, 3, true, 100),
('MANZANILLA', 'Infusión delicada y natural hecha a base de manzanillas', 10.00, 3, true, 100),
('ANIS', 'Infusión delicada y natural a base de semillas de anis', 10.00, 3, true, 100);

-- Insertar productos para CHOCOLATES
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) VALUES
('CHOCOLATE DE LA CASA', 'Concentrado de chocolate, leche texturizada y malvaviscos asados', 20.00, 4, true, 100),
('CHOCOLATE CACAO', 'Mix de chocolates y mezcla de especies secreta (con leche o agua)', 22.00, 4, true, 100),
('SUBMARINO', 'Leche caliente, barra de chocolate y crema batida', 20.00, 4, true, 100);

-- Insertar productos para BEBIDAS FRÍAS
INSERT INTO products (name, description, price, category_id, is_available, stock_quantity) VALUES
('ICED TEA', 'Té helado refrescante', 10.00, 5, true, 100),
('ICED SULTANA', 'Infusión de sultana helada', 10.00, 5, true, 100),
('JAMAICA', 'Agua de jamaica natural', 12.00, 5, true, 100),
('LICUADO CON AGUA', 'Piña con papaya, Frutos del bosque, Copoazú con durazno, Limonada de frutilla, Piña hierba buena, Frutilla hierba buena, Mango maracuyá', 16.00, 5, true, 100),
('LICUADO CON LECHE', 'Frutilla, Durazno, Mora, Papaya, Plátano', 16.00, 5, true, 100),
('FRAPUCCINO SABORIZADO', 'Brownie, Cookie, Dulce de leche, Frutilla, Chocolate, Oreo, Cookie red velvet, Chocomenta', 20.00, 5, true, 100),
('FRUTOS DEL BOSQUE', 'Yogurt, frutilla, mora, arándano', 18.00, 5, true, 100),
('CITRUS', 'Yogurt, maracuyá, copoazú, limón', 18.00, 5, true, 100),
('SODA DE SULTANA', 'Concentrado de sultana, hielo, agua mineral', 18.00, 5, true, 100),
('SODA DE JAMAICA', 'Concentrado de jamaica, hielo, agua mineral', 18.00, 5, true, 100);
