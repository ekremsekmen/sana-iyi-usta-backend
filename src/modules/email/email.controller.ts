import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token gereklidir');
    }
    return await this.emailService.verifyEmail(token);
  }
}
