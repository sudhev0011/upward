import { AuthenticatedSocket, SocketCallback } from "../types/socket.types";
import { winstonLogger } from "../../../infrastructure/config/logger";

export function getUserId(
  socket: AuthenticatedSocket
): string {

  const userId = socket.user?.id;

  if (!userId) {
    throw new Error("User context not found");
  }

  return userId;

}

export function handleSocketError(
  error: unknown,
  callback?: SocketCallback
): void {

  winstonLogger.error(error);

  callback?.({
    success: false,
    error:
      error instanceof Error
        ? error.message
        : "Unknown error"
  });

}