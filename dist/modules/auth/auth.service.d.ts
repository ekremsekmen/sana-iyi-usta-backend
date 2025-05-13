import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { GoogleAuthDto, AppleAuthDto, FacebookAuthDto } from './dto/social-auth.dto';
import { AuthValidationService } from './services/auth-validation.service';
import { UserRegistrationService, RegistrationResult } from './services/user-registration.service';
import { LocalAuthenticationService } from './services/local-authentication.service';
import { SocialAuthenticationService } from './services/social-authentication.service';
import { UserSessionService } from './services/user-session.service';
import { PasswordService } from './services/password.service';
import { TokenManagerService } from './services/token-manager.service';
import { EmailService } from './services/email.service';
import { EmailVerificationResponseDto, VerifyEmailDto } from './dto/email.dto';
export declare class AuthService {
    private readonly registrationService;
    private readonly authValidationService;
    private readonly localAuthService;
    private readonly socialAuthService;
    private readonly userSessionService;
    private readonly passwordService;
    private readonly tokenManager;
    private readonly emailService;
    constructor(registrationService: UserRegistrationService, authValidationService: AuthValidationService, localAuthService: LocalAuthenticationService, socialAuthService: SocialAuthenticationService, userSessionService: UserSessionService, passwordService: PasswordService, tokenManager: TokenManagerService, emailService: EmailService);
    register(registerDto: RegisterDto): Promise<RegistrationResult>;
    validateUser(e_mail: string, password: string): Promise<{
        full_name: string;
        e_mail: string;
        role: string;
        id: string;
        created_at: Date;
        phone_number: string | null;
        profile_image: string | null;
        default_location_id: string | null;
    }>;
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
    socialLogin(userInfo: any, provider: string, request: Request): Promise<{
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
    googleMobileLogin(googleAuthDto: GoogleAuthDto, request: Request): Promise<{
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
    appleMobileLogin(appleAuthDto: AppleAuthDto, request: Request): Promise<{
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
    facebookMobileLogin(facebookAuthDto: FacebookAuthDto, request: Request): Promise<{
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
    logout(userId: string, refreshToken: string): Promise<{
        message: string;
        status: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
    initiatePasswordReset(email: string): Promise<{
        message: string;
        status: string;
        socialProviders?: string[];
    }>;
    verifyPasswordResetCode(email: string, code: string): Promise<{
        message: string;
        status: string;
        isValid: boolean;
    }>;
    resetPassword(email: string, code: string, newPassword: string): Promise<{
        message: string;
        status: string;
    }>;
    changePassword(userId: string, dto: {
        oldPassword: string;
        newPassword: string;
        newPasswordConfirm: string;
    }): Promise<{
        message: string;
        status: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<EmailVerificationResponseDto>;
    updateFcmToken(userId: string, fcmToken: string): Promise<{
        message: string;
    }>;
}
