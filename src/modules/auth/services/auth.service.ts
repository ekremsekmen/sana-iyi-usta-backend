import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, AuthProvider } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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

  async register(registerDto: RegisterDto) {
    try {
      if (registerDto.provider_id) {
        const existingAuth = await this.findExistingAuth(
          registerDto.auth_provider,
          registerDto.provider_id,
        );

        if (existingAuth) {
          throw new ConflictException('Account already exists');
        }
      }

      const existingUser = await this.prisma.users.findUnique({
        where: { e_mail: registerDto.e_mail },
        include: { user_auth: true },
      });

      let hashedPassword: string | null = null;
      if (registerDto.auth_provider === AuthProvider.LOCAL) {
        if (!registerDto.password) {
          throw new ConflictException('Password is required');
        }
        hashedPassword = await bcrypt.hash(registerDto.password, 10);
      }

      if (existingUser) {
        const existingAuth = existingUser.user_auth.find(
          (auth) => auth.auth_provider === registerDto.auth_provider,
        );

        if (existingAuth) {
          throw new ConflictException('Authentication method already exists');
        }

        await this.prisma.user_auth.create({
          data: {
            user_id: existingUser.id,
            password_hash: hashedPassword,
            kvkk_approved: registerDto.kvkk_approved,
            terms_approved: registerDto.terms_approved,
            auth_provider: registerDto.auth_provider,
            provider_id: registerDto.provider_id,
          },
        });

        return { userId: existingUser.id };
      }

      const result = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.users.create({
          data: {
            full_name: registerDto.full_name,
            e_mail: registerDto.e_mail,
            role: registerDto.role,
            created_at: new Date(),
          },
        });

        await prisma.user_auth.create({
          data: {
            user_id: user.id,
            password_hash: hashedPassword,
            kvkk_approved: registerDto.kvkk_approved,
            terms_approved: registerDto.terms_approved,
            auth_provider: registerDto.auth_provider,
            provider_id: registerDto.provider_id,
            e_mail_verified: false,
          },
        });

        if (registerDto.auth_provider === AuthProvider.LOCAL) {
          const verificationToken = crypto.randomBytes(32).toString('hex');
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24);

          await prisma.email_verifications.create({
            data: {
              user_id: user.id,
              token: verificationToken,
              expires_at: expiresAt,
              created_at: new Date(),
            },
          });

          try {
            await this.emailService.sendVerificationEmail({
              email: registerDto.e_mail,
              verificationToken: verificationToken,
            });
            return { userId: user.id, verificationEmailSent: true };
          } catch (error) {
            console.error('Email sending failed:', error);
            return { userId: user.id, verificationEmailSent: false };
          }
        }

        return { userId: user.id };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
