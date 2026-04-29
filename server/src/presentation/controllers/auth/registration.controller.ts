import { Request, Response, NextFunction } from 'express';
import { RegisterDto } from '../../../application/dtos/auth/registration/register.request.dto';
import { IRegisterUserUseCase } from '../../../domain/interfaces/usecases/auth/registration/IRegisterUserUseCase';
import { handleAsyncError, handleValidationError, sendCreatedResponse } from '../../../shared/utils/presentation/controller.utils';
import { formatZodErrors } from '../../../shared/utils/presentation/zod-error-formatter.utils';
import { successResponse } from '../../../shared/constants';

export class RegistrationController {
  constructor(private readonly _registerUserUseCase: IRegisterUserUseCase) { }
  
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = RegisterDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }
    try {
      const { user } = await this._registerUserUseCase.execute(parsed.data);
      sendCreatedResponse(res, successResponse.REGISTER_SUCCESS, user);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}