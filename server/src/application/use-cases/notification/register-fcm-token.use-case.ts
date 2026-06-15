import { IFcmTokenRepository } from "../../../domain/interfaces/repositories/fcmToken/IFcmTokenRepository";

export class RegisterFcmTokenUseCase {
  constructor(private readonly _fcmTokenRepository: IFcmTokenRepository) {}

  async execute(userId: string, token: string, deviceType?: string): Promise<void> {
    if (!token) {
      throw new Error('FCM Token must be provided');
    }
    
    await this._fcmTokenRepository.saveToken(userId, token, deviceType || 'web');
  }
}