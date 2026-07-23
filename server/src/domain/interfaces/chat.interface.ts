import { Message } from "../entities/message.entity";

export interface DeleteMessageResult {
  message: Message;
  recipientId: string;
}

export interface AddReactionResult {
  message: Message;
  recipientId: string;
}

export interface ResetUnreadCountResult {
  recipientId: string;
}
