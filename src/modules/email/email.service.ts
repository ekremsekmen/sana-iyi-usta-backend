import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { getEmailVerificationTemplate } from '../../templates/email-verification.template';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, verificationToken: string) {
    const verificationUrl = `${process.env.API_URL}/email/verify?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'E-posta Doğrulama - Sana İyi Usta',
      html: getEmailVerificationTemplate(verificationUrl),
    };

    return this.transporter.sendMail(mailOptions);
  }

  private buildEmailVerificationUrl(email: string, status: string): string {
    const params = new URLSearchParams({
      email: email,
      status: status,
    });
    return `sanaiyi-usta://email-verified?${params.toString()}`;
  }

  async verifyEmail(token: string) {
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
      const verifiedUser = await this.prisma.user_auth.findFirst({
        where: { e_mail_verified: true },
        include: { users: true },
      });

      if (verifiedUser) {
        return {
          redirectUrl: this.buildEmailVerificationUrl(
            verifiedUser.users.e_mail,
            'already-verified',
          ),
        };
      }

      throw new NotFoundException('Invalid verification link');
    }

    if (verification.expires_at < new Date()) {
      throw new BadRequestException('Verification link expired');
    }

    const existingVerification = verification.users.user_auth.some(
      (auth) => auth.e_mail_verified,
    );

    if (existingVerification) {
      return {
        redirectUrl: this.buildEmailVerificationUrl(
          verification.users.e_mail,
          'already-verified',
        ),
      };
    }

    await this.prisma.$transaction([
      this.prisma.user_auth.updateMany({
        where: { user_id: verification.user_id },
        data: { e_mail_verified: true },
      }),
      this.prisma.email_verifications.delete({
        where: { id: verification.id },
      }),
    ]);

    return {
      redirectUrl: this.buildEmailVerificationUrl(
        verification.users.e_mail,
        'success',
      ),
    };
  }
}
