import { Router } from 'express';
import { registrationController, loginController, otpController, passwordController, tokenController } from '../../infrastructure/di/authDi';

import { authenticateToken } from '../middleware/auth.middleware';

export class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.post('/register', registrationController.register);
    this.router.post('/login', loginController.login);
    this.router.post('/login/google', loginController.googleLogin);
    this.router.post('/otp-request', otpController.request);
    this.router.post('/otp-verify', otpController.verify);
    this.router.post('/admin-login', loginController.adminLogin);
    this.router.post('/logout',authenticateToken, loginController.logout);
    this.router.post('/forgot-password', passwordController.forgotPassword);
    this.router.post('/reset-password', passwordController.resetPassword);
    this.router.get('/check-auth', authenticateToken, tokenController.checkAuth);
    this.router.post('/refresh', tokenController.refresh);
  }
}