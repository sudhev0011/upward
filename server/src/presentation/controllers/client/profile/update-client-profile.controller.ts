import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { UpdateClientProfileRequestDtoSchema } from "../../../../application/dtos/client/profile/info/request/update-client-profile-request.dto";
import { IUpdateClientProfileUseCase } from "../../../../domain/interfaces/usecases/client/profile/IUpdateClientProfileUseCase";

export class UpdateClientProfileController{
    constructor(
        private readonly _updateClientProfileUseCase: IUpdateClientProfileUseCase
    ){}

    execute = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = UpdateClientProfileRequestDtoSchema.omit({ userId: true });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const profile = await this._updateClientProfileUseCase.execute({ ...parsed.data, userId });

      sendSuccessResponse(res, 'Seeker profile updated successfully', profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}