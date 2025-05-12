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
var ReviewNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewNotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const fcm_service_1 = require("./fcm.service");
let ReviewNotificationService = ReviewNotificationService_1 = class ReviewNotificationService {
    constructor(prisma, fcmService) {
        this.prisma = prisma;
        this.fcmService = fcmService;
        this.logger = new common_1.Logger(ReviewNotificationService_1.name);
    }
    async createNotification(createNotificationDto) {
        return this.prisma.notifications.create({
            data: {
                user_id: createNotificationDto.userId,
                message: createNotificationDto.message,
                type: createNotificationDto.type,
            },
        });
    }
    async sendPushNotification(userId, title, message, data) {
        try {
            const userSessions = await this.prisma.user_sessions.findMany({
                where: {
                    user_id: userId,
                    fcm_token: { not: null },
                },
            });
            const fcmTokens = userSessions
                .filter(session => session.fcm_token)
                .map(session => session.fcm_token);
            if (fcmTokens.length > 0) {
                await this.fcmService.sendMulticastNotification(fcmTokens, title, message, data);
            }
        }
        catch (error) {
            this.logger.error(`Push bildirim gönderilemedi: ${error.message}`, error.stack);
        }
    }
    async notifyMechanicAboutNewReview(review, appointment, customerName) {
        try {
            const mechanic = await this.prisma.mechanics.findUnique({
                where: { id: review.mechanic_id },
                include: { users: true },
            });
            if (!mechanic) {
                return { success: false, message: 'Mekanik bulunamadı' };
            }
            const appointmentDate = new Date(appointment.appointment_date);
            const formattedDate = appointmentDate.toLocaleDateString('tr-TR');
            const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const starRating = '⭐'.repeat(review.rating);
            const message = `${customerName} tarafından ${formattedDate} tarihindeki ${formattedTime} saatindeki randevunuz için ${starRating} değerlendirme yapıldı.`;
            await this.createNotification({
                userId: mechanic.user_id,
                message,
                type: 'new_review',
            });
            await this.sendPushNotification(mechanic.user_id, 'Yeni Değerlendirme', message, {
                reviewId: review.id,
                appointmentId: appointment.id,
                rating: review.rating.toString(),
                type: 'new_review'
            });
            return { success: true, message: 'Değerlendirme bildirimi gönderildi' };
        }
        catch (error) {
            this.logger.error(`Değerlendirme bildirimi gönderilirken hata: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
};
exports.ReviewNotificationService = ReviewNotificationService;
exports.ReviewNotificationService = ReviewNotificationService = ReviewNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fcm_service_1.FcmService])
], ReviewNotificationService);
//# sourceMappingURL=review-notification.service.js.map