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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const campaign_notification_service_1 = require("./services/campaign-notification.service");
const maintenance_reminder_notification_service_1 = require("./services/maintenance-reminder-notification.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma, campaignNotificationService, maintenanceReminderService) {
        this.prisma = prisma;
        this.campaignNotificationService = campaignNotificationService;
        this.maintenanceReminderService = maintenanceReminderService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
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
    async getUserNotifications(userId) {
        return this.prisma.notifications.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
    async markNotificationsAsRead(userId, notificationIds) {
        this.logger.log(`Toplu bildirim okundu işaretleme: ${notificationIds.length} bildirim`);
        const result = await this.prisma.notifications.updateMany({
            where: {
                id: { in: notificationIds },
                user_id: userId,
            },
            data: {
                is_read: true,
            },
        });
        return {
            success: true,
            count: result.count,
            message: `${result.count} bildirim okundu olarak işaretlendi`,
        };
    }
    async deleteNotifications(userId, notificationIds) {
        this.logger.log(`Toplu bildirim silme: ${notificationIds.length} bildirim`);
        const result = await this.prisma.notifications.deleteMany({
            where: {
                id: { in: notificationIds },
                user_id: userId,
            },
        });
        return {
            success: true,
            count: result.count,
            message: `${result.count} bildirim silindi`,
        };
    }
    async markNotificationAsRead(userId, notificationId) {
        const result = await this.prisma.notifications.updateMany({
            where: {
                id: notificationId,
                user_id: userId,
            },
            data: {
                is_read: true,
            },
        });
        return {
            success: result.count > 0,
            message: result.count > 0
                ? 'Bildirim okundu olarak işaretlendi'
                : 'Bildirim bulunamadı veya erişim izniniz yok',
        };
    }
    async markAllNotificationsAsRead(userId) {
        this.logger.log(`Kullanıcının tüm bildirimleri okundu işaretleniyor: ${userId}`);
        const result = await this.prisma.notifications.updateMany({
            where: {
                user_id: userId,
                is_read: false
            },
            data: {
                is_read: true,
            },
        });
        return {
            success: true,
            count: result.count,
            message: `${result.count} bildirim okundu olarak işaretlendi`,
        };
    }
    async deleteAllNotifications(userId) {
        this.logger.log(`Kullanıcının tüm bildirimleri siliniyor: ${userId}`);
        const result = await this.prisma.notifications.deleteMany({
            where: {
                user_id: userId
            },
        });
        return {
            success: true,
            count: result.count,
            message: `${result.count} bildirim silindi`,
        };
    }
    async sendCampaignNotifications(mechanicId, campaignId, campaignTitle, brandIds) {
        return this.campaignNotificationService.sendCampaignNotifications(mechanicId, campaignId, campaignTitle, brandIds);
    }
    async checkUpcomingMaintenances() {
        return this.maintenanceReminderService.checkUpcomingMaintenances();
    }
    async sendMaintenanceReminder(userId, vehicleId) {
        this.logger.log(`[DEPRECATED] Manuel bakım hatırlatıcısı çağrıldı: ${userId}, ${vehicleId}`);
        this.logger.warn('Bu metot artık kullanımdan kaldırılmıştır. Bakım hatırlatıcıları otomatik olarak zamanlanmış görevle kontrol edilmektedir.');
        return {
            success: false,
            message: 'Bu fonksiyon artık kullanılmıyor. Bakım hatırlatıcıları günlük olarak otomatik kontrol edilmektedir.'
        };
    }
    async notifyMaintenanceRecordCreated(userId, vehicleId, mechanicName, details) {
        this.logger.log(`Bakım kaydı bildirimi gönderiliyor. Kullanıcı: ${userId}, Araç: ${vehicleId}`);
        try {
            const vehicle = await this.prisma.customer_vehicles.findUnique({
                where: { id: vehicleId },
                include: {
                    brands: true,
                    models: true
                }
            });
            if (!vehicle) {
                return { success: false, message: 'Araç bulunamadı' };
            }
            const message = `${mechanicName} tarafından ${vehicle.brands.name} ${vehicle.models.name} aracınız için yeni bir bakım kaydı oluşturuldu: "${details}"`;
            await this.createNotification({
                userId,
                message,
                type: 'maintenance_record_created',
            });
            const userSessions = await this.prisma.user_sessions.findMany({
                where: {
                    user_id: userId,
                    fcm_token: { not: null }
                }
            });
            const fcmTokens = userSessions
                .filter(session => session.fcm_token)
                .map(session => session.fcm_token);
            if (fcmTokens.length > 0) {
                await this.maintenanceReminderService.sendMaintenanceNotification(userId, `Yeni Bakım Kaydı`, message, {
                    vehicleId,
                    type: 'maintenance_record_created'
                });
            }
            return { success: true, message: 'Bakım kaydı bildirimi gönderildi' };
        }
        catch (error) {
            this.logger.error(`Bakım kaydı bildirimi gönderilirken hata: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
    async deleteNotification(userId, notificationId) {
        this.logger.log(`Tek bildirim silme: ${notificationId}`);
        const result = await this.prisma.notifications.deleteMany({
            where: {
                id: notificationId,
                user_id: userId,
            },
        });
        return {
            success: result.count > 0,
            message: result.count > 0
                ? 'Bildirim silindi'
                : 'Bildirim bulunamadı veya erişim izniniz yok',
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        campaign_notification_service_1.CampaignNotificationService,
        maintenance_reminder_notification_service_1.MaintenanceReminderNotificationService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map