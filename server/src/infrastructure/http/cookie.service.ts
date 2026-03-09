import { Response } from 'express';
import { env } from '../config/env';
import { ICookieService } from '../../presentation/services/ICookieService';

export class CookieService implements ICookieService {
  private readonly _accessCookieName: string = env.COOKIE_NAME_ACCESS;
  private readonly _refreshCookieName: string = env.COOKIE_NAME_REFRESH;

  private readonly _accessTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000,
    path: '/',
  };
  private readonly _refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };

  private readonly _logoutCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 0,
    path: '/',
  };

  setRefreshToken(res: Response, token: string): void {
    res.cookie(this._refreshCookieName, token, this._refreshTokenCookieOptions);
  }

  setAccessToken(res: Response, token: string): void {
    res.cookie(this._accessCookieName, token, this._accessTokenCookieOptions);
  }

  clearRefreshToken(res: Response): void {
    res.clearCookie(this._refreshCookieName, this._logoutCookieOptions);
  }

  clearAccessToken(res: Response): void {
    res.clearCookie(this._accessCookieName,this._logoutCookieOptions)
  }

}
