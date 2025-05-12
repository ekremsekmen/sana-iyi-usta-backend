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
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const email_service_1 = require("./email.service");
const bcrypt = require("bcrypt");
const error_messages_1 = require("../../../common/constants/error-messages");
let PasswordService = class PasswordService {
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async initiatePasswordResetWithCode(email) {
        const user = await this.prisma.users.findUnique({
            where: { e_mail: email },
            include: {
                user_auth: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.EMAIL_NOT_FOUND);
        }
        const hasLocalAuth = user.user_auth.some(auth => auth.auth_provider === 'local');
        const socialProviders = user.user_auth
            .filter(auth => auth.auth_provider !== 'local')
            .map(auth => auth.auth_provider);
        if (!hasLocalAuth && socialProviders.length > 0) {
            return {
                message: error_messages_1.ERROR_MESSAGES.SOCIAL_AUTH_ONLY,
                status: 'social_auth_only',
                socialProviders: socialProviders
            };
        }
        if (!hasLocalAuth) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.LOCAL_AUTH_NOT_FOUND);
        }
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        await this.prisma.$transaction([
            this.prisma.password_reset_codes.deleteMany({
                where: { user_id: user.id },
            }),
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
                message: error_messages_1.ERROR_MESSAGES.PASSWORD_RESET_CODE_SENT,
                status: 'success',
            };
        }
        catch (error) {
            console.error('Şifre sıfırlama kodu gönderme hatası:', error);
            return {
                message: error_messages_1.ERROR_MESSAGES.PASSWORD_RESET_CODE_SEND_FAILED,
                status: 'error',
            };
        }
    }
    async verifyPasswordResetCode(email, code) {
        try {
            const user = await this.prisma.users.findUnique({
                where: { e_mail: email },
                include: {
                    password_reset_codes: true,
                    user_auth: true,
                },
            });
            if (!user) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.EMAIL_NOT_FOUND);
            }
            const hasLocalAuth = user.user_auth.some(auth => auth.auth_provider === 'local');
            if (!hasLocalAuth) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.LOCAL_AUTH_NOT_FOUND);
            }
            if (!user.password_reset_codes.length) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.INVALID_RESET_CODE);
            }
            const resetCode = user.password_reset_codes[0];
            if (resetCode.expires_at < new Date()) {
                await this.prisma.password_reset_codes.delete({
                    where: { id: resetCode.id },
                });
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.RESET_CODE_EXPIRED);
            }
            if (resetCode.reset_code !== code) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.INVALID_RESET_CODE);
            }
            await this.prisma.password_reset_codes.update({
                where: { id: resetCode.id },
                data: { is_verified: true }
            });
            return {
                message: error_messages_1.ERROR_MESSAGES.PASSWORD_RESET_CODE_VALID,
                status: 'success',
                isValid: true
            };
        }
        catch (error) {
            return {
                message: error instanceof common_1.BadRequestException ? error.message : 'Doğrulama kodu geçersiz',
                status: 'error',
                isValid: false
            };
        }
    }
    async resetPasswordWithCode(email, code, newPassword) {
        try {
            const user = await this.prisma.users.findUnique({
                where: { e_mail: email },
                include: {
                    password_reset_codes: true,
                    user_auth: true,
                },
            });
            if (!user) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.EMAIL_NOT_FOUND);
            }
            const localAuth = user.user_auth.find(auth => auth.auth_provider === 'local');
            if (!localAuth) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.LOCAL_AUTH_NOT_FOUND);
            }
            const resetCode = user.password_reset_codes.find(rc => rc.reset_code === code && rc.is_verified);
            if (!resetCode) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.INVALID_RESET_CODE);
            }
            if (resetCode.expires_at < new Date()) {
                await this.prisma.password_reset_codes.delete({
                    where: { id: resetCode.id },
                });
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.RESET_CODE_EXPIRED);
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
                message: error_messages_1.ERROR_MESSAGES.PASSWORD_RESET_SUCCESS,
                status: 'success',
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            return {
                message: error_messages_1.ERROR_MESSAGES.PASSWORD_RESET_FAILED,
                status: 'error',
            };
        }
    }
    async changePassword(userId, oldPassword, newPassword, newPasswordConfirm) {
        if (newPassword !== newPasswordConfirm) {
            return {
                message: error_messages_1.ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
                status: 'error',
            };
        }
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            include: {
                user_auth: true,
            },
        });
        if (!user) {
            return {
                message: error_messages_1.ERROR_MESSAGES.EMAIL_NOT_FOUND,
                status: 'error',
            };
        }
        const localAuth = user.user_auth.find(auth => auth.auth_provider === 'local');
        if (!localAuth || !localAuth.password_hash) {
            return {
                message: error_messages_1.ERROR_MESSAGES.LOCAL_AUTH_NOT_FOUND,
                status: 'error',
            };
        }
        const isMatch = await bcrypt.compare(oldPassword, localAuth.password_hash);
        if (!isMatch) {
            return {
                message: error_messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                status: 'error',
            };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user_auth.updateMany({
            where: {
                user_id: user.id,
                auth_provider: 'local',
            },
            data: { password_hash: hashedPassword },
        });
        return {
            message: error_messages_1.ERROR_MESSAGES.PASSWORD_CHANGE_SUCCESS,
            status: 'success',
        };
    }
};
exports.PasswordService = PasswordService;
exports.PasswordService = PasswordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], PasswordService);
//# sourceMappingURL=password.service.js.map