"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const prisma_service_1 = require("../../../prisma/prisma.service");
const email_verification_template_1 = require("../../../templates/email-verification.template");
const error_messages_1 = require("../../../common/constants/error-messages");
let EmailService = class EmailService {
    constructor(prisma) {
        this.prisma = prisma;
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            pool: true,
            maxConnections: 5,
            rateDelta: 1000,
            rateLimit: 5,
        });
    }
    createVerificationToken() {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        return { token, expiresAt };
    }
    async insertVerificationRecord(prisma, userId, token, expiresAt) {
        await prisma.email_verifications.create({
            data: {
                user_id: userId,
                token,
                expires_at: expiresAt,
                created_at: new Date(),
            },
        });
    }
    async createVerification(prisma, userId, email) {
        const { token, expiresAt } = this.createVerificationToken();
        await this.insertVerificationRecord(prisma, userId, token, expiresAt);
        return token;
    }
    async sendVerificationEmailByToken(email, token) {
        try {
            await this.sendVerificationEmail({
                email,
                verificationToken: token,
            });
            return true;
        }
        catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }
    async sendVerificationEmail({ email, verificationToken, }) {
        const verificationUrl = `${process.env.API_URL}/auth/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: {
                name: 'Sana İyi Usta',
                address: process.env.SMTP_FROM,
            },
            to: email,
            subject: 'E-posta Doğrulama - Sana İyi Usta',
            html: (0, email_verification_template_1.getEmailVerificationTemplate)(verificationUrl),
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                Importance: 'High',
                'X-Mailer': 'Sana İyi Usta Notification System',
            },
            priority: 'high',
        };
        return this.transporter.sendMail(mailOptions);
    }
    async processVerifiedUser(verification) {
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
    buildEmailVerificationUrl(email, status) {
        const params = new URLSearchParams({
            email: email,
            status: status,
        });
        return `sanaiyi-usta://email-verified?${params.toString()}`;
    }
    async verifyEmail({ token, }) {
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
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.INVALID_VERIFICATION_LINK);
        }
        if (verification.expires_at < new Date()) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.VERIFICATION_LINK_EXPIRED);
        }
        const existingVerification = verification.users.user_auth.some((auth) => auth.auth_provider === 'local' && auth.e_mail_verified);
        if (existingVerification) {
            return {
                redirectUrl: this.buildEmailVerificationUrl(verification.users.e_mail, 'already-verified'),
            };
        }
        await this.processVerifiedUser(verification);
        return {
            redirectUrl: this.buildEmailVerificationUrl(verification.users.e_mail, 'success'),
        };
    }
    async sendPasswordResetCode({ email, resetCode, }) {
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
            priority: 'high',
        };
        return this.transporter.sendMail(mailOptions);
    }
    getPasswordResetCodeTemplate(resetCode) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmailService);
//# sourceMappingURL=email.service.js.map