import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { UpdateProviderProfileRequestDtoSchema } from "../../../../application/dtos/provider/profile/info/request/update-provider-profile-request.dto";
import { IUpdateProviderProfileUseCase } from "../../../../domain/interfaces/usecases/provider/profile/IUpdateProviderProfileUseCase";

export class UpdateProviderProfileController{
    constructor(
        private readonly _updateProviderProfileUseCase: IUpdateProviderProfileUseCase
    ){}

    execute = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = UpdateProviderProfileRequestDtoSchema.omit({ userId: true });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const profile = await this._updateProviderProfileUseCase.execute({ ...parsed.data, userId });

      sendSuccessResponse(res, 'Seeker profile updated successfully', profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}