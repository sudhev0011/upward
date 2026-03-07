import { Response } from 'express';

export interface ICookieService {
  setAccessToken(res: Response, token: string): void;
  setRefreshToken(res: Response, token: string): void;
  clearAccessToken(res: Response): void;
  clearRefreshToken(res: Response): void;
}