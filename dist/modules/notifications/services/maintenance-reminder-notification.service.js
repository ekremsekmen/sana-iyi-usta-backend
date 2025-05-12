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
var MaintenanceReminderNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceReminderNotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const fcm_service_1 = require("./fcm.service");
const date_fns_1 = require("date-fns");
const schedule_1 = require("@nestjs/schedule");
let MaintenanceReminderNotificationService = MaintenanceReminderNotificationService_1 = class MaintenanceReminderNotificationService {
    constructor(prisma, fcmService) {
        this.prisma = prisma;
        this.fcmService = fcmService;
        this.logger = new common_1.Logger(MaintenanceReminderNotificationService_1.name);
        this.sentReminders = new Map();
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
    async checkUpcomingMaintenances() {
        this.logger.log('Zamanlanmış görev: Yaklaşan bakımlar kontrol ediliyor...');
        try {
            const today = new Date();
            const oneWeekFromToday = (0, date_fns_1.addDays)(today, 7);
            this.logger.log(`Yaklaşan bakımlar kontrol ediliyor. Tarih aralığı: ${today.toISOString()} - ${oneWeekFromToday.toISOString()}`);
            const maintenanceRecords = await this.prisma.vehicle_maintenance_records.findMany({
                where: {
                    next_due_date: {
                        gte: today,
                        lte: oneWeekFromToday
                    }
                },
                include: {
                    customer_vehicles: {
                        include: {
                            customers: {
                                include: {
                                    users: {
                                        include: {
                                            user_sessions: true
                                        }
                                    }
                                }
                            },
                            brands: true,
                            models: true
                        }
                    },
                    mechanics: true
                },
                orderBy: {
                    next_due_date: 'asc'
                }
            });
            this.logger.log(`${maintenanceRecords.length} adet yaklaşan bakım kaydı bulundu.`);
            for (const record of maintenanceRecords) {
                const vehicle = record.customer_vehicles;
                const user = vehicle.customers.users;
                const vehicleKey = `${user.id}-${vehicle.id}`;
                const hasNewerAppointment = await this.checkForNewerMaintenanceDate(vehicle.id, record.next_due_date);
                if (hasNewerAppointment) {
                    this.logger.log(`${vehicleKey} için daha güncel bakım kaydı mevcut. Bildirim atlanıyor.`);
                    continue;
                }
                const lastSent = this.sentReminders.get(vehicleKey);
                if (lastSent) {
                    const thirtyDaysAgo = (0, date_fns_1.subDays)(today, 30);
                    if ((0, date_fns_1.isBefore)(thirtyDaysAgo, lastSent)) {
                        this.logger.log(`${vehicleKey} için son 30 gün içinde bildirim gönderildi. Tekrar gönderilmiyor.`);
                        continue;
                    }
                }
                const brandName = vehicle.brands.name;
                const modelName = vehicle.models.name;
                const formattedDate = record.next_due_date.toLocaleDateString('tr-TR');
                const mechanicName = record.mechanics.business_name;
                const message = `${brandName} ${modelName} aracınızın bakım zamanı yaklaşıyor. ${formattedDate} tarihinde ${mechanicName} tarafından yapılan bakımın üzerinden neredeyse bir yıl geçti. Yeni bir bakım randevusu almanızı öneririz.`;
                await this.createNotification({
                    userId: user.id,
                    message,
                    type: 'maintenance_reminder',
                });
                const fcmTokens = user.user_sessions
                    .filter(session => session.fcm_token)
                    .map(session => session.fcm_token);
                if (fcmTokens.length > 0) {
                    await this.fcmService.sendMulticastNotification(fcmTokens, 'Bakım Hatırlatması', message, {
                        vehicleId: vehicle.id,
                        recordId: record.id,
                        type: 'maintenance_reminder'
                    });
                }
                this.sentReminders.set(vehicleKey, new Date());
                this.logger.log(`${vehicleKey} için bakım hatırlatması gönderildi.`);
            }
            return { success: true, processed: maintenanceRecords.length };
        }
        catch (error) {
            this.logger.error(`Bakım kontrol hatası: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
    async checkForNewerMaintenanceDate(vehicleId, currentDueDate) {
        const newerRecord = await this.prisma.vehicle_maintenance_records.findFirst({
            where: {
                vehicle_id: vehicleId,
                next_due_date: {
                    gt: currentDueDate
                }
            },
            orderBy: {
                next_due_date: 'asc'
            }
        });
        return !!newerRecord;
    }
    async sendMaintenanceNotification(userId, title, message, data) {
        try {
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
                await this.fcmService.sendMulticastNotification(fcmTokens, title, message, data);
                return true;
            }
            return false;
        }
        catch (error) {
            this.logger.error(`Bildirim gönderilirken hata: ${error.message}`, error.stack);
            return false;
        }
    }
};
exports.MaintenanceReminderNotificationService = MaintenanceReminderNotificationService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_10AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaintenanceReminderNotificationService.prototype, "checkUpcomingMaintenances", null);
exports.MaintenanceReminderNotificationService = MaintenanceReminderNotificationService = MaintenanceReminderNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fcm_service_1.FcmService])
], MaintenanceReminderNotificationService);
//# sourceMappingURL=maintenance-reminder-notification.service.js.map