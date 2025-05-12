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
var MessageNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageNotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const fcm_service_1 = require("./fcm.service");
let MessageNotificationService = MessageNotificationService_1 = class MessageNotificationService {
    constructor(prisma, fcmService) {
        this.prisma = prisma;
        this.fcmService = fcmService;
        this.logger = new common_1.Logger(MessageNotificationService_1.name);
        this.lastNotificationTimes = new Map();
        this.notificationCooldown = 5 * 60 * 1000;
    }
    async sendChatNotificationIfNeeded(senderId, receiverId) {
        try {
            const now = Date.now();
            const userLastNotifications = this.lastNotificationTimes.get(receiverId) || new Map();
            const lastNotificationTime = userLastNotifications.get(senderId) || 0;
            if (now - lastNotificationTime > this.notificationCooldown) {
                const sender = await this.prisma.users.findUnique({
                    where: { id: senderId },
                    select: { full_name: true }
                });
                const receiverTokens = await this.prisma.user_sessions.findMany({
                    where: {
                        user_id: receiverId,
                        fcm_token: { not: null }
                    },
                    select: { fcm_token: true }
                });
                const tokens = receiverTokens
                    .map(session => session.fcm_token)
                    .filter(token => token !== null && token.length > 0);
                if (tokens.length > 0 && sender) {
                    await this.fcmService.sendMulticastNotification(tokens, 'Yeni Mesaj', `${sender.full_name} size mesaj gönderdi`, {
                        senderId: senderId,
                        type: 'message',
                        notificationType: 'chat'
                    });
                    userLastNotifications.set(senderId, now);
                    this.lastNotificationTimes.set(receiverId, userLastNotifications);
                }
            }
        }
        catch (error) {
            this.logger.error('Mesaj bildirimi gönderme hatası:', error);
        }
    }
};
exports.MessageNotificationService = MessageNotificationService;
exports.MessageNotificationService = MessageNotificationService = MessageNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fcm_service_1.FcmService])
], MessageNotificationService);
//# sourceMappingURL=message-notification.service.js.map