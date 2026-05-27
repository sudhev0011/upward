import axios from "axios";
import { env } from "../../config/env";
import {
  Location,
  LocationSuggestion,
} from "../../../domain/interfaces/location.interface";

import {
  DistanceResult,
  MapsService,
} from "../../../domain/interfaces/services/maps/maps.service";

export class GeoapifyMapsService
  implements MapsService
{
  private readonly apiKey = env.GEOPIFY_API_KEY

  async searchLocations(
    query: string,
  ): Promise<LocationSuggestion[]> {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/autocomplete",
      {
        params: {
          text: query,

          apiKey: this.apiKey,
        },
      },
    );

    return response.data.features.map(
      (feature: any) => ({
        placeId:
          feature.properties.place_id,

        description:
          feature.properties.formatted,
      }),
    );
  }

  async getPlaceDetails(
    placeId: string,
  ): Promise<Location> {
    const response = await axios.get(
      "https://api.geoapify.com/v2/place-details",
      {
        params: {
          id: placeId,

          apiKey: this.apiKey,
        },
      },
    );
    const feature =
      response.data.features[0];

    if (!feature) {
      throw new Error(
        "Location not found",
      );
    }

    const properties =
      feature.properties;

    const coordinates: [
      number,
      number,
    ] = [
      feature.geometry.coordinates[0], // lng
      feature.geometry.coordinates[1], // lat
    ];

    return {
      placeId:
        properties.place_id,

      address:
        properties.formatted,

      city:
        properties.city ?? null,

      state:
        properties.state ?? null,

      country:
        properties.country ?? null,

      coordinates: {
        type: "Point",

        coordinates,
      },
    };
  }

  async getTravelDistanceAndDuration(
    origin: [number, number],
    destination: [number, number],
  ): Promise<DistanceResult> {
    const response = await axios.post(
      `https://api.geoapify.com/v1/routematrix?apiKey=${this.apiKey}`,
      {
        mode: "drive",

        sources: [
          {
            location: origin,
          },
        ],

        targets: [
          {
            location: destination,
          },
        ],
      },
    );

    const result =
      response.data.sources_to_targets[0][0];

    return {
      distanceMeters:
        result.distance,

      durationSeconds:
        result.time,
    };
  }
}