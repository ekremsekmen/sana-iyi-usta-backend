import { Controller, Post, Body, Get, Query, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenManagerService } from './services/token-manager.service';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from './services/email.service';
import { EmailVerificationResponseDto, VerifyEmailDto } from './dto/email.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request } from 'express';
import { JwtGuard } from '../../common/guards';
import { Throttle } from '@nestjs/throttler';
import { GoogleAuthDto, AppleAuthDto, FacebookAuthDto } from './dto/social-auth.dto';
import { 
  RequestPasswordResetDto, 
  ResetPasswordWithCodeDto, 
  VerifyResetCodeDto, 
  ChangePasswordDto
} from './dto/password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly tokenManager: TokenManagerService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED) 
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK) 
  async verifyEmail(
    @Query() verifyEmailDto: VerifyEmailDto,
  ): Promise<EmailVerificationResponseDto> {
    return await this.emailService.verifyEmail(verifyEmailDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @HttpCode(HttpStatus.OK) 
  async login(@Body() loginDto: LoginDto, @Req() request: Request) {
    return this.authService.login(loginDto, request);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.tokenManager.refreshAccessToken(refreshTokenDto.refresh_token);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK) 
  async logout(@Req() request: Request, @Body() refreshTokenDto: RefreshTokenDto) {
    const user = request.user as { id: string, role: string };
    return this.authService.logout(user.id, refreshTokenDto.refresh_token);
  }

  @Post('google/mobile')
  @HttpCode(HttpStatus.OK)
  async googleMobileAuth(@Body() googleAuthDto: GoogleAuthDto, @Req() req: Request) {
    return this.authService.googleMobileLogin(googleAuthDto, req);
  }

  @Post('apple/mobile')
  @HttpCode(HttpStatus.OK)
  async appleMobileAuth(@Body() appleAuthDto: AppleAuthDto, @Req() req: Request) {
    return this.authService.appleMobileLogin(appleAuthDto, req);
  }
  
  @Post('facebook/mobile')
  @HttpCode(HttpStatus.OK)
  async facebookMobileAuth(@Body() facebookAuthDto: FacebookAuthDto, @Req() req: Request) {
    return this.authService.facebookMobileLogin(facebookAuthDto, req);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: RequestPasswordResetDto) {
    return this.authService.initiatePasswordReset(dto.email);
  }

  // Yeni endpoint ekliyoruz - doğrulama kodunu kontrol etmek için
  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  async verifyResetCode(@Body() dto: VerifyResetCodeDto) {
    return this.authService.verifyPasswordResetCode(dto.email, dto.code);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordWithCodeDto) {
    return this.authService.resetPassword(dto.email, dto.code, dto.newPassword);
  }

  @UseGuards(JwtGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() request: Request, @Body() dto: ChangePasswordDto) {
    const user = request.user as { id: string };
    return this.authService.changePassword(user.id, dto);
  }
}
