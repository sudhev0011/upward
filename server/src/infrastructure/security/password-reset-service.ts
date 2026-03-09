import { randomBytes } from 'crypto';
import { redisClient } from '../persistence/redis/connection/redis';
import { IMailerService } from '../../domain/interfaces/services/IEmailServices';
import { IPasswordResetService } from '../../domain/interfaces/services/IPasswordResetService';
import { env } from '../config/env';
import { IEmailTemplateService } from '../../domain/interfaces/services/IEmailTemplateService';

interface PasswordResetToken {
  userId: string;
  email: string;
  token: string;
  expiresAt: string;
}

export class PasswordResetService implements IPasswordResetService {
  constructor(
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService
    ) {}

  async generateResetToken(userId: string, email: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const resetData: PasswordResetToken = {
      userId,
      email,
      token,
      expiresAt: expiresAt.toISOString(),
    };

    const key = `password_reset:${token}`;
    await redisClient.setEx(key, 900, JSON.stringify(resetData));

    return token;
  }

  async getResetToken(token: string): Promise<{ userId: string; email: string } | null> {
    const key = `password_reset:${token}`;
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    try {
      const resetData = JSON.parse(data) as PasswordResetToken;

      if (new Date() > new Date(resetData.expiresAt)) {
        await this.invalidateToken(token);
        return null;
      }

      return {
        userId: resetData.userId,
        email: resetData.email,
      };
    } catch (error) {
      return null;
    }
  }

  async invalidateToken(token: string): Promise<void> {
    const key = `password_reset:${token}`;
    await redisClient.del(key);
  }

  async sendResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const {subject, html} = this._emailTemplateService.getPasswordResetEmail(resetUrl);

    await this._mailerService.sendMail(email, subject, html);
  }
}
