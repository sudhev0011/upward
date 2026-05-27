import { Document, Schema, model, Types } from 'mongoose';

export interface MessageDocument extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  attachmentUrl: string | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    attachmentUrl: { type: String, default: null },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Index to optimize listing messages by conversation sorted by creation time
MessageSchema.index({ conversationId: 1, createdAt: 1 });

export const MessageModel = model<MessageDocument>('Message', MessageSchema);
