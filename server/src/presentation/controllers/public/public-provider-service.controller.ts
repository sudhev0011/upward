import { Request, Response, NextFunction } from 'express';
import { IGetActiveProviderServicesUseCase } from '../../../domain/interfaces/usecases/provider/providerService/IGetActiveProviderServicesUseCase';
import { handleAsyncError, handleValidationError, sendSuccessResponse } from '../../../shared/utils/presentation/controller.utils';
import { successResponse } from '../../../shared/constants';

export class PublicProviderServiceController {
  constructor(
    private readonly _getActiveProviderServicesUseCase: IGetActiveProviderServicesUseCase,
  ) {}

  getActiveServices = async (req: Request, res: Response, next: NextFunction) => {
    const { providerId } = req.params;
    if(Array.isArray(providerId)){
        return handleValidationError('invalid provider id', next)
    }
    try {
      const result = await this._getActiveProviderServicesUseCase.execute(providerId);
      sendSuccessResponse(res, successResponse.PROVIDER_SERVICE_FETCH_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}