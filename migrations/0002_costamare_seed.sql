-- Costamare: schema completo + seed data
-- Aplica en local despues de limpiar el estado HRIV
-- No ejecutar en remoto (ya tiene tablas y data correcta)

DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS unit_types;

CREATE TABLE unit_types (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  type_key               TEXT NOT NULL UNIQUE,
  name                   TEXT NOT NULL,
  price_usd              REAL,
  interior_m2            REAL,
  terraza_m2             REAL,
  patio_m2               REAL,
  total_m2               REAL,
  spaces                 TEXT,
  features               TEXT,
  tour_url               TEXT,
  optional_package_label TEXT,
  optional_package_price REAL,
  gallery                TEXT,
  created_at             TEXT DEFAULT (datetime('now'))
);

CREATE TABLE units (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_id      TEXT NOT NULL UNIQUE,
  label        TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'available'
                 CHECK(status IN ('available','reserved','sold','hidden')),
  floor        INTEGER NOT NULL DEFAULT 1,
  unit_type_id INTEGER REFERENCES unit_types(id),
  price_usd    REAL,
  interior_m2  REAL,
  terraza_m2   REAL,
  patio_m2     REAL,
  total_m2     REAL,
  created_at   TEXT DEFAULT (datetime('now'))
);

-- Tipos de unidad (placeholder Costamare)
INSERT INTO unit_types (type_key, name, price_usd, interior_m2, patio_m2, spaces, features, tour_url, gallery)
VALUES
  ('p1', 'Primer Piso',   125000, 77.05, 41.71, '[]', '[]', '', '[]'),
  ('p2', 'Segundo Piso',  129800, 83.62, NULL,  '[]', '[]', '', '[]'),
  ('ph', 'Penthouse',     140000, 83.62, NULL,  '[]', '[]', '', '[]');

-- Unidades (placeholder — 12 unidades, todas available)
INSERT INTO units (unit_id, label, status, floor, unit_type_id) VALUES
  ('101', 'Apartamento 101', 'available', 1, 1),
  ('102', 'Apartamento 102', 'available', 1, 1),
  ('103', 'Apartamento 103', 'available', 1, 1),
  ('104', 'Apartamento 104', 'available', 1, 1),
  ('201', 'Apartamento 201', 'available', 2, 2),
  ('202', 'Apartamento 202', 'available', 2, 2),
  ('203', 'Apartamento 203', 'available', 2, 2),
  ('204', 'Apartamento 204', 'available', 2, 2),
  ('301', 'Apartamento 301', 'available', 3, 3),
  ('302', 'Apartamento 302', 'available', 3, 3),
  ('303', 'Apartamento 303', 'available', 3, 3),
  ('304', 'Apartamento 304', 'available', 3, 3);
