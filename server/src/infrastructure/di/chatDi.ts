import { MongoChatRepository } from '../persistence/mongodb/repositories/chat.repository';
import { UserRepository } from '../persistence/mongodb/repositories/user.repository';
import { GetConversationsUseCase } from '../../application/use-cases/chat/get-conversations.use-case';
import { GetMessagesUseCase } from '../../application/use-cases/chat/get-messages.use-case';
import { FindOrCreateConversationUseCase } from '../../application/use-cases/chat/find-or-create-conversation.use-case';
import { ResetUnreadCountUseCase } from '../../application/use-cases/chat/reset-unread-count.use-case';
import { SendMessageUseCase } from '../../application/use-cases/chat/send-message.use-case';
import { ChatController } from '../../presentation/controllers/chat.controller';

// Initialize repositories
const chatRepository = new MongoChatRepository();
const userRepository = new UserRepository();


// Initialize usecases
export const getConversationsUseCase = new GetConversationsUseCase(chatRepository, userRepository);
export const getMessagesUseCase = new GetMessagesUseCase(chatRepository);
export const findOrCreateConversationUseCase = new FindOrCreateConversationUseCase(chatRepository);
export const resetUnreadCountUseCase = new ResetUnreadCountUseCase(chatRepository);
export const sendMessageUseCase = new SendMessageUseCase(chatRepository);

// Initialize controller
export const chatController = new ChatController(
  getConversationsUseCase,
  getMessagesUseCase,
  findOrCreateConversationUseCase,
  resetUnreadCountUseCase
);
