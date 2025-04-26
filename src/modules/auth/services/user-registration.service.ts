import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

// Kayıt işlemi sonucu için interface tanımı
export interface RegistrationResult {
  userId: string;
  verificationEmailSent?: boolean;
  message?: string;
}

@Injectable()
export class UserRegistrationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { e_mail: registerDto.e_mail },
      include: { user_auth: true },
    });

    const hashedPassword = registerDto.auth_provider === AuthProvider.LOCAL
      ? await bcrypt.hash(registerDto.password, 10)
      : null;

    if (existingUser) {
      const existingAuth = existingUser.user_auth.find(
        (auth) => auth.auth_provider === registerDto.auth_provider,
      );

      if (existingAuth) {
        throw new ConflictException(ERROR_MESSAGES.AUTH_METHOD_ALREADY_LINKED);
      }

      return this.handleExistingUser(
        existingUser,
        registerDto,
        hashedPassword,
      );
    }

    let result: RegistrationResult;
    let verificationToken = null;
    
    await this.prisma.$transaction(async (prisma) => {
      result = await this.createNewUser(
        prisma,
        registerDto,
        hashedPassword,
      );
      
      if (registerDto.auth_provider === AuthProvider.LOCAL) {
        verificationToken = await this.emailService.createVerification(
          prisma,
          result.userId,
          registerDto.e_mail,
        );
      }
    });
    
    // Transaction dışında e-posta gönderimi
    if (registerDto.auth_provider === AuthProvider.LOCAL && verificationToken) {
      const verificationEmailSent = await this.emailService.sendVerificationEmailByToken(
        registerDto.e_mail,
        verificationToken
      );
      result.verificationEmailSent = verificationEmailSent;
    }

    return result;
  }

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

    let verificationEmailSent = false;
    
    if (registerDto.auth_provider === AuthProvider.LOCAL) {
      const verificationToken = await this.emailService.createVerification(
        this.prisma,
        existingUser.id,
        registerDto.e_mail,
      );
      
      // Transaction dışında e-posta gönderimi
      verificationEmailSent = await this.emailService.sendVerificationEmailByToken(
        registerDto.e_mail,
        verificationToken
      );
    }

    return {
      userId: existingUser.id,
      verificationEmailSent,
      message: ERROR_MESSAGES.NEW_AUTH_METHOD_ADDED,
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
  ): Promise<RegistrationResult> {
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

    return { userId: user.id };
  }
}
