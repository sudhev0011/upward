import { Request, Response, NextFunction } from "express";
import { LoginDto } from "../../../application/dtos/auth/session/login.dto";
import { GoogleLoginDto } from "../../../application/dtos/auth/session/google-login-request.dto";
import { ILoginUserUseCase } from "../../../domain/interfaces/usecases/auth/session/ILoginUserUseCase";
import { IGoogleLoginUseCase } from "../../../domain/interfaces/usecases/auth/session/IGoogleLoginUseCase";
import { IAdminLoginUseCase } from "../../../domain/interfaces/usecases/auth/session/IAdminLoginUseCase";
import { ILogoutUseCase } from "../../../domain/interfaces/usecases/auth/session/ILogoutUseCase";
import { ICookieService } from "../../services/ICookieService";
import {
  handleValidationError,
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from "../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../shared/utils/presentation/zod-error-formatter.utils";
import { AuthenticatedRequest } from "../../../shared/types/authenticated-request";
import { successResponse } from "../../../shared/constants";

export class LoginController {
  constructor(
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _adminLoginUseCase: IAdminLoginUseCase,
    private readonly _cookieService: ICookieService,
    private readonly _googleLoginUseCase: IGoogleLoginUseCase,
    private readonly _logoutUseCase: ILogoutUseCase
  ) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._loginUserUseCase.execute(parsed.data);

      if (result.tokens) {
        this._cookieService.setAccessToken(res, result.tokens.accessToken);
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, "Login successful", result.user);
      } else {
        sendSuccessResponse(
          res,
          successResponse.SUCCESSFULL_LOGIN,
          result.user,
        );
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  adminLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._adminLoginUseCase.execute(parsed.data);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        this._cookieService.setAccessToken(res, result.tokens.accessToken);
        sendSuccessResponse(
          res,
          "Admin login successful",
          result.user,
          result.tokens.accessToken,
        );
      } else {
        sendSuccessResponse(res, "Admin login successful", result.user);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GoogleLoginDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._googleLoginUseCase.execute(parsed.data);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        this._cookieService.setAccessToken(res, result.tokens.accessToken);
        sendSuccessResponse(res, successResponse.GOOGLE_LOGIN_SUCCESS, result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, successResponse.GOOGLE_LOGIN_SUCCESS, result.user);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  logout = async(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> =>{

    try {
      const userId = validateUserId(req);
      await this._logoutUseCase.execute(userId);
      this._cookieService.clearAccessToken(res);
      this._cookieService.clearRefreshToken(res);
      sendSuccessResponse(res, successResponse.LOG_OUT, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}