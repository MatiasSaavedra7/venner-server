-- 1. Insertar Categorías
INSERT INTO categories (name, description) VALUES
('Vinos', 'Vinos tintos, blancos, rosados y espumantes de diversas regiones.'),
('Accesorios', 'Copas, destapadores, decantadores y kits de sommelier.'),
('Alimentos', 'Quesos, embutidos, chocolates y productos gourmet.'),
('Experiencias', 'Catas guiadas, cursos de sommelier y eventos especiales.');

-- 2. Insertar Productos y Vinos (Usando IDs fijos o subconsultas para seguridad)

-- PRODUCTO 1: Vino Malbec
WITH p AS (INSERT INTO products (category_id, name, description, price, stock, is_wine) 
VALUES (1, 'Malbec Reserva Especial', 'Vino con 12 meses de barrica, notas de frutos rojos.', 4500.00, 50, true) RETURNING id)
INSERT INTO wines (product_id, varietal, winery, country, province, location) 
SELECT id, 'Malbec', 'Bodega Los Andes', 'Argentina', 'Mendoza', 'Luján de Cuyo' FROM p;

-- PRODUCTO 2: Vino Cabernet Sauvignon
WITH p AS (INSERT INTO products (category_id, name, description, price, stock, is_wine) 
VALUES (1, 'Cabernet Sauvignon Gran Siglo', 'Intenso, ideal para acompañar carnes rojas.', 5200.00, 30, true) RETURNING id)
INSERT INTO wines (product_id, varietal, winery, country, province, location) 
SELECT id, 'Cabernet Sauvignon', 'Valle Norte', 'Argentina', 'Salta', 'Cafayate' FROM p;

-- PRODUCTO 3: Vino Chardonnay
WITH p AS (INSERT INTO products (category_id, name, description, price, stock, is_wine) 
VALUES (1, 'Chardonnay White Gold', 'Fresco, con notas cítricas y vainilla.', 3800.00, 40, true) RETURNING id)
INSERT INTO wines (product_id, varietal, winery, country, province, location) 
SELECT id, 'Chardonnay', 'Altos del Valle', 'Argentina', 'Neuquén', 'San Patricio del Chañar' FROM p;

-- PRODUCTO 4: Vino Blend
WITH p AS (INSERT INTO products (category_id, name, description, price, stock, is_wine) 
VALUES (1, 'Corte de Autor 2021', 'Blend secreto de la casa, edición limitada.', 7500.00, 12, true) RETURNING id)
INSERT INTO wines (product_id, varietal, winery, country, province, location) 
SELECT id, 'Blend', 'Bodega Secreta', 'Argentina', 'Mendoza', 'Valle de Uco' FROM p;

-- PRODUCTO 5: Vino Torrontés
WITH p AS (INSERT INTO products (category_id, name, description, price, stock, is_wine) 
VALUES (1, 'Torrontés del Cielo', 'Aromático y elegante, típico de altura.', 3100.00, 60, true) RETURNING id)
INSERT INTO wines (product_id, varietal, winery, country, province, location) 
SELECT id, 'Torrontés', 'Nubes Salteñas', 'Argentina', 'Salta', 'Cachi' FROM p;

-- PRODUCTO 6: Accesorio - Copas
INSERT INTO products (category_id, name, description, price, stock, is_wine)
VALUES (2, 'Set de Copas Crystal (x6)', 'Cristal de alta calidad para degustación de tintos.', 12000.00, 15, false);

-- PRODUCTO 7: Accesorio - Sacacorchos
INSERT INTO products (category_id, name, description, price, stock, is_wine)
VALUES (2, 'Sacacorchos Eléctrico Pro', 'Recargable por USB, diseño elegante en color negro.', 8500.00, 20, false);

-- PRODUCTO 8: Alimento - Queso
INSERT INTO products (category_id, name, description, price, stock, is_wine)
VALUES (3, 'Queso Parmesano Estacionado', 'Pieza de 500g, estacionado por 12 meses.', 2900.00, 25, false);

-- PRODUCTO 9: Alimento - Jamón Crudo
INSERT INTO products (category_id, name, description, price, stock, is_wine)
VALUES (3, 'Jamón Crudo Tipo Serrano', 'Feteado al vacío, 200g de máxima calidad.', 2100.00, 40, false);

-- PRODUCTO 10: Experiencia - Cata
INSERT INTO products (category_id, name, description, price, stock, is_wine)
VALUES (4, 'Cata de Varietales No Convencionales', 'Degustación de 5 vinos raros para 2 personas.', 15000.00, 10, false);

-- 3. Insertar algunas imágenes de prueba para los productos creados
INSERT INTO images_product (product_id, url, alt_text) VALUES
(1, 'https://picsum.photos/seed/wine1/400/600', 'Botella de Malbec'),
(6, 'https://picsum.photos/seed/glass/400/600', 'Set de Copas'),
(10, 'https://picsum.photos/seed/event/400/600', 'Evento de Cata');