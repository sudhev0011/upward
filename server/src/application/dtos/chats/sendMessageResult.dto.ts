import { Message } from "../../../domain/entities/message.entity";

export interface SendMessageResult {
  message: Message;
  recipientId: string;
}