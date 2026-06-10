import { Document, Schema, model, Types } from 'mongoose';

export interface NotificationDocument extends Document {
  recipientId: Types.ObjectId;
  senderId: Types.ObjectId | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  data: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['chat', 'booking', 'payment', 'wallet', 'system'],
      required: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    data: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipientId: 1, isRead: 1 });
NotificationSchema.index({ recipientId: 1, createdAt: -1 });

export const NotificationModel = model<NotificationDocument>('Notification', NotificationSchema);
