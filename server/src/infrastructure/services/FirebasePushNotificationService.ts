import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getMessaging, MulticastMessage } from "firebase-admin/messaging";
import { IFcmTokenRepository } from "../../domain/interfaces/repositories/fcmToken/IFcmTokenRepository";
import { IPushNotificationService } from "../../domain/interfaces/services/push-notification/IPushNotificationService";

if (getApps().length === 0) {
  initializeApp({
    credential: cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "{}"),
    ),
  });
}

export class FirebasePushNotificationService implements IPushNotificationService {
  constructor(private readonly _fcmTokenRepository: IFcmTokenRepository) {}

  async sendToUser(
    recipientId: string,
    title: string,
    body: string,
    payload?: Record<string, any>,
  ): Promise<void> {
    const tokens =
      await this._fcmTokenRepository.getTokensByUserId(recipientId);
    if (!tokens || tokens.length === 0) return;

    const stringifiedData: Record<string, string> = {};
    if (payload) {
      Object.keys(payload).forEach((key) => {
        stringifiedData[key] =
          typeof payload[key] === "object"
            ? JSON.stringify(payload[key])
            : String(payload[key]);
      });
    }
    const message: MulticastMessage = {
      tokens: tokens,
      //   notification: { ti
      // tle, body },
      data: {
        title,
        body,
        ...stringifiedData,
      },
    };

    try {
      const response = await getMessaging().sendEachForMulticast(message);

      if (response.failureCount > 0) {
        const tokensToRemove: Promise<void>[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success && resp.error) {
            const code = resp.error.code;
            if (
              code === "messaging/invalid-registration-token" ||
              code === "messaging/registration-token-not-registered"
            ) {
              tokensToRemove.push(
                this._fcmTokenRepository.removeToken(tokens[idx]),
              );
            }
          }
        });
        await Promise.all(tokensToRemove);
      }
    } catch (error) {
      console.error("Firebase Cloud Messaging operational failure:", error);
    }
  }
}
