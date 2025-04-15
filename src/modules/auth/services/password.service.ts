import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';

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
      throw new NotFoundException('Bu e-posta adresi ile kayıtlı bir hesap bulunamadı');
    }

    const hasLocalAuth = user.user_auth.some(auth => auth.auth_provider === 'local');
    const socialProviders = user.user_auth
      .filter(auth => auth.auth_provider !== 'local')
      .map(auth => auth.auth_provider);

    if (!hasLocalAuth && socialProviders.length > 0) {
      return {
        message: 'Bu hesap sadece sosyal medya ile giriş yapmaktadır. Lütfen aşağıdaki yöntemlerden birini kullanın:',
        status: 'social_auth_only',
        socialProviders: socialProviders
      };
    }

    if (!hasLocalAuth) {
      throw new NotFoundException('Bu e-posta adresi ile kayıtlı bir yerel hesap bulunamadı');
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
        message: 'Şifre sıfırlama kodu e-posta adresinize gönderildi',
        status: 'success',
      };
    } catch (error) {
      console.error('Şifre sıfırlama kodu gönderme hatası:', error);
      return {
        message: 'Şifre sıfırlama kodu gönderilemedi',
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
        throw new BadRequestException('Bu e-posta adresi ile kayıtlı bir hesap bulunamadı');
      }

      const hasLocalAuth = user.user_auth.some(auth => auth.auth_provider === 'local');
      
      if (!hasLocalAuth) {
        throw new BadRequestException('Bu hesap yerel şifre sıfırlama işlemi için uygun değil');
      }

      if (!user.password_reset_codes.length) {
        throw new BadRequestException('Geçersiz doğrulama kodu veya süresi dolmuş istek');
      }

      const resetCode = user.password_reset_codes[0];
      
      if (resetCode.expires_at < new Date()) {
        await this.prisma.password_reset_codes.delete({
          where: { id: resetCode.id },
        });
        throw new BadRequestException('Doğrulama kodunun süresi dolmuş');
      }

      // Doğrudan kodu eşleştir (artık hash kullanmıyoruz)
      if (resetCode.reset_code !== code) {
        throw new BadRequestException('Geçersiz doğrulama kodu');
      }

      // Kodu doğrulandı olarak işaretle
      await this.prisma.password_reset_codes.update({
        where: { id: resetCode.id },
        data: { is_verified: true }
      });

      return {
        message: 'Doğrulama kodu geçerli. Yeni şifrenizi belirleyebilirsiniz.',
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
        throw new BadRequestException('Bu e-posta adresi ile kayıtlı bir hesap bulunamadı');
      }

      const localAuth = user.user_auth.find(auth => auth.auth_provider === 'local');
      if (!localAuth) {
        throw new BadRequestException('Bu hesap yerel şifre sıfırlama işlemi için uygun değil');
      }

      const resetCode = user.password_reset_codes.find(rc => rc.reset_code === code && rc.is_verified);
      
      if (!resetCode) {
        throw new BadRequestException('Geçersiz veya doğrulanmamış kod');
      }
      
      if (resetCode.expires_at < new Date()) {
        await this.prisma.password_reset_codes.delete({
          where: { id: resetCode.id },
        });
        throw new BadRequestException('Doğrulama kodunun süresi dolmuş');
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
        message: 'Şifreniz başarıyla sıfırlandı',
        status: 'success',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      return {
        message: 'Şifre sıfırlama başarısız oldu',
        status: 'error',
      };
    }
  }
}
