export interface IFcmTokenRepository {
  saveToken(userId: string, token: string, deviceType?: string): Promise<void>;
  getTokensByUserId(userId: string): Promise<string[]>;
  removeToken(token: string): Promise<void>; // Crucial for cleaning up dead/expired tokens
}