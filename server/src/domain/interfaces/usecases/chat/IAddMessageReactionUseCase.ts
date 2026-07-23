import { AddReactionResult } from "../../chat.interface";

export interface IAddMessageReactionUseCase {
  execute(
    messageId: string,
    userId: string,
    reaction: string
  ): Promise<AddReactionResult>;
}