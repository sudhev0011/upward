import { IEmailTemplateService } from '../../domain/interfaces/services/IEmailTemplateService';
import { otpVerificationTemplate } from './templates/otp-verification.template';
import { passwordResetTemplate } from './templates/password-reset.template';

export class EmailTemplateService implements IEmailTemplateService {

  getOtpVerificationEmail(code: string): { subject: string; html: string } {
    const subject = otpVerificationTemplate.subject;
    const html = otpVerificationTemplate.html(code);
    return { subject, html };
  }

  getPasswordResetEmail(link: string): {subject: string, html: string} {
    const subject = passwordResetTemplate.subject;
    const html = passwordResetTemplate.html(link);

    return {subject, html}
  }
}