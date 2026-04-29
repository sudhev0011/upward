import { Request, Response, NextFunction } from 'express';
import { IAuthGetUserByIdUseCase } from '../../../domain/interfaces/usecases/auth/user/IAuthGetUserByIdUseCase';
import { IRefreshTokenUseCase } from '../../../domain/interfaces/usecases/auth/session/IRefreshTokenUseCase';
import { ICookieService } from '../../services/ICookieService';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { handleValidationError, handleAsyncError,validateUserId,sendSuccessResponse,sendErrorResponse } from '../../../shared/utils/presentation/controller.utils';
import { env } from '../../../infrastructure/config/env';
import { successResponse } from '../../../shared/constants';

export class TokenController {
  constructor(
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    private readonly _getUserByIdUseCase: IAuthGetUserByIdUseCase,
    private readonly _cookieService: ICookieService,
  ) { }

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const refreshToken = (req as Request & { cookies?: Record<string, string> }).cookies?.[env.COOKIE_NAME_REFRESH];

    if (!refreshToken || typeof refreshToken !== 'string') {
      return handleValidationError('Invalid refresh token or token missing', next);
    }

    try {
      const result = await this._refreshTokenUseCase.execute(refreshToken);

      if (result.tokens) {
        this._cookieService.setAccessToken(res, result.tokens.accessToken);
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, successResponse.REFRESH_TOKEN_SUCCESS, result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, successResponse.REFRESH_TOKEN_SUCCESS, result.user, undefined);
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

      sendSuccessResponse(res, successResponse.CHECK_aUTH_SUCCESS, user);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
