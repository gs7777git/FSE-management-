
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Visit {
  id: string;
  clientName: string;
  purpose: string;
  startTime: string; // ISO string
  endTime: string | null; // ISO string
  startLocation: GeoLocation | null;
  endLocation: GeoLocation | null;
  notes?: string;
}
