-- Script para traducir los items de BRUNCH ALL DAY a español

-- WAFFLES
UPDATE products 
SET description = 'Waffle, huevo frito, tocino, cebollín y jarabe'
WHERE name = 'AMERICANO' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');

UPDATE products 
SET description = 'Waffle, quenelle de hierbas, palta, huevo frito y brotes'
WHERE name = 'PALTOS' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');

UPDATE products 
SET description = 'Waffle, helado de vainilla, fruta de temporada, crema batida y azúcar de hierba buena'
WHERE name = 'WAFFLE DULCE' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');

-- SOBRE PAN
UPDATE products 
SET description = 'Pan de campo, huevo revuelto, tocino crujiente, cebollín y jarabe'
WHERE name = 'AMERICANO SOBRE PAN' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');

UPDATE products 
SET description = 'Pan de campo, base especial de queso y palta, huevo frito, tomate confitado y brotes'
WHERE name = 'AVOCADO SOBRE PAN' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');

UPDATE products 
SET description = 'Pan de campo, mix de hojas verdes, charque, tomate confitado, cebolla encurtida, locoto en escabeche, brotes y aceite de quirquiña'
WHERE name = 'CRIOLLO SOBRE PAN' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');

-- ENTRE PAN
UPDATE products 
SET description = 'Pan de campo, mix de hojas verdes, lomo salteado, pepinillos, tomate confitado, mayonesa de la casa y brotes'
WHERE name = 'STEAK' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');

UPDATE products 
SET description = 'Pan de campo, base de queso especial, rúcula, rodajas de tomate fresco, pernil de cerdo y pepinillos encurtidos'
WHERE name = 'PERNIL' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');

UPDATE products 
SET description = 'Pan de campo, mix de hojas verdes, rodajas de tomate fresco, pollo marinado en miel y mostaza, queso cheddar derretido y cebolla encurtida'
WHERE name = 'HONEY MUSTARD CHICKEN' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');

UPDATE products 
SET description = 'Pan de campo, queso mozzarella, carne marinada salteada con champiñones a la crema, tocino crujiente, cebolla caramelizada y queso mozzarella'
WHERE name = 'EL PHILI' AND category_id = (SELECT id FROM categories WHERE name = 'BRUNCH ALL DAY');
