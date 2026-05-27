export interface SocialLink {
  name: string;
  link: string;
}

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface Location {
  placeId: string;

  address: string;

  city?: string | null;

  state?: string | null;

  country?: string | null;

  coordinates: GeoPoint;
}