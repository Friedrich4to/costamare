-- Seed real unit data from Costamare price list
-- m2_total = m2 + patio_m2 (piso 1) or m2 + terraza_m2 (piso 3), same as m2 for piso 2

-- Piso 1 (patio)
UPDATE units SET m2 = 77.05, patio_m2 = 41.71, terraza_m2 = NULL, m2_total = 118.76, precio = 128000 WHERE numero = '101';
UPDATE units SET m2 = 79.60, patio_m2 = 18.40, terraza_m2 = NULL, m2_total =  98.00, precio = 125000 WHERE numero = '102';
UPDATE units SET m2 = 79.60, patio_m2 = 18.40, terraza_m2 = NULL, m2_total =  98.00, precio = 125000 WHERE numero = '103';
UPDATE units SET m2 = 77.05, patio_m2 = 17.35, terraza_m2 = NULL, m2_total =  94.40, precio = 125000 WHERE numero = '104';

-- Piso 2 (sin patio ni terraza)
UPDATE units SET m2 = 83.62, patio_m2 = NULL, terraza_m2 = NULL, m2_total = 83.62, precio = 129800 WHERE numero = '201';
UPDATE units SET m2 = 84.21, patio_m2 = NULL, terraza_m2 = NULL, m2_total = 84.21, precio = 129800 WHERE numero = '202';
UPDATE units SET m2 = 84.21, patio_m2 = NULL, terraza_m2 = NULL, m2_total = 84.21, precio = 129800 WHERE numero = '203';
UPDATE units SET m2 = 83.62, patio_m2 = NULL, terraza_m2 = NULL, m2_total = 83.62, precio = 129800 WHERE numero = '204';

-- Piso 3 (terraza)
UPDATE units SET m2 = 83.62, patio_m2 = NULL, terraza_m2 = 79.73, m2_total = 163.35, precio = 140000 WHERE numero = '301';
UPDATE units SET m2 = 84.21, patio_m2 = NULL, terraza_m2 = 78.71, m2_total = 162.92, precio = 140000 WHERE numero = '302';
UPDATE units SET m2 = 84.21, patio_m2 = NULL, terraza_m2 = 78.70, m2_total = 162.91, precio = 140000 WHERE numero = '303';
UPDATE units SET m2 = 83.62, patio_m2 = NULL, terraza_m2 = 79.75, m2_total = 163.37, precio = 140000 WHERE numero = '304';
