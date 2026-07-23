import { ExtendedError } from "socket.io";
import { JwtTokenService } from "../../../infrastructure/security/jwt-token-service";
import { env } from "../../../infrastructure/config/env";
import { winstonLogger } from "../../../infrastructure/config/logger";
import { AuthenticatedSocket } from "../types/socket.types";
import { AuthenticationError } from "../../../domain/errors/errors";

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};

  if (!cookieHeader) {
    return list;
  }

  cookieHeader.split(";").forEach(cookie => {
    const parts = cookie.split("=");

    const key = parts.shift()?.trim();

    if (key) {
      list[key] = decodeURIComponent(parts.join("="));
    }
  });

  return list;
}

const tokenService = new JwtTokenService();

export function socketAuthMiddleware(
  socket: AuthenticatedSocket,
  next: (err?: ExtendedError) => void
) {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie);

    const token = cookies[env.COOKIE_NAME_ACCESS];

    if (!token) {
      return next(new AuthenticationError("Authentication error: Access token missing"));
    }

    const payload = tokenService.verifyAccess(token);

    socket.user = {
      id: payload.sub,
      email: payload.email || "",
      roles: payload.roles || [],
    };

    next();
  } catch (error) {
    winstonLogger.error("Socket authentication failed:", error);

    next(new Error("Authentication error: Invalid access token"));
  }
}