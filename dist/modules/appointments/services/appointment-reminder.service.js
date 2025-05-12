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
var AppointmentReminderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentReminderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
const appointment_notification_service_1 = require("../../notifications/services/appointment-notification.service");
let AppointmentReminderService = AppointmentReminderService_1 = class AppointmentReminderService {
    constructor(prisma, appointmentNotificationService) {
        this.prisma = prisma;
        this.appointmentNotificationService = appointmentNotificationService;
        this.logger = new common_1.Logger(AppointmentReminderService_1.name);
    }
    async sendAppointmentReminders() {
        this.logger.log('Randevu hatırlatma bildirimleri gönderiliyor...');
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const dayAfterTomorrow = new Date(tomorrow);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
            const upcomingAppointments = await this.prisma.appointments.findMany({
                where: {
                    appointment_date: {
                        gte: tomorrow,
                        lt: dayAfterTomorrow,
                    },
                    status: 'confirmed',
                },
                include: {
                    customers: {
                        include: {
                            users: true,
                        },
                    },
                    mechanics: {
                        include: {
                            users: true,
                        },
                    },
                },
            });
            this.logger.log(`${upcomingAppointments.length} adet yaklaşan randevu bulundu.`);
            for (const appointment of upcomingAppointments) {
                try {
                    await this.appointmentNotificationService.notifyCustomerAboutUpcomingAppointment(appointment);
                    this.logger.log(`Randevu hatırlatması gönderildi: Randevu ID ${appointment.id}`);
                }
                catch (error) {
                    this.logger.error(`Randevu hatırlatması gönderilirken hata: ${error.message}`, error.stack);
                }
            }
            return { success: true, count: upcomingAppointments.length };
        }
        catch (error) {
            this.logger.error(`Randevu hatırlatmaları işlenirken hata: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
};
exports.AppointmentReminderService = AppointmentReminderService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentReminderService.prototype, "sendAppointmentReminders", null);
exports.AppointmentReminderService = AppointmentReminderService = AppointmentReminderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        appointment_notification_service_1.AppointmentNotificationService])
], AppointmentReminderService);
//# sourceMappingURL=appointment-reminder.service.js.map