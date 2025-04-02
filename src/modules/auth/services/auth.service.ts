import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Request } from 'express';
import { GoogleAuthDto, AppleAuthDto, FacebookAuthDto } from '../dto/social-auth.dto';

// Servis injectionları
import { AuthValidationService } from './auth-validation.service';
import { UserRegistrationService } from './user-registration.service';
import { LocalAuthenticationService } from './local-authentication.service';
import { SocialAuthenticationService } from './social-authentication.service';
import { UserSessionService } from './user-session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly registrationService: UserRegistrationService,
    private readonly authValidationService: AuthValidationService,
    private readonly localAuthService: LocalAuthenticationService,
    private readonly socialAuthService: SocialAuthenticationService,
    private readonly userSessionService: UserSessionService,
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

  async facebookLoginCallback(req: Request, profile: any) {
    const user = await this.socialAuthService.processFacebookCallback(req, profile);
    return this.userSessionService.createUserSession(user, req);
  }

  async logout(userId: string, refreshToken: string) {
    return this.userSessionService.logout(userId, refreshToken);
  }

  async refreshToken(refreshToken: string) {
    return this.userSessionService.refreshAccessToken(refreshToken);
  }
}