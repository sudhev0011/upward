import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { SubmitProviderKycRequestDtoSchema } from "../../../../application/dtos/provider/kyc/submit-provider-kyc.dto";
import { ISubmitProviderKycUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/ISubmitProviderKycUseCase";

export class SubmitProviderKycController {
  constructor(private readonly _submitProviderKycUseCase: ISubmitProviderKycUseCase) {}

  execute = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const providerId = validateUserId(req); 
      const bodySchema = SubmitProviderKycRequestDtoSchema.omit({ providerId: true });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      await this._submitProviderKycUseCase.execute({ ...parsed.data, providerId });

      sendSuccessResponse(res, "KYC details submitted successfully.", null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
