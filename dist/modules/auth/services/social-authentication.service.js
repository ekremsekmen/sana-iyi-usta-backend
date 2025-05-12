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
exports.SocialAuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const prisma_service_1 = require("../../../prisma/prisma.service");
const error_messages_1 = require("../../../common/constants/error-messages");
let SocialAuthenticationService = class SocialAuthenticationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async authenticateWithGoogle(googleAuthDto) {
        try {
            const existingUser = await this.prisma.users.findUnique({
                where: { e_mail: googleAuthDto.email },
                include: { user_auth: true },
            });
            let userInfo;
            if (existingUser) {
                userInfo = {
                    e_mail: existingUser.e_mail,
                    full_name: existingUser.full_name,
                    provider_id: googleAuthDto.providerId,
                    role: existingUser.role,
                    kvkk_approved: existingUser.user_auth[0]?.kvkk_approved ?? true,
                    terms_approved: existingUser.user_auth[0]?.terms_approved ?? true,
                };
            }
            else {
                if (!googleAuthDto.fullName ||
                    googleAuthDto.kvkkApproved === undefined ||
                    googleAuthDto.termsApproved === undefined ||
                    !googleAuthDto.role) {
                    throw new common_1.BadRequestException('Bu hesap ile kayıt için gerekli bilgiler eksik.');
                }
                userInfo = this.mapToSocialUserInfo(googleAuthDto.email, googleAuthDto.fullName, googleAuthDto.providerId, googleAuthDto.role, googleAuthDto.kvkkApproved, googleAuthDto.termsApproved);
            }
            return await this.findOrCreateSocialUser(userInfo, 'google');
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.SESSION_CREATION_ERROR);
        }
    }
    async authenticateWithApple(appleAuthDto) {
        try {
            const existingUser = await this.prisma.users.findUnique({
                where: { e_mail: appleAuthDto.email },
                include: { user_auth: true },
            });
            let userInfo;
            if (existingUser) {
                userInfo = {
                    e_mail: existingUser.e_mail,
                    full_name: existingUser.full_name,
                    provider_id: appleAuthDto.providerId,
                    role: existingUser.role,
                    kvkk_approved: existingUser.user_auth[0]?.kvkk_approved ?? true,
                    terms_approved: existingUser.user_auth[0]?.terms_approved ?? true,
                };
            }
            else {
                if (appleAuthDto.kvkkApproved === undefined ||
                    appleAuthDto.termsApproved === undefined ||
                    !appleAuthDto.role) {
                    throw new common_1.BadRequestException('Bu hesap ile kayıtlı kullanıcı bulunamadı, önce kayıt olmalısınız.');
                }
                userInfo = this.mapToSocialUserInfo(appleAuthDto.email, appleAuthDto.fullName || 'Apple User', appleAuthDto.providerId, appleAuthDto.role, appleAuthDto.kvkkApproved, appleAuthDto.termsApproved);
            }
            return await this.findOrCreateSocialUser(userInfo, 'icloud');
        }
        catch (error) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.APPLE_AUTH_FAILED);
        }
    }
    async authenticateWithFacebook(facebookAuthDto) {
        try {
            const fbUserInfo = await axios_1.default.get(`https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${facebookAuthDto.accessToken}`);
            if (fbUserInfo.data.id !== facebookAuthDto.providerId) {
                throw new common_1.UnauthorizedException(error_messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
            }
            const existingUser = await this.prisma.users.findUnique({
                where: { e_mail: facebookAuthDto.email },
                include: { user_auth: true },
            });
            let userInfo;
            if (existingUser) {
                userInfo = {
                    e_mail: existingUser.e_mail,
                    full_name: existingUser.full_name,
                    provider_id: facebookAuthDto.providerId,
                    role: existingUser.role,
                    kvkk_approved: existingUser.user_auth[0]?.kvkk_approved ?? true,
                    terms_approved: existingUser.user_auth[0]?.terms_approved ?? true,
                };
            }
            else {
                if (!facebookAuthDto.fullName ||
                    facebookAuthDto.kvkkApproved === undefined ||
                    facebookAuthDto.termsApproved === undefined ||
                    !facebookAuthDto.role) {
                    throw new common_1.BadRequestException('Bu hesap ile kayıtlı kullanıcı bulunamadı, önce kayıt olmalısınız.');
                }
                userInfo = this.mapToSocialUserInfo(facebookAuthDto.email, facebookAuthDto.fullName, facebookAuthDto.providerId, facebookAuthDto.role, facebookAuthDto.kvkkApproved, facebookAuthDto.termsApproved);
            }
            return await this.findOrCreateSocialUser(userInfo, 'facebook');
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.SESSION_CREATION_ERROR);
        }
    }
    async handleSocialUser(userInfo, provider) {
        if (!userInfo?.e_mail) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        const socialUserInfo = {
            e_mail: userInfo.e_mail,
            full_name: userInfo.full_name || userInfo.name || `${provider} User`,
            provider_id: userInfo.provider_id || userInfo.sub || userInfo.id,
            role: userInfo.role || 'customer',
            kvkk_approved: userInfo.kvkk_approved === undefined ? false : userInfo.kvkk_approved,
            terms_approved: userInfo.terms_approved === undefined ? false : userInfo.terms_approved,
        };
        if (!socialUserInfo.kvkk_approved) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.KVKK_APPROVAL_REQUIRED);
        }
        if (!socialUserInfo.terms_approved) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.TERMS_APPROVAL_REQUIRED);
        }
        return this.findOrCreateSocialUser(socialUserInfo, provider);
    }
    async findOrCreateSocialUser(userInfo, provider) {
        if (!userInfo?.e_mail) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        if (!userInfo.kvkk_approved) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.KVKK_APPROVAL_REQUIRED);
        }
        if (!userInfo.terms_approved) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.TERMS_APPROVAL_REQUIRED);
        }
        let user = await this.prisma.users.findUnique({
            where: { e_mail: userInfo.e_mail },
            include: { user_auth: true },
        });
        if (user) {
            if (userInfo.role && user.role !== userInfo.role) {
                throw new common_1.ConflictException(error_messages_1.ERROR_MESSAGES.ROLE_CONFLICT);
            }
            userInfo.role = user.role;
            const existingAuth = user.user_auth.find((auth) => auth.auth_provider === provider && auth.provider_id === userInfo.provider_id);
            if (!existingAuth) {
                await this.prisma.user_auth.create({
                    data: {
                        user_id: user.id,
                        auth_provider: provider,
                        provider_id: userInfo.provider_id,
                        e_mail_verified: true,
                        kvkk_approved: userInfo.kvkk_approved,
                        terms_approved: userInfo.terms_approved,
                    },
                });
                user = await this.prisma.users.findUnique({
                    where: { e_mail: userInfo.e_mail },
                    include: { user_auth: true },
                });
                return user;
            }
            else {
                return user;
            }
        }
        else {
            if (!userInfo.role) {
                throw new common_1.BadRequestException('Role is required for new users');
            }
            user = await this.prisma.$transaction(async (prisma) => {
                const newUser = await prisma.users.create({
                    data: {
                        full_name: userInfo.full_name,
                        e_mail: userInfo.e_mail,
                        role: userInfo.role,
                        profile_image: null,
                        created_at: new Date(),
                        user_auth: {
                            create: {
                                auth_provider: provider,
                                provider_id: userInfo.provider_id,
                                e_mail_verified: true,
                                kvkk_approved: userInfo.kvkk_approved,
                                terms_approved: userInfo.terms_approved,
                            },
                        },
                    },
                    include: { user_auth: true },
                });
                if (userInfo.role === 'customer') {
                    await prisma.customers.create({
                        data: {
                            user_id: newUser.id,
                            created_at: new Date(),
                        },
                    });
                }
                return newUser;
            });
        }
        return user;
    }
    mapToSocialUserInfo(email, fullName, providerId, role, kvkkApproved, termsApproved) {
        return {
            e_mail: email,
            full_name: fullName,
            provider_id: providerId,
            role: role,
            kvkk_approved: kvkkApproved,
            terms_approved: termsApproved,
        };
    }
};
exports.SocialAuthenticationService = SocialAuthenticationService;
exports.SocialAuthenticationService = SocialAuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SocialAuthenticationService);
//# sourceMappingURL=social-authentication.service.js.map