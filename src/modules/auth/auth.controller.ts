import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
      throw new BadRequestException('Token gereklidir');
    }
    const result = await this.authService.verifyEmail(token);
    return res.redirect(result.redirectUrl);
  }
}
