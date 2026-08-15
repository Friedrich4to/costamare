DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS unit_types;

CREATE TABLE units (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  numero         TEXT UNIQUE NOT NULL,
  m2             REAL NOT NULL DEFAULT 0,
  patio_m2       REAL,
  terraza_m2     REAL,
  m2_total       REAL NOT NULL DEFAULT 0,
  disponibilidad TEXT NOT NULL DEFAULT 'available'
                   CHECK(disponibilidad IN ('available','reserved','sold')),
  tour_url       TEXT,
  gallery        TEXT NOT NULL DEFAULT '[]',
  precio         REAL NOT NULL DEFAULT 0
);

INSERT INTO units (numero, disponibilidad) VALUES
  ('101', 'available'),
  ('102', 'available'),
  ('103', 'available'),
  ('104', 'available'),
  ('201', 'available'),
  ('202', 'available'),
  ('203', 'available'),
  ('204', 'available'),
  ('301', 'available'),
  ('302', 'available'),
  ('303', 'available'),
  ('304', 'available');
