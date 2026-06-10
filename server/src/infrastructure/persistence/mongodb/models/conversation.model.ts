import { Document, Schema, model, Types } from 'mongoose';

export interface ConversationDocument extends Document {
  clientId: Types.ObjectId;
  providerId: Types.ObjectId;
  lastMessageId: Types.ObjectId | null;
  unreadCountClient: number;
  unreadCountProvider: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<ConversationDocument>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessageId: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    unreadCountClient: { type: Number, default: 0 },
    unreadCountProvider: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ clientId: 1, providerId: 1 }, { unique: true });

export const ConversationModel = model<ConversationDocument>('Conversation', ConversationSchema);
