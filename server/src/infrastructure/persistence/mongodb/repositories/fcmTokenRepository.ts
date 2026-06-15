import { Types } from 'mongoose';
import { IFcmTokenRepository } from '../../../../domain/interfaces/repositories/fcmToken/IFcmTokenRepository';
import { FcmTokenModel } from '../models/fcmToken.model';

export class FcmTokenRepository implements IFcmTokenRepository {
  async saveToken(userId: string, token: string, deviceType: string = 'web'): Promise<void> {
    // Upsert so a token is unique and linked to the latest user session
    await FcmTokenModel.findOneAndUpdate(
      { token },
      { userId: new Types.ObjectId(userId), deviceType },
      { upsert: true, new: true }
    );
  }

  async getTokensByUserId(userId: string): Promise<string[]> {
    const docs = await FcmTokenModel.find({ userId: new Types.ObjectId(userId) });
    return docs.map(doc => doc.token); // Map directly to a primitive string array for the service
  }

  async removeToken(token: string): Promise<void> {
    await FcmTokenModel.deleteOne({ token });
  }
}