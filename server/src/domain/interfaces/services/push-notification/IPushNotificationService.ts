export interface IPushNotificationService {
  sendToUser(
    recipientId: string, 
    title: string, 
    body: string, 
    payload?: Record<string, any>
  ): Promise<void>;
}