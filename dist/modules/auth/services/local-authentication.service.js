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
exports.LocalAuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const error_messages_1 = require("../../../common/constants/error-messages");
let LocalAuthenticationService = class LocalAuthenticationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async authenticateUser(e_mail, password) {
        const user = await this.prisma.users.findUnique({
            where: { e_mail },
            include: {
                user_auth: {
                    where: { auth_provider: 'local' },
                    select: { password_hash: true, e_mail_verified: true },
                },
            },
        });
        if (!user || !user.user_auth.length) {
            throw new common_1.UnauthorizedException(error_messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        const userAuth = user.user_auth[0];
        if (!userAuth.password_hash || !await bcrypt.compare(password, userAuth.password_hash)) {
            throw new common_1.UnauthorizedException(error_messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        if (!userAuth.e_mail_verified) {
            throw new common_1.UnauthorizedException(error_messages_1.ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
        }
        const { user_auth, ...userWithoutAuth } = user;
        return userWithoutAuth;
    }
};
exports.LocalAuthenticationService = LocalAuthenticationService;
exports.LocalAuthenticationService = LocalAuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocalAuthenticationService);
//# sourceMappingURL=local-authentication.service.js.map