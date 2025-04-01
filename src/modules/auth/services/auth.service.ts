import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { AuthValidationService } from './auth-validation.service';
import { UserRegistrationService } from './user-registration.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private authValidationService: AuthValidationService,
    private userRegistrationService: UserRegistrationService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      await this.authValidationService.validateRegistration(registerDto);

      const existingUser = await this.prisma.users.findUnique({
        where: { e_mail: registerDto.e_mail },
        include: { user_auth: true },
      });

      let hashedPassword: string | null = null;
      if (registerDto.auth_provider === AuthProvider.LOCAL) {
        hashedPassword = await bcrypt.hash(registerDto.password, 10);
      }

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

      // Transaction içinde bir kez email gönderimi yapılacak
      const result = await this.prisma.$transaction(async (prisma) => {
        return await this.userRegistrationService.createNewUser(
          prisma,
          registerDto,
          hashedPassword,
        );
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async validateUser(e_mail: string, password: string): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { e_mail },
      include: {
        user_auth: true,
      },
    });

    if (!user) {
      return null;
    }

    const userAuth = user.user_auth.find(
      (auth) => auth.auth_provider === 'local',
    );

    if (!userAuth || !userAuth.password_hash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userAuth.password_hash,
    );

    if (!isPasswordValid) {
      return null;
    }

    delete user.user_auth;
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.e_mail, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userAuth = await this.prisma.user_auth.findFirst({
      where: {
        user_id: user.id,
        auth_provider: 'local',
      },
    });

    if (!userAuth.e_mail_verified) {
      throw new UnauthorizedException('Email not verified');
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
