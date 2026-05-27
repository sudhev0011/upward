import { LocationSuggestion, Location } from "../../location.interface";


export interface DistanceResult {
  distanceMeters: number;

  durationSeconds: number;
}

export interface MapsService {
  searchLocations(
    query: string,
  ): Promise<LocationSuggestion[]>;

  getPlaceDetails(
    placeId: string,
  ): Promise<Location | void>;

  getTravelDistanceAndDuration(
    origin: [number, number],
    destination: [number, number],
  ): Promise<DistanceResult>;
}