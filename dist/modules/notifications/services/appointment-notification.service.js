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
var AppointmentNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentNotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const fcm_service_1 = require("./fcm.service");
let AppointmentNotificationService = AppointmentNotificationService_1 = class AppointmentNotificationService {
    constructor(prisma, fcmService) {
        this.prisma = prisma;
        this.fcmService = fcmService;
        this.logger = new common_1.Logger(AppointmentNotificationService_1.name);
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
    async notifyMechanicAboutNewAppointment(appointment) {
        try {
            const mechanic = await this.prisma.mechanics.findUnique({
                where: { id: appointment.mechanic_id },
                include: { users: true },
            });
            const customer = await this.prisma.customers.findUnique({
                where: { id: appointment.customer_id },
                include: { users: true },
            });
            if (!mechanic || !customer) {
                return { success: false, message: 'Mekanik veya müşteri bulunamadı' };
            }
            const appointmentDate = new Date(appointment.appointment_date);
            const formattedDate = appointmentDate.toLocaleDateString('tr-TR');
            const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const message = `${customer.users.full_name} adlı müşteri ${formattedDate} tarihinde ${formattedTime} saatinde randevu aldı.`;
            await this.createNotification({
                userId: mechanic.user_id,
                message,
                type: 'appointment_created',
            });
            await this.sendPushNotification(mechanic.user_id, 'Yeni Randevu', message, {
                appointmentId: appointment.id,
                type: 'appointment_created'
            });
            return { success: true, message: 'Bildirim başarıyla gönderildi' };
        }
        catch (error) {
            this.logger.error(`Yeni randevu bildirimi gönderilirken hata: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
    async notifyCustomerAboutUpcomingAppointment(appointment) {
        try {
            const customer = await this.prisma.customers.findUnique({
                where: { id: appointment.customer_id },
                include: { users: true },
            });
            const mechanic = await this.prisma.mechanics.findUnique({
                where: { id: appointment.mechanic_id },
                include: { users: true },
            });
            if (!customer || !mechanic) {
                return { success: false, message: 'Müşteri veya mekanik bulunamadı' };
            }
            const appointmentDate = new Date(appointment.appointment_date);
            const formattedDate = appointmentDate.toLocaleDateString('tr-TR');
            const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const message = `${mechanic.business_name} ile yarın (${formattedDate}) saat ${formattedTime}'de randevunuz var.`;
            await this.createNotification({
                userId: customer.user_id,
                message,
                type: 'appointment_reminder',
            });
            await this.sendPushNotification(customer.user_id, 'Randevu Hatırlatması', message, {
                appointmentId: appointment.id,
                type: 'appointment_reminder'
            });
            return { success: true, message: 'Hatırlatma bildirimi gönderildi' };
        }
        catch (error) {
            this.logger.error(`Randevu hatırlatma bildirimi gönderilirken hata: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
    async notifyMechanicAboutCancelledAppointment(appointment) {
        try {
            const mechanic = await this.prisma.mechanics.findUnique({
                where: { id: appointment.mechanic_id },
                include: { users: true },
            });
            const customer = await this.prisma.customers.findUnique({
                where: { id: appointment.customer_id },
                include: { users: true },
            });
            if (!mechanic || !customer) {
                return { success: false, message: 'Mekanik veya müşteri bulunamadı' };
            }
            const appointmentDate = new Date(appointment.appointment_date);
            const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const message = `${customer.users.full_name} adlı müşteri ${formattedTime} saatindeki randevuyu iptal etti.`;
            await this.createNotification({
                userId: mechanic.user_id,
                message,
                type: 'appointment_canceled',
            });
            await this.sendPushNotification(mechanic.user_id, 'Randevu İptali', message, {
                appointmentId: appointment.id,
                type: 'appointment_canceled'
            });
            return { success: true, message: 'İptal bildirimi gönderildi' };
        }
        catch (error) {
            this.logger.error(`Randevu iptal bildirimi gönderilirken hata: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
    async notifyCustomerAboutAppointmentStatusChange(appointment, statusAction) {
        try {
            const customer = await this.prisma.customers.findUnique({
                where: { id: appointment.customer_id },
                include: { users: true },
            });
            const mechanic = await this.prisma.mechanics.findUnique({
                where: { id: appointment.mechanic_id },
                include: { users: true },
            });
            if (!customer || !mechanic) {
                return { success: false, message: 'Müşteri veya mekanik bulunamadı' };
            }
            const appointmentDate = new Date(appointment.appointment_date);
            const formattedDate = appointmentDate.toLocaleDateString('tr-TR');
            const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            let message = '';
            let title = '';
            switch (statusAction) {
                case 'confirmed':
                    title = 'Randevu Onaylandı';
                    message = `${mechanic.business_name} ${formattedDate} tarihindeki ${formattedTime} randevunuzu onayladı.`;
                    break;
                case 'completed':
                    title = 'Randevu Tamamlandı';
                    message = `${mechanic.business_name} ${formattedDate} tarihindeki randevunuzu tamamladı.`;
                    break;
                case 'canceled':
                    title = 'Randevu İptal Edildi';
                    message = `${mechanic.business_name} ${formattedDate} tarihindeki ${formattedTime} randevunuzu iptal etti.`;
                    break;
                default:
                    title = 'Randevu Durumu Değişti';
                    message = `${mechanic.business_name} tarafından randevu durumunuz güncellendi.`;
            }
            await this.createNotification({
                userId: customer.user_id,
                message,
                type: 'appointment_status_updated',
            });
            await this.sendPushNotification(customer.user_id, title, message, {
                appointmentId: appointment.id,
                type: 'appointment_status_updated',
                status: statusAction
            });
            return { success: true, message: 'Durum değişikliği bildirimi gönderildi' };
        }
        catch (error) {
            this.logger.error(`Randevu durum bildirimi gönderilirken hata: ${error.message}`, error.stack);
            return { success: false, error: error.message };
        }
    }
};
exports.AppointmentNotificationService = AppointmentNotificationService;
exports.AppointmentNotificationService = AppointmentNotificationService = AppointmentNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fcm_service_1.FcmService])
], AppointmentNotificationService);
//# sourceMappingURL=appointment-notification.service.js.map