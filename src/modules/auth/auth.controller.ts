import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from './services/email.service';
import { EmailVerificationResponseDto } from './dto/email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Get('/verify-email')
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<EmailVerificationResponseDto> {
    return await this.emailService.verifyEmail(token);
  }
}
