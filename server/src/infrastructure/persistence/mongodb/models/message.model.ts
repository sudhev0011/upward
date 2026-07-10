import { Document, Schema, model, Types } from 'mongoose';

export interface UserMessageState {
  isRead: boolean;
  isDeleted: boolean;
}

export interface MessageDocument extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  attachmentUrl: string | null;
  isDelivered: boolean;
  userStates: Map<string, UserMessageState>;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, default: "" },
    attachmentUrl: { type: String, default: null },
    isDelivered: { type: Boolean, default: false },
    userStates: {
      type: Map,
      of: new Schema({
        isRead: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
      }, { _id: false }),
      default: {}
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export const MessageModel = model<MessageDocument>('Message', MessageSchema);
