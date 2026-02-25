import { GoogleLoginRequestDto } from "../../../dtos/auth/session/google-login-request.dto";
import { IGoogleLoginUseCase } from "../../../../domain/interfaces/usecases/auth/session/IGoogleLoginUseCase";
import { LoginResponseDto } from "../../../dtos/auth/session/login-response.dto";
import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { IGoogleTokenVerifier } from "../../../../domain/interfaces/services/IGoogleTokenVerifier";
import { IPasswordHasher } from "../../../../domain/interfaces/services/IPasswordHasher";
import { UserMapper } from "../../../mapers/auth/user.mapper";
import crypto from 'crypto'
import { AuthorizationError } from "../../../../domain/errors/errors";
import { ITokenService } from "../../../../domain/interfaces/services/ITokenService";

export class GoogleLoginUseCase implements IGoogleLoginUseCase {

    constructor(
        private readonly _userRepository : IUserRepository,
        private readonly _passwordHasher : IPasswordHasher,
        private readonly _googleTokenVerifier : IGoogleTokenVerifier,
        private readonly _tokenService : ITokenService,
    ){}

    async execute(params: GoogleLoginRequestDto): Promise<LoginResponseDto> {
        const {idToken} =  params;
        const profile = await this._googleTokenVerifier.verifyIdToken(idToken);
        let user = await this._userRepository.findOne({email: profile.email});
        
        if(!user){
            const randomPassword = crypto.randomBytes(32).toString('hex');
            const hashed = await this._passwordHasher.hash(randomPassword);
            user = await this._userRepository.create(UserMapper.fromGoogleProfile(profile, hashed));
        }

        if(user.isBlocked){
            throw new AuthorizationError('User is blocked. Please contact support for unblock')
        }

        if(!user.isVerified){
            await this._userRepository.update(user.id,{isVerified: true})
        }

        const accessToken = this._tokenService.signAccess({
        sub: user.id,
        role: user.role,
        email: user.email});

        const refreshToken = this._tokenService.signRefresh({
            sub: user.id,
            role: user.role,
            email: user.email
        });

        const hashedRefresh = await this._passwordHasher.hash(refreshToken);
        await this._userRepository.update(user.id, {refreshToken: hashedRefresh});
        return { tokens: { accessToken, refreshToken }, user: UserMapper.toResponse(user) };
    }
}