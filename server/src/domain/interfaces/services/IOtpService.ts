export interface IOtpService {
  verifyOtp(email: string, code: string): Promise<boolean>;
  generateAndStoreOtp(email: string): Promise<string>;
}