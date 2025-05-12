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
var SessionManagerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManagerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const crypto = require("crypto");
const error_messages_1 = require("../../../common/constants/error-messages");
let SessionManagerService = SessionManagerService_1 = class SessionManagerService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SessionManagerService_1.name);
    }
    async createUserSession(userId, request) {
        try {
            const deviceId = this.getOrCreateDeviceId(request);
            await this.prisma.user_sessions.deleteMany({
                where: { user_id: userId },
            });
            const newSession = await this.prisma.user_sessions.create({
                data: {
                    user_id: userId,
                    device_id: deviceId,
                    ip_address: request.ip || null,
                    user_agent: request.headers['user-agent'] || null,
                    fcm_token: null,
                    created_at: new Date(),
                },
            });
            this.logger.debug(`Session created for user ${userId} with device ${deviceId}`);
            return newSession;
        }
        catch (error) {
            this.logger.error(`Failed to create session for user ${userId}: ${error.message}`);
            throw new common_1.InternalServerErrorException(error_messages_1.ERROR_MESSAGES.SESSION_CREATION_ERROR);
        }
    }
    getOrCreateDeviceId(request) {
        const providedDeviceId = request.headers['device-id'];
        if (providedDeviceId) {
            return providedDeviceId;
        }
        const userAgent = request.headers['user-agent'] || 'unknown';
        const ip = request.ip || 'unknown';
        return crypto.createHash('md5').update(`${userAgent}:${ip}`).digest('hex');
    }
    async updateFcmToken(userId, deviceId, fcmToken) {
        if (!fcmToken)
            return;
        try {
            await this.prisma.user_sessions.updateMany({
                where: {
                    user_id: userId,
                    device_id: deviceId,
                },
                data: {
                    fcm_token: fcmToken,
                },
            });
            this.logger.debug(`FCM token updated for user ${userId}`);
        }
        catch (error) {
            this.logger.error(`Failed to update FCM token: ${error.message}`);
        }
    }
    async logoutUser(userId) {
        try {
            await this.prisma.user_sessions.deleteMany({
                where: { user_id: userId },
            });
            this.logger.debug(`User ${userId} sessions cleared`);
        }
        catch (error) {
            this.logger.error(`Logout error for user ${userId}: ${error.message}`);
            throw new common_1.InternalServerErrorException(error_messages_1.ERROR_MESSAGES.LOGOUT_ERROR);
        }
    }
    async checkUserSession(userId) {
        const sessionCount = await this.prisma.user_sessions.count({
            where: { user_id: userId }
        });
        return sessionCount > 0;
    }
    async findUserSession(userId) {
        try {
            return await this.prisma.user_sessions.findFirst({
                where: { user_id: userId }
            });
        }
        catch (error) {
            this.logger.error(`Failed to find session for user ${userId}: ${error.message}`);
            throw new common_1.InternalServerErrorException(error_messages_1.ERROR_MESSAGES.SESSION_NOT_FOUND);
        }
    }
};
exports.SessionManagerService = SessionManagerService;
exports.SessionManagerService = SessionManagerService = SessionManagerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionManagerService);
//# sourceMappingURL=session-manager.service.js.map