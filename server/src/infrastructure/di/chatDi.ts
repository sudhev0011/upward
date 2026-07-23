import { MongoChatRepository } from "../persistence/mongodb/repositories/chat.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";
import { GetConversationsUseCase } from "../../application/use-cases/chat/get-conversations.use-case";
import { GetMessagesUseCase } from "../../application/use-cases/chat/get-messages.use-case";
import { FindOrCreateConversationUseCase } from "../../application/use-cases/chat/find-or-create-conversation.use-case";
import { ResetUnreadCountUseCase } from "../../application/use-cases/chat/reset-unread-count.use-case";
import { SendMessageUseCase } from "../../application/use-cases/chat/send-message.use-case";
import { AddMessageReactionUseCase } from "../../application/use-cases/chat/add-message-reaction.use-case";
import { GetChatUploadUrlUseCase } from "../../application/use-cases/chat/get-chat-upload-url.use-case";
import { DeleteMessageUseCase } from "../../application/use-cases/chat/delete-message.use-case";
import { ChatController } from "../../presentation/controllers/chat.controller";
import { S3Service } from "../external-services/s3/s3.service";
import { WinstonLogger } from "../services/logger.service";
import { notificationService } from "./notificationDi";
import { SocketPresenceService } from "../services/socket-presence.service";
import { MarkMessagesDeliveredUseCase } from "../../application/use-cases/chat/mark-messages-delivered.use-case";
import { MongoTransactionManager } from "../persistence/mongodb/mongo-transaction.manager";

// Initialize repositories
export const chatRepository = new MongoChatRepository();
const userRepository = new UserRepository();

// Initialize logger and S3
const logger = new WinstonLogger();
const s3Service = new S3Service(logger);
const presenceService = new SocketPresenceService();
const transactionManager = new MongoTransactionManager();

// Initialize usecases
export const getConversationsUseCase = new GetConversationsUseCase(
  chatRepository,
  userRepository,
);
export const getMessagesUseCase = new GetMessagesUseCase(chatRepository);
export const findOrCreateConversationUseCase =
  new FindOrCreateConversationUseCase(chatRepository);
export const resetUnreadCountUseCase = new ResetUnreadCountUseCase(
  chatRepository,
  transactionManager,
);
export const sendMessageUseCase = new SendMessageUseCase(
  chatRepository,
  userRepository,
  notificationService,
  presenceService,
);
export const getChatUploadUrlUseCase = new GetChatUploadUrlUseCase(s3Service);
export const deleteMessageUseCase = new DeleteMessageUseCase(chatRepository);
export const addMessageReactionUseCase = new AddMessageReactionUseCase(
  chatRepository,
);
export const markMessagesDeliveredUseCase = new MarkMessagesDeliveredUseCase(
  chatRepository,
);

// Initialize controller
export const chatController = new ChatController(
  getConversationsUseCase,
  getMessagesUseCase,
  findOrCreateConversationUseCase,
  resetUnreadCountUseCase,
  getChatUploadUrlUseCase,
);
