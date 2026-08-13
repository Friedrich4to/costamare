PRAGMA defer_foreign_keys=TRUE;
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
INSERT INTO "unit_types" ("id","type_key","name","price_usd","interior_m2","terraza_m2","total_m2","spaces","features","tour_url","optional_package_label","optional_package_price","gallery") VALUES(1,'1er-piso','1er Piso',88325,55,NULL,55,'[{"name":"Sala-Comedor-Cocina","m2":21.08},{"name":"Dormitorio","m2":14.51},{"name":"Walk in Closet","m2":3.86},{"name":"Baño","m2":3.5},{"name":"Visitas-Lavado","m2":4.8}]','[]','/tour/1er-piso',NULL,NULL,'["/assets/units/p1.avif"]');
INSERT INTO "unit_types" ("id","type_key","name","price_usd","interior_m2","terraza_m2","total_m2","spaces","features","tour_url","optional_package_label","optional_package_price","gallery") VALUES(2,'2do-piso','2do Piso',93900,60,NULL,63.47,'[{"name":"Sala-Comedor-Cocina","m2":21.08},{"name":"Dormitorio","m2":15.97},{"name":"Walk in Closet","m2":3.86},{"name":"Baño","m2":3.5},{"name":"Visitas-Lavado","m2":4.8},{"name":"Balcón","m2":3.47}]','["Balcón"]','/tour/2do-piso',NULL,NULL,'["/assets/units/p2.avif"]');
INSERT INTO "unit_types" ("id","type_key","name","price_usd","interior_m2","terraza_m2","total_m2","spaces","features","tour_url","optional_package_label","optional_package_price","gallery") VALUES(3,'penthouse','Penthouse',112000,60,60,120,'[{"name":"Sala-Comedor-Cocina","m2":21.08},{"name":"Dormitorio","m2":15.97},{"name":"Walk in Closet","m2":3.86},{"name":"Baño","m2":3.5},{"name":"Escalera","m2":4.8},{"name":"Balcón","m2":3.47},{"name":"Terraza privada","m2":60}]','["Balcón","Terraza privada"]','/tour/penthouse','Pisos, Baño equipado, Jacuzzi, Pergolado',16900,'["/assets/units/ph-1.avif","/assets/units/ph-2.avif"]');
CREATE TABLE units (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_id      TEXT    NOT NULL UNIQUE,  -- 'S101', 'S203', etc.
  label        TEXT    NOT NULL,         -- 'Apartamento S101'
  status       TEXT    NOT NULL DEFAULT 'available'
                       CHECK(status IN ('available', 'reserved', 'sold')),
  floor        INTEGER NOT NULL,
  unit_type_id INTEGER NOT NULL REFERENCES unit_types(id)
);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(1,'S101','Apartamento S101','available',1,1);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(2,'S102','Apartamento S102','sold',1,1);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(3,'S103','Apartamento S103','sold',1,1);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(4,'S104','Apartamento S104','sold',1,1);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(5,'S201','Apartamento S201','sold',2,2);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(6,'S202','Apartamento S202','reserved',2,2);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(7,'S203','Apartamento S203','reserved',2,2);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(8,'S204','Apartamento S204','reserved',2,2);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(9,'S301','Apartamento S301','sold',3,3);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(10,'S302','Apartamento S302','reserved',3,3);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(11,'S303','Apartamento S303','sold',3,3);
INSERT INTO "units" ("id","unit_id","label","status","floor","unit_type_id") VALUES(12,'S304','Apartamento S304','reserved',3,3);
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('unit_types',3);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('units',12);
CREATE INDEX idx_units_status       ON units(status);
CREATE INDEX idx_units_floor        ON units(floor);
CREATE INDEX idx_units_unit_type_id ON units(unit_type_id);
