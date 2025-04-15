import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenManagerService } from './services/token-manager.service';
import { EmailService } from './services/email.service';
import { SessionManagerService } from './services/session-manager.service';
import { UserRegistrationService } from './services/user-registration.service';
import { AuthValidationService } from './services/auth-validation.service';
import { LocalAuthenticationService } from './services/local-authentication.service';
import { SocialAuthenticationService } from './services/social-authentication.service';
import { UserSessionService } from './services/user-session.service';
import { PasswordService } from './services/password.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    TokenManagerService,
    EmailService,
    SessionManagerService,
    UserRegistrationService,
    AuthValidationService,
    LocalAuthenticationService,
    SocialAuthenticationService,
    UserSessionService,
    PasswordService,
  ],
  exports: [AuthService, TokenManagerService],
})
export class AuthModule {}
