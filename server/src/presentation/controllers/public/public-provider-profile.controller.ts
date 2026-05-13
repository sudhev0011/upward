import { NextFunction, Request, Response } from "express";
import { IGetProviderProfileUseCase } from "../../../domain/interfaces/usecases/provider/profile/IGetProviderProfileUseCase";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
} from "../../../shared/utils/presentation/controller.utils";
import { successResponse } from "../../../shared/constants";

export class PublicProviderProfileController {
  constructor(
    public readonly _getProviderProfileUseCase: IGetProviderProfileUseCase,
  ) {}
  /**
   * this is a major method which gives the profile details of the provider for client side
   * @param req the request includes the id of the provider to fetch all the fields
   * @param res the response is the full fields data of the provider
   * @param next 
   * @returns 
   */
  public getProviderProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { providerId } = req.params;

    if (Array.isArray(providerId)) {
      return handleValidationError("invalid id", next);
    }
    try {
      const profile = await this._getProviderProfileUseCase.execute(providerId);
      sendSuccessResponse(res, successResponse.GET_PROVIDER_PROFILE, profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
