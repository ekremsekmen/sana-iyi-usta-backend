import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailService } from './services/email.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
