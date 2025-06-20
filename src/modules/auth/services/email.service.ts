import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { getEmailVerificationTemplate } from '../../../templates/email-verification.template';
import {
  SendVerificationEmailDto,
  EmailVerificationResponseDto,
  VerifyEmailDto,
} from '../dto/email.dto';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

// DTO tanımları
interface SendPasswordResetCodeDto {
  email: string;
  resetCode: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private prisma: PrismaService) {
    // Optimize edilmiş transporter yapılandırması
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      pool: true, // Bağlantı havuzu kullanarak performansı artır
      maxConnections: 5,
      rateDelta: 1000,
      rateLimit: 5,
    });
  }

  private createVerificationToken() {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    return { token, expiresAt };
  }

  private async insertVerificationRecord(
    prisma: Prisma.TransactionClient | PrismaService,
    userId: string,
    token: string,
    expiresAt: Date,
  ) {
    await prisma.email_verifications.create({
      data: {
        user_id: userId,
        token,
        expires_at: expiresAt,
        created_at: new Date(),
      },
    });
  }

  async createVerification(
    prisma: Prisma.TransactionClient | PrismaService,
    userId: string,
    email: string,
  ): Promise<string> {
    const { token, expiresAt } = this.createVerificationToken();
    await this.insertVerificationRecord(prisma, userId, token, expiresAt);
    return token;
  }

  async sendVerificationEmailByToken(
    email: string,
    token: string,
  ): Promise<boolean> {
    try {
      await this.sendVerificationEmail({
        email,
        verificationToken: token,
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendVerificationEmail({
    email,
    verificationToken,
  }: SendVerificationEmailDto) {
    const verificationUrl = `${process.env.API_URL}/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: {
        name: 'Sana İyi Usta',
        address: process.env.SMTP_FROM,
      },
      to: email,
      subject: 'E-posta Doğrulama - Sana İyi Usta',
      html: getEmailVerificationTemplate(verificationUrl),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        Importance: 'High',
        'X-Mailer': 'Sana İyi Usta Notification System',
      },
      priority: 'high' as const, // 'string' -> 'high' olarak sabitleme
    };

    return this.transporter.sendMail(mailOptions);
  }

  private async processVerifiedUser(verification: any) {
    await this.prisma.$transaction([
      this.prisma.user_auth.updateMany({
        where: {
          user_id: verification.user_id,
          auth_provider: 'local',
        },
        data: { e_mail_verified: true },
      }),
      this.prisma.email_verifications.delete({
        where: { id: verification.id },
      }),
    ]);
  }

  private buildEmailVerificationUrl(email: string, status: string): string {
    const params = new URLSearchParams({
      email: email,
      status: status,
    });
    return `sanaiyi-usta://email-verified?${params.toString()}`;
  }

  async verifyEmail({
    token,
  }: VerifyEmailDto): Promise<EmailVerificationResponseDto> {
    const verification = await this.prisma.email_verifications.findUnique({
      where: { token },
      include: {
        users: {
          include: {
            user_auth: true,
          },
        },
      },
    });

    if (!verification) {
      throw new NotFoundException(ERROR_MESSAGES.INVALID_VERIFICATION_LINK);
    }

    if (verification.expires_at < new Date()) {
      throw new BadRequestException(ERROR_MESSAGES.VERIFICATION_LINK_EXPIRED);
    }

    const existingVerification = verification.users.user_auth.some(
      (auth) => auth.auth_provider === 'local' && auth.e_mail_verified,
    );

    if (existingVerification) {
      return {
        redirectUrl: this.buildEmailVerificationUrl(
          verification.users.e_mail,
          'already-verified',
        ),
      };
    }

    await this.processVerifiedUser(verification);

    return {
      redirectUrl: this.buildEmailVerificationUrl(
        verification.users.e_mail,
        'success',
      ),
    };
  }

  // Şifre sıfırlama kodu gönderme
  async sendPasswordResetCode({
    email,
    resetCode,
  }: SendPasswordResetCodeDto) {
    const mailOptions = {
      from: {
        name: 'Sana İyi Usta',
        address: process.env.SMTP_FROM,
      },
      to: email,
      subject: 'Şifre Sıfırlama Kodu - Sana İyi Usta',
      html: this.getPasswordResetCodeTemplate(resetCode),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        Importance: 'High',
        'X-Mailer': 'Sana İyi Usta Notification System',
      },
      priority: 'high' as const, 
    };

    return this.transporter.sendMail(mailOptions);
  }

  // 6 haneli kod için e-posta şablonu
  private getPasswordResetCodeTemplate(resetCode: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>Şifre Sıfırlama Kodu</h2>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <p>Şifrenizi sıfırlamak için aşağıdaki doğrulama kodunu kullanın:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; padding: 15px; background-color: #e9f0ff; border-radius: 10px; display: inline-block;">
              ${resetCode}
            </div>
          </div>
          <p>Bu kod 15 dakika boyunca geçerlidir.</p>
          <p>Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
        <div style="margin-top: 20px; font-size: 12px; color: #6c757d; text-align: center;">
          <p>© ${new Date().getFullYear()} Sana İyi Usta. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `;
  }
}
