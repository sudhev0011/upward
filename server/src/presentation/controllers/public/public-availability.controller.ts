// presentation/controllers/public/public-availability.controller.ts
import { Request, Response, NextFunction } from "express";
import { IGetAvailabilityUseCase } from "../../../domain/interfaces/usecases/avaliability/IGetAvaliabilityUseCase";
import { IGetAvailabilityOverridesUseCase } from "../../../domain/interfaces/usecases/avaliability-override/IGetAvaliabilityOverrideUseCase";
import { IGetUnavailabilitiesUseCase } from "../../../domain/interfaces/usecases/unavaliability/IGetUnavaliability.use-case";
import { successResponse } from "../../../shared/constants";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
} from "../../../shared/utils/presentation/controller.utils";

export class PublicAvailabilityController {
  constructor(
    private readonly _getAvailabilityUseCase: IGetAvailabilityUseCase,
    private readonly _getAvailabilityOverridesUseCase: IGetAvailabilityOverridesUseCase,
    private readonly _getUnavailabilitiesUseCase: IGetUnavailabilitiesUseCase,
  ) {}

  /**
   * this method is to get all the availability of a provider to showcase in the provider profile for clients
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  getAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const { providerId } = req.params;

    if (Array.isArray(providerId)) {
      return handleValidationError("invalid id passed", next);
    }
    try {
      const result = await this._getAvailabilityUseCase.execute(providerId);
      sendSuccessResponse(
        res,
        successResponse.GET_AVAILABILITY_SUCCESS,
        result,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  /**
   * this mehods is to get all the availability overrides of the provider
   * @param req 
   * @param res request includes the provider id from params
   * @param next all the avalilabilityOverrides are returned 
   * @returns 
   */
  getAvailabilityOverrides = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { providerId } = req.params;

    if (Array.isArray(providerId)) {
      return handleValidationError("invalid id passed", next);
    }
    try {
      // Pass undefined for date range — return all overrides for public view
      const result = await this._getAvailabilityOverridesUseCase.execute(
        providerId,
        undefined,
        undefined,
      );
      sendSuccessResponse(
        res,
        successResponse.GET_AVAILABILITY_OVERRIDES_SUCCESS,
        result,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  /**
   * this method is to give all the unavailabilities of the provider for client
   * @param req request includes the provider id from params
   * @param res response is all the unavailabilities of the provider
   * @param next 
   * @returns 
   */
  getUnavailabilities = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { providerId } = req.params;

    if (Array.isArray(providerId)) {
      return handleValidationError("invalid id passed", next);
    }
    try {
      const result = await this._getUnavailabilitiesUseCase.execute(providerId);
      sendSuccessResponse(
        res,
        successResponse.GET_UNAVAILABILITIES_SUCCESS,
        result,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
