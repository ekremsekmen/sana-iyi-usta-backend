import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { GoogleAuthDto, AppleAuthDto, FacebookAuthDto } from './dto/social-auth.dto';
import { AuthValidationService } from './services/auth-validation.service';
import { UserRegistrationService } from './services/user-registration.service';
import { LocalAuthenticationService } from './services/local-authentication.service';
import { SocialAuthenticationService } from './services/social-authentication.service';
import { UserSessionService } from './services/user-session.service';
import { PasswordService } from './services/password.service';
import { TokenManagerService } from './services/token-manager.service';
import { EmailService } from './services/email.service';
import { EmailVerificationResponseDto, VerifyEmailDto } from './dto/email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly registrationService: UserRegistrationService,
    private readonly authValidationService: AuthValidationService,
    private readonly localAuthService: LocalAuthenticationService,
    private readonly socialAuthService: SocialAuthenticationService,
    private readonly userSessionService: UserSessionService,
    private readonly passwordService: PasswordService,
    private readonly tokenManager: TokenManagerService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    await this.authValidationService.validateRegistration(registerDto);
    return this.registrationService.registerUser(registerDto);
  }

  async validateUser(e_mail: string, password: string) {
    return this.localAuthService.authenticateUser(e_mail, password);
  }
 
  async login(loginDto: LoginDto, request: Request) {
    const user = await this.localAuthService.authenticateUser(loginDto.e_mail, loginDto.password);
    return this.userSessionService.createUserSession(user, request);
  }
  
  async socialLogin(userInfo: any, provider: string, request: Request) {
    const user = await this.socialAuthService.handleSocialUser(userInfo, provider);
    return this.userSessionService.createUserSession(user, request);
  }

  async googleMobileLogin(googleAuthDto: GoogleAuthDto, request: Request) {
    const user = await this.socialAuthService.authenticateWithGoogle(googleAuthDto);
    return this.userSessionService.createUserSession(user, request);
  }

  async appleMobileLogin(appleAuthDto: AppleAuthDto, request: Request) {
    const user = await this.socialAuthService.authenticateWithApple(appleAuthDto);
    return this.userSessionService.createUserSession(user, request);
  }

  async facebookMobileLogin(facebookAuthDto: FacebookAuthDto, request: Request) {
    const user = await this.socialAuthService.authenticateWithFacebook(facebookAuthDto);
    return this.userSessionService.createUserSession(user, request);
  }

  async logout(userId: string, refreshToken: string) {
    return this.userSessionService.logout(userId, refreshToken);
  }

  async refreshToken(refreshToken: string) {
    return this.tokenManager.refreshAccessToken(refreshToken);
  }

  async initiatePasswordReset(email: string) {
    return this.passwordService.initiatePasswordResetWithCode(email);
  }

  async verifyPasswordResetCode(email: string, code: string) {
    return this.passwordService.verifyPasswordResetCode(email, code);
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    return this.passwordService.resetPasswordWithCode(email, code, newPassword);
  }

  async changePassword(userId: string, dto: { oldPassword: string; newPassword: string; newPasswordConfirm: string }) {
    return this.passwordService.changePassword(userId, dto.oldPassword, dto.newPassword, dto.newPasswordConfirm);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<EmailVerificationResponseDto> {
    return this.emailService.verifyEmail(verifyEmailDto);
  }
}