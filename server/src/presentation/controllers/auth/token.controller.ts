import { Request, Response, NextFunction } from 'express';
import { IAuthGetUserByIdUseCase } from '../../../domain/interfaces/usecases/auth/user/IAuthGetUserByIdUseCase';
import { IRefreshTokenUseCase } from '../../../domain/interfaces/usecases/auth/session/IRefreshTokenUseCase';
import { ITokenService } from '../../../domain/interfaces/services/ITokenService';
import { ICookieService } from '../../services/ICookieService';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { handleValidationError, handleAsyncError,validateUserId,sendSuccessResponse,sendErrorResponse } from '../../../shared/utils/presentation/controller.utils';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { env } from '../../../infrastructure/config/env';

export class TokenController {
  constructor(
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    private readonly _getUserByIdUseCase: IAuthGetUserByIdUseCase,
    private readonly _tokenService: ITokenService,
    private readonly _cookieService: ICookieService,
  ) { }

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const refreshToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[env.COOKIE_NAME_ACCESS];

    if (!refreshToken || typeof refreshToken !== 'string') {
      return handleValidationError('Invalid refresh token', next);
    }

    try {
      const result = await this._refreshTokenUseCase.execute(refreshToken);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, 'Token refreshed', result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, 'Token refreshed', result.user, undefined);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  checkAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const user = await this._getUserByIdUseCase.execute(userId);

      if (!user) {
        return handleValidationError('User not found', next);
      }

      if (user.isBlocked) {
        return sendErrorResponse(res, 'User account is blocked', null, 403);
      }

      sendSuccessResponse(res, 'Authenticated', user);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
