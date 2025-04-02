import { Controller, Post, Body, Get, Query, UseGuards, HttpCode, HttpStatus, Req, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TokenManagerService } from './services/token-manager.service';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from './services/email.service';
import { EmailVerificationResponseDto, VerifyEmailDto } from './dto/email.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthDto, AppleAuthDto } from './dto/social-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly tokenManager: TokenManagerService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // Limit artırıldı, süre kısaltıldı
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
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // Limit artırıldı
  @HttpCode(HttpStatus.OK) 
  async login(@Body() loginDto: LoginDto, @Req() request: Request) {
    return this.authService.login(loginDto, request);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // Limit artırıldı
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.tokenManager.refreshAccessToken(refreshTokenDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK) 
  async logout(@Req() request: Request, @Body() refreshTokenDto: RefreshTokenDto) {
    const user = request.user as { id: string, role: string };
    return this.authService.logout(user.id, refreshTokenDto.refresh_token);
  }

 
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  async googleWebAuth(@Body() googleAuthDto: GoogleAuthDto, @Req() req: Request) {
    return this.authService.googleMobileLogin(googleAuthDto, req);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.socialLogin(req.user, 'google', req);
    

    const redirectUrl = process.env.CLIENT_LOGIN_SUCCESS_URL;
    return res.redirect(`${redirectUrl}?token=${result.access_token}&refreshToken=${result.refresh_token}`);
  }

  @Post('google/mobile')
  @HttpCode(HttpStatus.OK)
  async googleMobileAuth(@Body() googleAuthDto: GoogleAuthDto, @Req() req: Request) {
    return this.authService.googleMobileLogin(googleAuthDto, req);
  }

  // Apple Auth Endpoints
  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleAuth() {
  }

  @Post('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.socialLogin(req.user, 'icloud', req);
    

    const redirectUrl = process.env.CLIENT_LOGIN_SUCCESS_URL;
    return res.redirect(`${redirectUrl}?token=${result.access_token}&refreshToken=${result.refresh_token}`);
  }


  @Post('apple/mobile')
  @HttpCode(HttpStatus.OK)
  async appleMobileAuth(@Body() appleAuthDto: AppleAuthDto, @Req() req: Request) {
    return this.authService.appleMobileLogin(appleAuthDto, req);
  }
}
