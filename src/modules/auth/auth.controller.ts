import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Get('verify-email')
  @Redirect()
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token gereklidir');
    }
    return await this.authService.verifyEmail(token);
  }
}
