import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';
import { EmailService } from './email.service';

@Injectable()
export class UserRegistrationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async handleExistingUser(
    existingUser: any,
    registerDto: RegisterDto,
    hashedPassword: string | null,
  ) {
    await this.prisma.user_auth.create({
      data: this.createUserAuthData(
        existingUser.id,
        registerDto,
        hashedPassword,
      ),
    });

    if (registerDto.auth_provider === AuthProvider.LOCAL) {
      const verificationEmailSent = await this.emailService.createVerification(
        this.prisma,
        existingUser.id,
        registerDto.e_mail,
      );
      return {
        userId: existingUser.id,
        verificationEmailSent,
        message: 'New authentication method added successfully',
      };
    }

    return {
      userId: existingUser.id,
      message: 'New authentication method added successfully',
    };
  }

  createUserAuthData(
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
      e_mail_verified: registerDto.auth_provider !== AuthProvider.LOCAL,
    };
  }

  async createNewUser(
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
}
