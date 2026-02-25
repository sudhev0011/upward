import nodemailer from 'nodemailer';
import { IMailerService } from '../../domain/interfaces/services/IEmailServices';
import { env } from '../config/env';

export class NodemailerService implements IMailerService {
  private _transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    await this._transporter.sendMail({
      from: env.EMAIL_USER,
      to,
      subject,
      html,
    });
  }
}