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
exports.UserRegistrationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const register_dto_1 = require("../dto/register.dto");
const email_service_1 = require("./email.service");
const bcrypt = require("bcrypt");
const error_messages_1 = require("../../../common/constants/error-messages");
let UserRegistrationService = class UserRegistrationService {
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async registerUser(registerDto) {
        const existingUser = await this.prisma.users.findUnique({
            where: { e_mail: registerDto.e_mail },
            include: { user_auth: true },
        });
        const hashedPassword = registerDto.auth_provider === register_dto_1.AuthProvider.LOCAL
            ? await bcrypt.hash(registerDto.password, 10)
            : null;
        if (existingUser) {
            const existingAuth = existingUser.user_auth.find((auth) => auth.auth_provider === registerDto.auth_provider);
            if (existingAuth) {
                throw new common_1.ConflictException(error_messages_1.ERROR_MESSAGES.AUTH_METHOD_ALREADY_LINKED);
            }
            return this.handleExistingUser(existingUser, registerDto, hashedPassword);
        }
        let result;
        let verificationToken = null;
        await this.prisma.$transaction(async (prisma) => {
            result = await this.createNewUser(prisma, registerDto, hashedPassword);
            if (registerDto.auth_provider === register_dto_1.AuthProvider.LOCAL) {
                verificationToken = await this.emailService.createVerification(prisma, result.userId, registerDto.e_mail);
            }
        });
        if (registerDto.auth_provider === register_dto_1.AuthProvider.LOCAL && verificationToken) {
            const verificationEmailSent = await this.emailService.sendVerificationEmailByToken(registerDto.e_mail, verificationToken);
            result.verificationEmailSent = verificationEmailSent;
        }
        return result;
    }
    async handleExistingUser(existingUser, registerDto, hashedPassword) {
        await this.prisma.user_auth.create({
            data: this.createUserAuthData(existingUser.id, registerDto, hashedPassword),
        });
        let verificationEmailSent = false;
        if (registerDto.auth_provider === register_dto_1.AuthProvider.LOCAL) {
            const verificationToken = await this.emailService.createVerification(this.prisma, existingUser.id, registerDto.e_mail);
            verificationEmailSent = await this.emailService.sendVerificationEmailByToken(registerDto.e_mail, verificationToken);
        }
        return {
            userId: existingUser.id,
            verificationEmailSent,
            message: error_messages_1.ERROR_MESSAGES.NEW_AUTH_METHOD_ADDED,
        };
    }
    createUserAuthData(userId, registerDto, hashedPassword) {
        return {
            user_id: userId,
            password_hash: hashedPassword,
            kvkk_approved: registerDto.kvkk_approved,
            terms_approved: registerDto.terms_approved,
            auth_provider: registerDto.auth_provider,
            provider_id: registerDto.provider_id,
            e_mail_verified: registerDto.auth_provider !== register_dto_1.AuthProvider.LOCAL,
        };
    }
    async createNewUser(prisma, registerDto, hashedPassword) {
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
        if (registerDto.role === register_dto_1.UserRole.CUSTOMER) {
            await prisma.customers.create({
                data: {
                    user_id: user.id,
                    created_at: new Date(),
                },
            });
        }
        return { userId: user.id };
    }
};
exports.UserRegistrationService = UserRegistrationService;
exports.UserRegistrationService = UserRegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], UserRegistrationService);
//# sourceMappingURL=user-registration.service.js.map