import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  handleValidationError,
  sendCreatedResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import {
  CreateClientProfileRequestDtoSchema,
} from "../../../../application/dtos/client/profile/info/request/create-client-profile-request.dto";
import { ICreateClientProfileUseCase } from "../../../../domain/interfaces/usecases/client/profile/ICreateClientProfileUseCase";

export class CreateClientProfileController {
  constructor(
    private readonly _createClientProfileUseCase: ICreateClientProfileUseCase,
  ) {}

  execute = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = CreateClientProfileRequestDtoSchema.omit({
        userId: true,
      });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const profile = await this._createClientProfileUseCase.execute({
        ...parsed.data,
        userId,
      });

      sendCreatedResponse(res, "Client profile created successfully", profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
