import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  handleValidationError,
  sendCreatedResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { CreateProviderProfileRequestDtoSchema } from "../../../../application/dtos/provider/profile/info/request/create-provider-profile-request.dto";
import { ICreateProviderProfileUseCase } from "../../../../domain/interfaces/usecases/provider/profile/ICreateProviderProfileUseCase";

export class CreateProviderProfileController {
  constructor(
    private readonly _createProviderProfileUseCase: ICreateProviderProfileUseCase,
  ) {}

  execute = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = CreateProviderProfileRequestDtoSchema.omit({
        userId: true,
      });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const profile = await this._createProviderProfileUseCase.execute({
        ...parsed.data,
        userId,
      });

      sendCreatedResponse(res, "provider profile created successfully", profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
