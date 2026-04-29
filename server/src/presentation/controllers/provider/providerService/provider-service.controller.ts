import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from "../../../../shared/utils/presentation/controller.utils";
import { CreateProviderServiceRequestDtoSchema } from "../../../../application/dtos/provider/providerService/request/create-provider-service-request.dto";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { ICreateProviderServiceUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/ICreateProviderServiceUseCase";
import { IGetProviderServicesByCategoryUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/IGetProviderServiceByCategoryUseCase";
import { ISetProviderServicePriceUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/ISetProviderServicePriceUseCase";
import { setProviderServicePriceRequestDtoSchema } from "../../../../application/dtos/provider/providerService/request/set-provider-service-price-request.dto";
import { IDeleteProviderServiceUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/IDeleteProviderServiceUseCase";
import { GetPaginatedProviderServicesRequestDto } from "../../../../application/dtos/provider/providerService/request/get-paginates-provider-services.dto";
import { successResponse } from "../../../../shared/constants";

export class ProviderServiceController{

    constructor(
        private readonly _createProviderServiceUseCase: ICreateProviderServiceUseCase,
        private readonly _getProviderServicesByCategoryUseCase: IGetProviderServicesByCategoryUseCase,
        private readonly _setProviderServicePriceUseCase: ISetProviderServicePriceUseCase,
        private readonly _deleteProviderServiceUseCase: IDeleteProviderServiceUseCase,
    ){}

    createProviderService = async(req: AuthenticatedRequest, res: Response, next: NextFunction)=>{
        const userId = validateUserId(req);

        const bodySchema = CreateProviderServiceRequestDtoSchema.omit({providerId: true});

        const parsed = bodySchema.safeParse(req.body);

        if(!parsed.success){
            return handleValidationError(formatZodErrors(parsed.error),next);
        }

        try {
            const result = await this._createProviderServiceUseCase.execute({providerId: userId, serviceId: parsed.data.serviceId});
            sendSuccessResponse(res, successResponse.CREATE_PROVIDER_SERVICE_SUCCESS, result);
        } catch (error) {
            handleAsyncError(error, next);
        }
    }

    getProviderServicesByCategory = async(req: AuthenticatedRequest, res: Response, next: NextFunction)=>{
        const providerId = validateUserId(req);

        const parsed = GetPaginatedProviderServicesRequestDto.safeParse(req.query);

        if(!parsed.success){
            return handleValidationError(formatZodErrors(parsed.error), next);
        }

        try {
            const result = await this._getProviderServicesByCategoryUseCase.execute({providerId, query: parsed.data});
            sendSuccessResponse(res, successResponse.PROVIDER_SERVICE_FETCH_SUCCESS, result);
        } catch (error) {
            handleAsyncError(error, next);
        }
    }

    setProviderServicePrice = async(req: Request, res: Response, next: NextFunction)=>{

        const parsed = setProviderServicePriceRequestDtoSchema.safeParse(req.body);

        if(!parsed.success){
            return handleAsyncError(formatZodErrors(parsed.error),next);
        }

        try {
            const result = await this._setProviderServicePriceUseCase.execute(parsed.data);
            sendSuccessResponse(res, successResponse.SET_PROVIDER_SERVICE_PRICE_SUCCES, result);
        } catch (error) {
            handleAsyncError(error, next);
        }
    }

    deleteProviderService = async(req: Request, res: Response, next: NextFunction)=>{

        console.log(req.path)
        const {id} = req.params as {id:string}
        if(!id.trim()){
            return handleValidationError("invalid service id", next);
        }

        try {
            await this._deleteProviderServiceUseCase.execute(id);
            sendSuccessResponse(res,successResponse.DELETE_PROVIDER_SERVICE_SUCCESS,null);
        } catch (error) {
            handleAsyncError(error, next);
        }
    }
}