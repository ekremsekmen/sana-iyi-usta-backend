import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailService } from './services/email.service';
import { AuthValidationService } from './services/auth-validation.service';
import { UserRegistrationService } from './services/user-registration.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    AuthValidationService,
    UserRegistrationService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
