import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async findExistingAuth(provider: string, providerId: string) {
    return this.prisma.user_auth.findFirst({
      where: {
        auth_provider: provider,
        provider_id: providerId,
      },
      include: {
        users: true,
      },
    });
  }

  private async validateRegistration(registerDto: RegisterDto) {
    if (registerDto.provider_id) {
      const existingAuth = await this.findExistingAuth(
        registerDto.auth_provider,
        registerDto.provider_id,
      );
      if (existingAuth) {
        throw new ConflictException('Account already exists');
      }
    }

    if (
      registerDto.auth_provider === AuthProvider.LOCAL &&
      !registerDto.password
    ) {
      throw new ConflictException('Password is required');
    }
  }

  private async handleExistingUser(
    existingUser: any,
    registerDto: RegisterDto,
    hashedPassword: string | null,
  ) {
    const existingAuth = existingUser.user_auth.find(
      (auth: { auth_provider: AuthProvider }) =>
        auth.auth_provider === registerDto.auth_provider,
    );

    if (existingAuth) {
      throw new ConflictException('Authentication method already exists');
    }

    await this.prisma.user_auth.create({
      data: this.createUserAuthData(
        existingUser.id,
        registerDto,
        hashedPassword,
      ),
    });

    return { userId: existingUser.id };
  }

  private createUserAuthData(
    userId: string,
    registerDto: RegisterDto,
    hashedPassword: string | null,
  ) {
    return {
      user_id: userId,
      password_hash: hashedPassword,
      kvkk_approved: registerDto.kvkk_approved,
      terms_approved: registerDto.terms_approved,
      auth_provider: registerDto.auth_provider,
      provider_id: registerDto.provider_id,
      e_mail_verified: false,
    };
  }

  private async createNewUser(
    prisma: any,
    registerDto: RegisterDto,
    hashedPassword: string | null,
  ) {
    const user = await prisma.users.create({
      data: {
        full_name: registerDto.full_name,
        e_mail: registerDto.e_mail,
        role: registerDto.role,
        created_at: new Date(),
      },
    });

    await prisma.user_auth.create({
      data: this.createUserAuthData(user.id, registerDto, hashedPassword),
    });

    if (registerDto.auth_provider === AuthProvider.LOCAL) {
      const verificationEmailSent = await this.emailService.createVerification(
        prisma,
        user.id,
        registerDto.e_mail,
      );
      return { userId: user.id, verificationEmailSent };
    }

    return { userId: user.id };
  }

  async register(registerDto: RegisterDto) {
    try {
      await this.validateRegistration(registerDto);

      const existingUser = await this.prisma.users.findUnique({
        where: { e_mail: registerDto.e_mail },
        include: { user_auth: true },
      });

      let hashedPassword: string | null = null;
      if (registerDto.auth_provider === AuthProvider.LOCAL) {
        hashedPassword = await bcrypt.hash(registerDto.password, 10);
      }

      if (existingUser) {
        return this.handleExistingUser(
          existingUser,
          registerDto,
          hashedPassword,
        );
      }

      return await this.prisma.$transaction((prisma) =>
        this.createNewUser(prisma, registerDto, hashedPassword),
      );
    } catch (error) {
      throw error;
    }
  }
}
