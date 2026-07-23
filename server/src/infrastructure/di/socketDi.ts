import { deleteMessageUseCase, markMessagesDeliveredUseCase, sendMessageUseCase, addMessageReactionUseCase, resetUnreadCountUseCase } from "./chatDi";
import { socketService } from "../services/socket.service";
import { ChatEventsHandler } from "../../presentation/socket/handlers/chat-events-handler";
import { SocketConnectionHandler } from "../../presentation/socket/handlers/socket-connection-handler";
import { WinstonLogger } from "../services/logger.service";

const logger = new WinstonLogger()

export const chatEventsHandler = new ChatEventsHandler(
  socketService,
  sendMessageUseCase,
  deleteMessageUseCase,
  addMessageReactionUseCase,
  resetUnreadCountUseCase,
  logger
);

export const socketConnectionHandler = new SocketConnectionHandler(
  chatEventsHandler,
  markMessagesDeliveredUseCase
);