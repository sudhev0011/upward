import { Message } from "../../../domain/entities/message.entity";

export interface DeleteMessageResult {
    message: Message;
    recipientId: string;
}