import { IChatRepository } from '../../../domain/interfaces/repositories/chat/IChatRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IGetConversationsUseCase, ConversationResponseDto } from '../../../domain/interfaces/usecases/chat/IGetConversationsUseCase';

export class GetConversationsUseCase implements IGetConversationsUseCase {
  constructor(
    private readonly _chatRepository: IChatRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<ConversationResponseDto[]> {
    const conversations = await this._chatRepository.findConversationsByUserId(userId);
    const results: ConversationResponseDto[] = [];

    for (const conv of conversations) {
      const participantId = conv.clientId === userId ? conv.providerId : conv.clientId;
      const user = await this._userRepository.findById(participantId);

      let lastMessage = null;
      if(conv.lastMessageId){
        lastMessage = await this._chatRepository.findMessageByMessageId(conv.lastMessageId)
      }

      results.push({
        id: conv.id || '',
        clientId: conv.clientId,
        providerId: conv.providerId,
        unreadCountClient: conv.unreadCountClient,
        unreadCountProvider: conv.unreadCountProvider,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        lastMessage,
        participant: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatarFileName,
            }
          : null,
      });
    }

    return results;
  }
}
