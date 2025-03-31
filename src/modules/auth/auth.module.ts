import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailService } from './services/email.service';
import { AuthValidationService } from './services/auth-validation.service';
import { UserRegistrationService } from './services/user-registration.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    AuthValidationService,
    UserRegistrationService,
  ],
})
export class AuthModule {}
