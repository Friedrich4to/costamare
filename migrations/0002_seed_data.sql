INSERT INTO unit_types (type_key, name, price_usd, interior_m2, terraza_m2, total_m2, spaces, features, tour_url, optional_package_label, optional_package_price, gallery) VALUES
(
  '1er-piso', '1er Piso', 86325, 55, NULL, 55,
  '[{"name":"Sala-Comedor-Cocina","m2":21.08},{"name":"Dormitorio","m2":14.51},{"name":"Walk in Closet","m2":3.86},{"name":"Baño","m2":3.5},{"name":"Visitas-Lavado","m2":4.8}]',
  '[]',
  '/tour/1er-piso', NULL, NULL,
  '["/assets/units/p1.avif"]'
),
(
  '2do-piso', '2do Piso', 93900, 60, 3.47, 63.47,
  '[{"name":"Sala-Comedor-Cocina","m2":21.08},{"name":"Dormitorio","m2":15.97},{"name":"Walk in Closet","m2":3.86},{"name":"Baño","m2":3.5},{"name":"Visitas-Lavado","m2":4.8},{"name":"Balcón","m2":3.47}]',
  '["Balcón"]',
  '/tour/2do-piso', NULL, NULL,
  '["/assets/units/p2.avif"]'
),
(
  'penthouse', 'Penthouse', 112000, 60, 60, 120,
  '[{"name":"Sala-Comedor-Cocina","m2":21.08},{"name":"Dormitorio","m2":15.97},{"name":"Walk in Closet","m2":3.86},{"name":"Baño","m2":3.5},{"name":"Escalera","m2":4.8},{"name":"Balcón","m2":3.47},{"name":"Terraza privada","m2":60}]',
  '["Balcón","Terraza privada"]',
  '/tour/penthouse',
  'Pisos, Baño equipado, Jacuzzi, Pergolado', 16900,
  '["/assets/units/ph-1.avif","/assets/units/ph-2.avif"]'
);

INSERT INTO units (unit_id, label, status, floor, unit_type_id) VALUES
('S101', 'Apartamento S101', 'available', 1, 1),
('S102', 'Apartamento S102', 'available', 1, 1),
('S103', 'Apartamento S103', 'available', 1, 1),
('S104', 'Apartamento S104', 'available', 1, 1),
('S201', 'Apartamento S201', 'available', 2, 2),
('S202', 'Apartamento S202', 'available', 2, 2),
('S203', 'Apartamento S203', 'reserved', 2, 2),
('S204', 'Apartamento S204', 'available', 2, 2),
('S301', 'Apartamento S301', 'available', 3, 3),
('S302', 'Apartamento S302', 'available', 3, 3),
('S303', 'Apartamento S303', 'reserved', 3, 3),
('S304', 'Apartamento S304', 'available', 3, 3);
