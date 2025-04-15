import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class PasswordService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async initiatePasswordResetWithCode(email: string): Promise<{message: string, status: string, socialProviders?: string[]}> {
    const user = await this.prisma.users.findUnique({
      where: { e_mail: email },
      include: {
        user_auth: true,
      },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.EMAIL_NOT_FOUND);
    }

    const hasLocalAuth = user.user_auth.some(auth => auth.auth_provider === 'local');
    const socialProviders = user.user_auth
      .filter(auth => auth.auth_provider !== 'local')
      .map(auth => auth.auth_provider);

    if (!hasLocalAuth && socialProviders.length > 0) {
      return {
        message: ERROR_MESSAGES.SOCIAL_AUTH_ONLY,
        status: 'social_auth_only',
        socialProviders: socialProviders
      };
    }

    if (!hasLocalAuth) {
      throw new NotFoundException(ERROR_MESSAGES.LOCAL_AUTH_NOT_FOUND);
    }

    // 6 haneli doğrulama kodu oluştur
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); 

    await this.prisma.$transaction([
      // Varolan kodları temizle
      this.prisma.password_reset_codes.deleteMany({
        where: { user_id: user.id },
      }),
      // Yeni kod oluştur
      this.prisma.password_reset_codes.create({
        data: {
          user_id: user.id,
          reset_code: resetCode,
          expires_at: expiresAt,
          is_verified: false
        },
      }),
    ]);

    try {
      await this.emailService.sendPasswordResetCode({
        email: user.e_mail,
        resetCode: resetCode,
      });
      return {
        message: ERROR_MESSAGES.PASSWORD_RESET_CODE_SENT,
        status: 'success',
      };
    } catch (error) {
      console.error('Şifre sıfırlama kodu gönderme hatası:', error);
      return {
        message: ERROR_MESSAGES.PASSWORD_RESET_CODE_SEND_FAILED,
        status: 'error',
      };
    }
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<{message: string, status: string, isValid: boolean}> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { e_mail: email },
        include: {
          password_reset_codes: true,
          user_auth: true,
        },
      });

      if (!user) {
        throw new BadRequestException(ERROR_MESSAGES.EMAIL_NOT_FOUND);
      }

      const hasLocalAuth = user.user_auth.some(auth => auth.auth_provider === 'local');
      
      if (!hasLocalAuth) {
        throw new BadRequestException(ERROR_MESSAGES.LOCAL_AUTH_NOT_FOUND);
      }

      if (!user.password_reset_codes.length) {
        throw new BadRequestException(ERROR_MESSAGES.INVALID_RESET_CODE);
      }

      const resetCode = user.password_reset_codes[0];
      
      if (resetCode.expires_at < new Date()) {
        await this.prisma.password_reset_codes.delete({
          where: { id: resetCode.id },
        });
        throw new BadRequestException(ERROR_MESSAGES.RESET_CODE_EXPIRED);
      }

      // Doğrudan kodu eşleştir (artık hash kullanmıyoruz)
      if (resetCode.reset_code !== code) {
        throw new BadRequestException(ERROR_MESSAGES.INVALID_RESET_CODE);
      }

      // Kodu doğrulandı olarak işaretle
      await this.prisma.password_reset_codes.update({
        where: { id: resetCode.id },
        data: { is_verified: true }
      });

      return {
        message: ERROR_MESSAGES.PASSWORD_RESET_CODE_VALID,
        status: 'success',
        isValid: true
      };
    } catch (error) {
      return {
        message: error instanceof BadRequestException ? error.message : 'Doğrulama kodu geçersiz',
        status: 'error',
        isValid: false
      };
    }
  }

  async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<{message: string, status: string}> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { e_mail: email },
        include: {
          password_reset_codes: true,
          user_auth: true,
        },
      });

      if (!user) {
        throw new BadRequestException(ERROR_MESSAGES.EMAIL_NOT_FOUND);
      }

      const localAuth = user.user_auth.find(auth => auth.auth_provider === 'local');
      if (!localAuth) {
        throw new BadRequestException(ERROR_MESSAGES.LOCAL_AUTH_NOT_FOUND);
      }

      const resetCode = user.password_reset_codes.find(rc => rc.reset_code === code && rc.is_verified);
      
      if (!resetCode) {
        throw new BadRequestException(ERROR_MESSAGES.INVALID_RESET_CODE);
      }
      
      if (resetCode.expires_at < new Date()) {
        await this.prisma.password_reset_codes.delete({
          where: { id: resetCode.id },
        });
        throw new BadRequestException(ERROR_MESSAGES.RESET_CODE_EXPIRED);
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.$transaction([
        this.prisma.user_auth.updateMany({
          where: {
            user_id: user.id,
            auth_provider: 'local',
          },
          data: { password_hash: hashedPassword },
        }),
        this.prisma.password_reset_codes.deleteMany({
          where: { user_id: user.id },
        }),
      ]);

      return {
        message: ERROR_MESSAGES.PASSWORD_RESET_SUCCESS,
        status: 'success',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      return {
        message: ERROR_MESSAGES.PASSWORD_RESET_FAILED,
        status: 'error',
      };
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string, newPasswordConfirm: string): Promise<{message: string, status: string}> {
    // Yeni şifreler aynı mı kontrol et
    if (newPassword !== newPasswordConfirm) {
      return {
        message: ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
        status: 'error',
      };
    }
    // Kullanıcıyı ve local auth'u bul
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        user_auth: true,
      },
    });
    if (!user) {
      return {
        message: ERROR_MESSAGES.EMAIL_NOT_FOUND,
        status: 'error',
      };
    }
    const localAuth = user.user_auth.find(auth => auth.auth_provider === 'local');
    if (!localAuth || !localAuth.password_hash) {
      return {
        message: ERROR_MESSAGES.LOCAL_AUTH_NOT_FOUND,
        status: 'error',
      };
    }
    // Eski şifre doğru mu kontrol et
    const isMatch = await bcrypt.compare(oldPassword, localAuth.password_hash);
    if (!isMatch) {
      return {
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        status: 'error',
      };
    }
    // Şifreyi güncelle
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user_auth.updateMany({
      where: {
        user_id: user.id,
        auth_provider: 'local',
      },
      data: { password_hash: hashedPassword },
    });
    return {
      message: ERROR_MESSAGES.PASSWORD_CHANGE_SUCCESS,
      status: 'success',
    };
  }
}
