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
exports.UserSessionService = void 0;
const common_1 = require("@nestjs/common");
const session_manager_service_1 = require("./session-manager.service");
const token_manager_service_1 = require("./token-manager.service");
const error_messages_1 = require("../../../common/constants/error-messages");
let UserSessionService = class UserSessionService {
    constructor(sessionManager, tokenManager) {
        this.sessionManager = sessionManager;
        this.tokenManager = tokenManager;
    }
    async createUserSession(user, request) {
        try {
            const session = await this.sessionManager.createUserSession(user.id, request);
            const tokenData = await this.tokenManager.generateTokens(user.id, user.role);
            return {
                ...tokenData,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    e_mail: user.e_mail,
                    role: user.role,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.SESSION_CREATION_ERROR);
        }
    }
    async updateFcmToken(userId, fcmToken) {
        if (!fcmToken) {
            return { message: 'No FCM token provided' };
        }
        try {
            const session = await this.sessionManager.findUserSession(userId);
            if (!session) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.SESSION_NOT_FOUND);
            }
            if (session.fcm_token === fcmToken) {
                return { message: 'FCM token already up to date' };
            }
            await this.sessionManager.updateFcmToken(userId, session.device_id, fcmToken);
            return { message: 'FCM token updated successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || error_messages_1.ERROR_MESSAGES.FCM_TOKEN_UPDATE_ERROR);
        }
    }
    async logout(userId, refreshToken) {
        const parts = refreshToken.split(':');
        if (parts.length !== 2) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
        }
        const tokenId = parts[0];
        const tokenExists = await this.tokenManager.checkRefreshTokenExists(tokenId);
        if (!tokenExists) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
        }
        const sessionExists = await this.sessionManager.checkUserSession(userId);
        if (!sessionExists) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.LOGOUT_ERROR);
        }
        try {
            await this.sessionManager.logoutUser(userId);
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message || error_messages_1.ERROR_MESSAGES.LOGOUT_ERROR);
        }
        await this.tokenManager.deleteRefreshToken(tokenId);
        return { message: 'Logged out successfully', status: 'success' };
    }
    async refreshAccessToken(refreshToken) {
        return this.tokenManager.refreshAccessToken(refreshToken);
    }
};
exports.UserSessionService = UserSessionService;
exports.UserSessionService = UserSessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [session_manager_service_1.SessionManagerService,
        token_manager_service_1.TokenManagerService])
], UserSessionService);
//# sourceMappingURL=user-session.service.js.map