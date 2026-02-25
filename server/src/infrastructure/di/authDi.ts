//useCases imports
import { RegisterUserUseCase } from "../../application/use-cases/auth/registration/register-user.use-case";
import { LoginUserUseCase } from "../../application/use-cases/auth/session/login-user.use-case";
import { RequestOtpUseCase } from "../../application/use-cases/auth/verification/request-otp.use-case";
import { VerifyOtpUseCase } from "../../application/use-cases/auth/verification/verify-otp.use-case";
import { AdminLoginUseCase } from "../../application/use-cases/auth/session/admin-login.use-case";
import { GoogleLoginUseCase } from "../../application/use-cases/auth/session/google-login.use-case";
import { LogoutUseCase } from "../../application/use-cases/auth/session/logout.use-case";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/password/forgot-password.use-case";
import { ResetPasswordUseCase } from "../../application/use-cases/auth/password/reset-password.use-case";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/session/refresh-token.use-case";
import { GetUserByIdUseCase } from "../../application/use-cases/auth/user/get-user-by-id.use-case";


//repos imports
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";

//controllers
import { RegistrationController } from "../../presentation/controllers/auth/registration.controller";
import { LoginController } from "../../presentation/controllers/auth/login.controller";
import { OtpController } from "../../presentation/controllers/auth/otp.controller";
import { PasswordController } from "../../presentation/controllers/auth/password.controller";
import { TokenController } from "../../presentation/controllers/auth/token.controller";

//services imports
import { BcryptPasswordHasher } from "../security/bcrypt-password-hasher";
import { JwtTokenService } from "../security/jwt-token-service";
import { RedisOtpService } from "../persistence/redis/service/redis-otp-service";
import { NodemailerService } from "../mailing/mailer.config";
import { CookieService } from "../http/cookie.service";
import { EmailTemplateService } from "../mailing/email-template.service";
import { GoogleTokenVerifier } from "../security/google-token-verifier";
import { PasswordResetService } from "../security/password-reset-service";


//repo init
const userRepository = new UserRepository();

//service init
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();
const otpService = new RedisOtpService();
const mailerService = new NodemailerService();
const cookieService = new CookieService();
const emailTemplateService = new EmailTemplateService();
const googleTokenVerifier = new GoogleTokenVerifier();
const passwordResetService = new PasswordResetService(mailerService,emailTemplateService);


//useCase init
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher,otpService,mailerService,emailTemplateService);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService, otpService, mailerService, emailTemplateService);
const requestOtpUseCase = new RequestOtpUseCase(otpService, mailerService, userRepository);
const verifyOtpUseCase = new VerifyOtpUseCase(otpService, tokenService, passwordHasher, userRepository);
const adminLoginUseCase = new AdminLoginUseCase(userRepository,passwordHasher,tokenService)
const googleLoginUseCase = new GoogleLoginUseCase(userRepository, passwordHasher, googleTokenVerifier,tokenService);
const logoutUseCase = new LogoutUseCase(userRepository);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository,passwordResetService)
const resetPasswordUseCase = new ResetPasswordUseCase(passwordHasher,passwordResetService,userRepository)
const refreshTokenUseCase = new RefreshTokenUseCase(userRepository,tokenService,passwordHasher);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

//controller init
export const registrationController = new RegistrationController(registerUserUseCase);
export const loginController = new LoginController(loginUserUseCase,adminLoginUseCase,cookieService,googleLoginUseCase, logoutUseCase);
export const otpController = new OtpController(requestOtpUseCase, verifyOtpUseCase, cookieService);
export const passwordController = new PasswordController(forgotPasswordUseCase,resetPasswordUseCase)
export const tokenController = new TokenController(refreshTokenUseCase,getUserByIdUseCase,tokenService,cookieService);