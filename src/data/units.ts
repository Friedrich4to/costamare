export type UnitDisponibilidad = 'available' | 'reserved' | 'sold';

export interface Unit {
  id: number;
  numero: string;
  m2: number;
  patio_m2: number | null;
  terraza_m2: number | null;
  m2_total: number;
  disponibilidad: UnitDisponibilidad;
  tour_url: string | null;
  gallery: string[];
  precio: number;
}
