import { Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from '../../domain/errors/errors';
import { JwtTokenService } from '../../infrastructure/security/jwt-token-service';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request';
import { ITokenPayload } from '../../domain/interfaces/services/ITokenService';
export { AuthenticatedRequest };
import { env } from '../../infrastructure/config/env';
import { winstonLogger } from '../../infrastructure/config/logger';




function extractToken(req: AuthenticatedRequest): string | undefined {
  const cookieName = env.COOKIE_NAME_ACCESS;
  return (req as AuthenticatedRequest & { cookies?: Record<string, string> }).cookies?.[cookieName];
}


function createUserContext(payload: ITokenPayload): AuthenticatedRequest['user'] {
  return {
    id: payload.sub,
    userId: payload.sub,
    email: payload.email || '',
    roles: payload.roles || [],
  };
}


export function createAuthenticationMiddleware(tokenService: JwtTokenService) {
  
  function authenticateToken(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
    const token = extractToken(req);

    if (!token) {
      return next(new AuthenticationError('Missing access token'));
    }
    
    try {
      const payload = tokenService.verifyAccess(token);
      req.user = createUserContext(payload);
      next();
    } catch (error) {
      winstonLogger.error(error)
      next(new AuthenticationError('expired token'));
    }
  }

  return {
    authenticateToken,
  };
}


export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const userRoles = req.user?.roles;

    if (!userRoles) {
      return next(new AuthorizationError());
    }

    const hasPermission = userRoles.some(role => allowedRoles.includes(role));

    if (!hasPermission) {
      return next(new AuthorizationError());
    }

    next();
  };
}



const tokenService = new JwtTokenService();
const { authenticateToken } = createAuthenticationMiddleware(tokenService);

export { authenticateToken };