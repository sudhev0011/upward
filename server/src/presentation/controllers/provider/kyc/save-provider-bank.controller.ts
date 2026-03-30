import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { SaveProviderBankRequestDtoSchema } from "../../../../application/dtos/provider/kyc/save-provider-bank.dto";
import { ISaveProviderBankUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/ISaveProviderBankUseCase";

export class SaveProviderBankController {
  constructor(private readonly _saveProviderBankUseCase: ISaveProviderBankUseCase) {}

  execute = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const providerId = validateUserId(req);

      const bodySchema = SaveProviderBankRequestDtoSchema.omit({ providerId: true });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const response = await this._saveProviderBankUseCase.execute({ ...parsed.data, providerId });

      sendSuccessResponse(res, "Bank details uploaded successfully", response);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
