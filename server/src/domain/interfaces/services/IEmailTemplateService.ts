export interface IEmailTemplateService {

    getOtpVerificationEmail(code: string): {subject:string, html: string};
    getPasswordResetEmail(code: string): {subject:string, html: string};
}