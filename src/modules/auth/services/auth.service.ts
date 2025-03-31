import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';
import { AuthValidationService } from './auth-validation.service';
import { UserRegistrationService } from './user-registration.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private authValidationService: AuthValidationService,
    private userRegistrationService: UserRegistrationService,
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

      return await this.prisma.$transaction((prisma) =>
        this.userRegistrationService.createNewUser(
          prisma,
          registerDto,
          hashedPassword,
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
