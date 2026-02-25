import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { IResetPasswordUseCase } from '../../../domain/interfaces/usecases/auth/password/IResetPasswordUseCase';
import { IForgotPasswordUseCase } from '../../../domain/interfaces/usecases/auth/password/IForgotPasswordUseCase';
import { handleValidationError, sendSuccessResponse,handleAsyncError } from '../../../shared/utils/presentation/controller.utils';
import { formatZodErrors } from '../../../shared/utils/presentation/zod-error-formatter.utils';

export class PasswordController {
  constructor(
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
  ) { }

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = z.object({
      email: z.string().email('Invalid email address'),
    }).safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._forgotPasswordUseCase.execute(parsed.data.email);
      sendSuccessResponse(res, 'Password reset link has been sent to your email.', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = z.object({
      token: z.string().min(1, 'Token is required'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    }).safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._resetPasswordUseCase.execute(parsed.data.token, parsed.data.newPassword);
      sendSuccessResponse(res, 'Password has been reset successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

}
