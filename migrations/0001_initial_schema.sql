-- Unit type specifications (1er Piso, 2do Piso, Penthouse)
CREATE TABLE unit_types (
  id                        INTEGER PRIMARY KEY AUTOINCREMENT,
  type_key                  TEXT    NOT NULL UNIQUE,  -- '1er-piso' | '2do-piso' | 'penthouse'
  name                      TEXT    NOT NULL,          -- 'Penthouse'
  price_usd                 REAL    NOT NULL,
  interior_m2               REAL    NOT NULL,
  terraza_m2                REAL,
  total_m2                  REAL    NOT NULL,
  spaces                    TEXT    NOT NULL DEFAULT '[]',  -- JSON: [{name, m2}]
  features                  TEXT    NOT NULL DEFAULT '[]',  -- JSON: [string]
  tour_url                  TEXT,
  optional_package_label    TEXT,
  optional_package_price    REAL,
  gallery                   TEXT    NOT NULL DEFAULT '[]'   -- JSON: [url]
);

-- Individual apartment units
CREATE TABLE units (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_id      TEXT    NOT NULL UNIQUE,  -- 'S101', 'S203', etc.
  label        TEXT    NOT NULL,         -- 'Apartamento S101'
  status       TEXT    NOT NULL DEFAULT 'available'
                       CHECK(status IN ('available', 'reserved', 'sold')),
  floor        INTEGER NOT NULL,
  unit_type_id INTEGER NOT NULL REFERENCES unit_types(id)
);

CREATE INDEX idx_units_status       ON units(status);
CREATE INDEX idx_units_floor        ON units(floor);
CREATE INDEX idx_units_unit_type_id ON units(unit_type_id);
