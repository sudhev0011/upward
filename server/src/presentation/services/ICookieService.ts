import { Response } from 'express';

export interface ICookieService {
  setAccessToken(res: Response, token: string): void;
  setRefreshToken(res: Response, token: string): void;
  clearAccessToken(res: Response, token: string): void;
  clearRefreshToken(res: Response): void;
}