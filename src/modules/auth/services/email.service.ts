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

  async createVerification(
    prisma: Prisma.TransactionClient,
    userId: string,
    email: string,
  ) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.email_verifications.create({
      data: {
        user_id: userId,
        token: verificationToken,
        expires_at: expiresAt,
        created_at: new Date(),
      },
    });

    try {
      await this.sendVerificationEmail({
        email: email,
        verificationToken: verificationToken,
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
      const verifiedUser = await this.prisma.user_auth.findFirst({
        where: {
          auth_provider: 'local',
          e_mail_verified: true,
          users: {
            e_mail: verification?.users?.e_mail,
          },
        },
        include: {
          users: true,
        },
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

    return {
      redirectUrl: this.buildEmailVerificationUrl(
        verification.users.e_mail,
        'success',
      ),
    };
  }
}
