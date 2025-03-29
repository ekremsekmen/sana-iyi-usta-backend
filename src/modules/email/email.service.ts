import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { getEmailVerificationTemplate } from '../../templates/email-verification.template';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
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
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'E-posta Doğrulama - Sana İyi Usta',
      html: getEmailVerificationTemplate(verificationUrl),
    };

    return this.transporter.sendMail(mailOptions);
  }
}
