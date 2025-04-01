import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { AuthValidationService } from './auth-validation.service';
import { UserRegistrationService } from './user-registration.service';
import { LoginDto } from '../dto/login.dto';
import { TokenService } from './token.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private authValidationService: AuthValidationService,
    private userRegistrationService: UserRegistrationService,
    private tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    await this.authValidationService.validateRegistration(registerDto);

    const existingUser = await this.prisma.users.findUnique({
      where: { e_mail: registerDto.e_mail },
      include: { user_auth: true },
    });

    const hashedPassword = registerDto.auth_provider === AuthProvider.LOCAL
      ? await bcrypt.hash(registerDto.password, 10)
      : null;

    if (existingUser) {
      await this.authValidationService.validateUserRole(
        existingUser.role,
        registerDto.role,
      );

      const existingAuth = existingUser.user_auth.find(
        (auth) => auth.auth_provider === registerDto.auth_provider,
      );

      if (existingAuth) {
        throw new ConflictException(
          'This authentication method is already linked to your account',
        );
      }

      return this.userRegistrationService.handleExistingUser(
        existingUser,
        registerDto,
        hashedPassword,
      );
    }

    return await this.prisma.$transaction((prisma) =>
      this.userRegistrationService.createNewUser(
        prisma,
        registerDto,
        hashedPassword,
      ),
    );
  }

  async validateUser(e_mail: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: { e_mail },
      include: {
        user_auth: {
          where: { auth_provider: 'local' },
          select: { password_hash: true, e_mail_verified: true },
        },
      },
    });

    if (!user || !user.user_auth.length) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userAuth = user.user_auth[0];

    if (!userAuth.password_hash || !await bcrypt.compare(password, userAuth.password_hash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!userAuth.e_mail_verified) {
      throw new UnauthorizedException('Email not verified');
    }

    const { user_auth, ...userWithoutAuth } = user;
    return userWithoutAuth;
  }

  async login(loginDto: LoginDto, request: Request) {
    const user = await this.validateUser(loginDto.e_mail, loginDto.password);

    const tokenData = await this.tokenService.generateTokens(user.id, user.role);

    await this.prisma.user_sessions.create({
      data: {
        user_id: user.id,
        device_id: request.headers['device-id'] as string || null,
        ip_address: request.ip || null,
        user_agent: request.headers['user-agent'] || null,
        fcm_token: request.headers['fcm-token'] as string || null,
      },
    });

    return {
      ...tokenData,
      user: {
        id: user.id,
        full_name: user.full_name,
        e_mail: user.e_mail,
        role: user.role,
      },
    };
  }

  async logout(userId: string, refreshToken: string) {
    try {
      const tokenEntries = await this.prisma.refresh_tokens.findMany({
        where: {
          user_id: userId,
        },
      });

      let tokenFound = false;
      for (const entry of tokenEntries) {
        const isMatch = await bcrypt.compare(refreshToken, entry.hashed_token);
        if (isMatch) {
          await this.prisma.refresh_tokens.delete({
            where: { id: entry.id },
          });
          tokenFound = true;
          break;
        }
      }

      if (!tokenFound) {
        return { 
          message: 'already logged out',
          status: 'warning'
        };
      }
      
      return { 
        message: 'Logged out successfully',
        status: 'success'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return { 
        message: 'Error during logout',
        status: 'error'
      };
    }
  }
}
