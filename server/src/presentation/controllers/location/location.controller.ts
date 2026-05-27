import { Request, Response } from "express";
import { GeoapifyMapsService } from "../../../infrastructure/external-services/maps/geopify-maps.service";

const mapsService = new GeoapifyMapsService();

export class LocationController {
  static async search(req: Request, res: Response) {
    try {
      const query = req.query.query as string;

      const result = await mapsService.searchLocations(query);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }

  static async details(req: Request, res: Response) {
    try {
      const placeId = req.query.placeId as string;

      const result = await mapsService.getPlaceDetails(placeId);

      res.json(result);
    } catch (error) {
        console.log(error)
    }
  }
}
