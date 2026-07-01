import { NextFunction, Request, Response } from "express";
import { GeoapifyMapsService } from "../../../infrastructure/external-services/maps/geopify-maps.service";
import { handleAsyncError } from "../../../shared/utils/presentation/controller.utils";

const mapsService = new GeoapifyMapsService();

export class LocationController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.query as string;

      const result = await mapsService.searchLocations(query);
      console.log(result)
      res.json(result);
    } catch (error) {
      console.log(error);
      handleAsyncError(error, next)
    }
  }

  static async details(req: Request, res: Response, next: NextFunction) {
    try {
      const placeId = req.query.placeId as string;

      const result = await mapsService.getPlaceDetails(placeId);
      console.log('place details', result)
      res.json(result);
    } catch (error) {
        console.log(error)
        handleAsyncError(error, next);
    }
  }
}
