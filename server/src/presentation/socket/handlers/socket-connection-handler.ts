import { Server } from "socket.io";
import { AuthenticatedSocket } from "../types/socket.types";
import { ChatEventsHandler } from "./chat-events-handler";
import { winstonLogger } from "../../../infrastructure/config/logger";
import { SocketEvents } from "../events/socket-events";
import { IMarkMessagesDeliveredUseCase } from "../../../domain/interfaces/usecases/chat/IMarkMessagesDeliveredUseCase";

export class SocketConnectionHandler {
  constructor(
    private readonly chatEventsHandler: ChatEventsHandler,
    private readonly markMessagesDeliveredUseCase: IMarkMessagesDeliveredUseCase,
  ) {}

  async handleConnection(io: Server, socket: AuthenticatedSocket) {
    const userId = socket.user?.id;

    winstonLogger.info(
      `Socket client connected: ${socket.id} (User: ${userId})`,
    );

    if (userId) {
      socket.join(`user_${userId}`);

      try {
        const conversations =
          await this.markMessagesDeliveredUseCase.execute(userId);

        for (const conversationId of conversations) {
          io.to(`chat_${conversationId}`).emit(
            SocketEvents.MESSAGES_DELIVERED,
            {
              conversationId,
            },
          );
        }
      } catch (error) {
        winstonLogger.error("Sync delivery status error:", error);
      }
    }

    this.chatEventsHandler.register(socket);
  }
}
