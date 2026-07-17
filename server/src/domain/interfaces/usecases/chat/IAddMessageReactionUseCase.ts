import { Message } from "../../../entities/message.entity";

export interface IAddMessageReactionUseCase {
  execute(
    messageId: string,
    userId: string,
    reaction: string
  ): Promise<Message | null>;
}