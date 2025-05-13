import { Controller, Post, Body, Get, Query, UseGuards, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { EmailVerificationResponseDto, VerifyEmailDto } from './dto/email.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtGuard } from '../../common/guards';
import { Throttle } from '@nestjs/throttler';
import { GoogleAuthDto, AppleAuthDto, FacebookAuthDto } from './dto/social-auth.dto';
import { 
  RequestPasswordResetDto, 
  ResetPasswordWithCodeDto, 
  VerifyResetCodeDto, 
  ChangePasswordDto
} from './dto/password.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { Request } from 'express';
import { RegistrationResult } from './services/user-registration.service';
import { UpdateFcmTokenDto } from './dto/fcm-token.dto';
import { getEmailVerificationSuccessTemplate } from '../../templates/email-verification-success.template';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED) 
  async register(@Body() registerDto: RegisterDto): Promise<RegistrationResult> {
    return await this.authService.register(registerDto);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK) 
  async verifyEmail(
    @Query() verifyEmailDto: VerifyEmailDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.authService.verifyEmail(verifyEmailDto);
    
   
    const userAgent = req.headers['user-agent'] || '';
    const isBrowser = /Mozilla|Chrome|Safari|Firefox|Edge/i.test(userAgent);
    
    if (isBrowser) {
      return res.send(getEmailVerificationSuccessTemplate());
    }
    
    // Return JSON for API requests
    return res.json(result);
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
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK) 
  async logout(@Req() request: RequestWithUser, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(request.user.id, refreshTokenDto.refresh_token);
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
  async changePassword(@Req() request: RequestWithUser, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(request.user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Post('update-fcm-token')
  @HttpCode(HttpStatus.OK)
  async updateFcmToken(
    @Req() request: RequestWithUser,
    @Body() updateFcmTokenDto: UpdateFcmTokenDto
  ) {
    return this.authService.updateFcmToken(request.user.id, updateFcmTokenDto.fcm_token);
  }
}
