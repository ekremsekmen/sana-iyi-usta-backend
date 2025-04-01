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

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.e_mail, loginDto.password);

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        role: user.role,
      }),
    };
  }
}
