/** Named space within an apartment unit */
export interface UnitSpace {
  name: string;
  m2: number;
}

/** Apartment floor type */
export type UnitTypeKey = '1er-piso' | '2do-piso' | 'penthouse';

/** Availability status of an individual unit */
export type UnitStatus = 'available' | 'reserved' | 'sold';

/** A single apartment unit with all its attributes */
export interface UnitType {
  /** Unit code, e.g. 'S101' */
  id: string;
  type: UnitTypeKey;
  /** Physical floor number: 1, 2, or 3 */
  floor: number;
  /** Human-readable name, e.g. 'Apartamento S101' */
  label: string;
  priceUSD: number;
  /** Enclosed interior area in m² */
  interiorM2: number;
  /** Total area including terraza/balcón in m² */
  totalM2: number;
  /** Named room/space breakdown */
  spaces: UnitSpace[];
  /** Notable amenities such as 'Balcón', 'Terraza privada' */
  features: string[];
  status: UnitStatus;
  optionalPackage?: { label: string; priceUSD: number };
  /** Internal URL to the 360 tour page for this unit type */
  tourUrl: string;
  /** Gallery images from /public/assets/units/ */
  gallery: string[];
}

type UnitTemplate = Omit<UnitType, 'id' | 'floor' | 'label' | 'status'>;

/** Base data templates for each of the 3 apartment types */
export const UNIT_TYPES: Record<UnitTypeKey, UnitTemplate> = {
  '1er-piso': {
    type: '1er-piso',
    priceUSD: 86325,
    interiorM2: 55,
    totalM2: 55,
    spaces: [
      { name: 'Sala-Comedor-Cocina', m2: 21.08 },
      { name: 'Dormitorio',          m2: 14.51 },
      { name: 'Walk in Closet',      m2:  3.86 },
      { name: 'Baño',                m2:  3.50 },
      { name: 'Visitas-Lavado',      m2:  4.80 },
    ],
    features: [],
    tourUrl: '/tour/1er-piso',
    gallery: ['/assets/units/p1.avif'],
  },

  '2do-piso': {
    type: '2do-piso',
    priceUSD: 93900,
    interiorM2: 60,
    totalM2: 63.47,
    spaces: [
      { name: 'Sala-Comedor-Cocina', m2: 21.08 },
      { name: 'Dormitorio',          m2: 15.97 },
      { name: 'Walk in Closet',      m2:  3.86 },
      { name: 'Baño',                m2:  3.50 },
      { name: 'Visitas-Lavado',      m2:  4.80 },
      { name: 'Balcón',              m2:  3.47 },
    ],
    features: ['Balcón'],
    tourUrl: '/tour/2do-piso',
    gallery: ['/assets/units/p2.avif'],
  },

  penthouse: {
    type: 'penthouse',
    priceUSD: 112000,
    interiorM2: 60,
    totalM2: 120,
    spaces: [
      { name: 'Sala-Comedor-Cocina', m2: 21.08 },
      { name: 'Dormitorio',          m2: 15.97 },
      { name: 'Walk in Closet',      m2:  3.86 },
      { name: 'Baño',                m2:  3.50 },
      { name: 'Escalera',            m2:  4.80 },
      { name: 'Balcón',              m2:  3.47 },
      { name: 'Terraza privada',     m2: 60.00 },
    ],
    features: ['Balcón', 'Terraza privada'],
    tourUrl: '/tour/penthouse',
    gallery: ['/assets/units/ph-1.avif', '/assets/units/ph-2.avif'],
    optionalPackage: {
      label: 'Pisos, Baño equipado, Jacuzzi, Pergolado',
      priceUSD: 16900,
    },
  },
};

/** All 12 apartment units across the 3-floor building */
export const units: UnitType[] = [
  // — Piso 1 —
  { ...UNIT_TYPES['1er-piso'], id: 'S101', floor: 1, label: 'Apartamento S101', status: 'available' },
  { ...UNIT_TYPES['1er-piso'], id: 'S102', floor: 1, label: 'Apartamento S102', status: 'available' },
  { ...UNIT_TYPES['1er-piso'], id: 'S103', floor: 1, label: 'Apartamento S103', status: 'available' },
  { ...UNIT_TYPES['1er-piso'], id: 'S104', floor: 1, label: 'Apartamento S104', status: 'available' },

  // — Piso 2 —
  { ...UNIT_TYPES['2do-piso'], id: 'S201', floor: 2, label: 'Apartamento S201', status: 'available' },
  { ...UNIT_TYPES['2do-piso'], id: 'S202', floor: 2, label: 'Apartamento S202', status: 'available' },
  { ...UNIT_TYPES['2do-piso'], id: 'S203', floor: 2, label: 'Apartamento S203', status: 'reserved' },
  { ...UNIT_TYPES['2do-piso'], id: 'S204', floor: 2, label: 'Apartamento S204', status: 'available' },

  // — Penthouse —
  { ...UNIT_TYPES['penthouse'], id: 'S301', floor: 3, label: 'Apartamento S301', status: 'available' },
  { ...UNIT_TYPES['penthouse'], id: 'S302', floor: 3, label: 'Apartamento S302', status: 'available' },
  { ...UNIT_TYPES['penthouse'], id: 'S303', floor: 3, label: 'Apartamento S303', status: 'reserved' },
  { ...UNIT_TYPES['penthouse'], id: 'S304', floor: 3, label: 'Apartamento S304', status: 'available' },
];

/** Returns every unit whose status is 'available' */
export function getAvailableUnits(): UnitType[] {
  return units.filter((u) => u.status === 'available');
}

/** Returns all units belonging to a given floor type */
export function getUnitsByType(type: UnitTypeKey): UnitType[] {
  return units.filter((u) => u.type === type);
}

/** Looks up a unit by its code (e.g. 'S203'). Returns undefined if not found */
export function getUnitById(id: string): UnitType | undefined {
  return units.find((u) => u.id === id);
}
