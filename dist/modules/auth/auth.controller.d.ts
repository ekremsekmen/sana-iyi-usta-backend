import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { EmailVerificationResponseDto, VerifyEmailDto } from './dto/email.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleAuthDto, AppleAuthDto, FacebookAuthDto } from './dto/social-auth.dto';
import { RequestPasswordResetDto, ResetPasswordWithCodeDto, VerifyResetCodeDto, ChangePasswordDto } from './dto/password.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { Request } from 'express';
import { RegistrationResult } from './services/user-registration.service';
import { UpdateFcmTokenDto } from './dto/fcm-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<RegistrationResult>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<EmailVerificationResponseDto>;
    login(loginDto: LoginDto, request: Request): Promise<{
        user: {
            id: any;
            full_name: any;
            e_mail: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
    logout(request: RequestWithUser, refreshTokenDto: RefreshTokenDto): Promise<{
        message: string;
        status: string;
    }>;
    googleMobileAuth(googleAuthDto: GoogleAuthDto, req: Request): Promise<{
        user: {
            id: any;
            full_name: any;
            e_mail: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
    appleMobileAuth(appleAuthDto: AppleAuthDto, req: Request): Promise<{
        user: {
            id: any;
            full_name: any;
            e_mail: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
    facebookMobileAuth(facebookAuthDto: FacebookAuthDto, req: Request): Promise<{
        user: {
            id: any;
            full_name: any;
            e_mail: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
    forgotPassword(dto: RequestPasswordResetDto): Promise<{
        message: string;
        status: string;
        socialProviders?: string[];
    }>;
    verifyResetCode(dto: VerifyResetCodeDto): Promise<{
        message: string;
        status: string;
        isValid: boolean;
    }>;
    resetPassword(dto: ResetPasswordWithCodeDto): Promise<{
        message: string;
        status: string;
    }>;
    changePassword(request: RequestWithUser, dto: ChangePasswordDto): Promise<{
        message: string;
        status: string;
    }>;
    updateFcmToken(request: RequestWithUser, updateFcmTokenDto: UpdateFcmTokenDto): Promise<{
        message: string;
    }>;
}
