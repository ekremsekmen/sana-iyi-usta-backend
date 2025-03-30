import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    return await this.emailService.verifyEmail(verifyEmailDto.token);
  }
}
