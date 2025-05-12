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
var AppointmentManagementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentManagementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const slot_service_1 = require("./slot.service");
const appointment_notification_service_1 = require("../../notifications/services/appointment-notification.service");
let AppointmentManagementService = AppointmentManagementService_1 = class AppointmentManagementService {
    constructor(prisma, slotService, appointmentNotificationService) {
        this.prisma = prisma;
        this.slotService = slotService;
        this.appointmentNotificationService = appointmentNotificationService;
        this.logger = new common_1.Logger(AppointmentManagementService_1.name);
    }
    async createAppointment(customerId, dto) {
        const mechanic = await this.prisma.mechanics.findUnique({
            where: { id: dto.mechanic_id },
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Mekanik bulunamadı');
        }
        const vehicle = await this.prisma.customer_vehicles.findFirst({
            where: {
                id: dto.vehicle_id,
                customer_id: customerId
            },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Araç bulunamadı veya size ait değil');
        }
        const isSlotAvailable = await this.slotService.isTimeSlotAvailable(dto.mechanic_id, new Date(dto.start_time), new Date(dto.end_time));
        if (!isSlotAvailable) {
            throw new common_1.ConflictException('Seçilen zaman aralığı dolu');
        }
        let locationId = null;
        if (dto.appointment_type === client_1.AppointmentType.AT_SERVICE) {
            const mechanicUser = await this.prisma.users.findUnique({
                where: { id: mechanic.user_id },
            });
            locationId = mechanicUser?.default_location_id;
        }
        else if (dto.appointment_type === client_1.AppointmentType.ON_SITE) {
            const customer = await this.prisma.customers.findUnique({
                where: { id: customerId },
                include: { users: true },
            });
            if (customer?.users?.default_location_id) {
                locationId = customer.users.default_location_id;
            }
        }
        const newAppointment = await this.prisma.appointments.create({
            data: {
                mechanic_id: dto.mechanic_id,
                customer_id: customerId,
                vehicle_id: dto.vehicle_id,
                appointment_date: new Date(dto.start_time),
                start_time: new Date(dto.start_time),
                end_time: new Date(dto.end_time),
                status: 'pending',
                description: dto.description,
                appointment_type: dto.appointment_type,
                location_id: locationId,
            },
        });
        try {
            await this.appointmentNotificationService.notifyMechanicAboutNewAppointment(newAppointment);
        }
        catch (error) {
            this.logger.error(`Randevu bildirimi gönderilirken hata: ${error.message}`, error.stack);
        }
        return newAppointment;
    }
    async cancelAppointment(userId, appointmentId, userRole) {
        return this.prisma.$transaction(async (tx) => {
            const appointment = await tx.appointments.findUnique({
                where: { id: appointmentId },
                include: {
                    customers: {
                        include: { users: true },
                    },
                    mechanics: {
                        include: { users: true },
                    },
                },
            });
            if (!appointment) {
                throw new common_1.NotFoundException('Randevu bulunamadı');
            }
            if ((userRole === 'customer' && appointment.customers.users.id !== userId) ||
                (userRole === 'mechanic' && appointment.mechanics.users.id !== userId)) {
                throw new common_1.BadRequestException('Bu randevuyu iptal etme yetkiniz yok');
            }
            const updatedAppointment = await tx.appointments.update({
                where: { id: appointmentId },
                data: {
                    status: 'canceled',
                },
            });
            try {
                if (userRole === 'customer') {
                    await this.appointmentNotificationService.notifyMechanicAboutCancelledAppointment(appointment);
                }
                else {
                    await this.appointmentNotificationService.notifyCustomerAboutAppointmentStatusChange(appointment, 'canceled');
                }
            }
            catch (error) {
                this.logger.error(`İptal bildirimi gönderilirken hata: ${error.message}`, error.stack);
            }
            return updatedAppointment;
        });
    }
    async approveAppointment(mechanicUserId, appointmentId) {
        return this.prisma.$transaction(async (tx) => {
            const appointment = await tx.appointments.findUnique({
                where: { id: appointmentId },
                include: {
                    mechanics: {
                        include: { users: true },
                    },
                },
            });
            if (!appointment) {
                throw new common_1.NotFoundException('Randevu bulunamadı');
            }
            if (appointment.mechanics.users.id !== mechanicUserId) {
                throw new common_1.BadRequestException('Bu randevuyu onaylama yetkiniz yok');
            }
            if (appointment.status !== 'pending') {
                throw new common_1.BadRequestException('Sadece bekleyen randevular onaylanabilir');
            }
            const updatedAppointment = await tx.appointments.update({
                where: { id: appointmentId },
                data: {
                    status: 'confirmed',
                },
            });
            try {
                await this.appointmentNotificationService.notifyCustomerAboutAppointmentStatusChange(appointment, 'confirmed');
            }
            catch (error) {
                this.logger.error(`Onay bildirimi gönderilirken hata: ${error.message}`, error.stack);
            }
            return updatedAppointment;
        });
    }
    async completeAppointment(mechanicUserId, appointmentId) {
        return this.prisma.$transaction(async (tx) => {
            const appointment = await tx.appointments.findUnique({
                where: { id: appointmentId },
                include: {
                    mechanics: {
                        include: { users: true },
                    },
                },
            });
            if (!appointment) {
                throw new common_1.NotFoundException('Randevu bulunamadı');
            }
            if (appointment.mechanics.users.id !== mechanicUserId) {
                throw new common_1.BadRequestException('Bu randevuyu tamamlama yetkiniz yok');
            }
            if (appointment.status !== 'confirmed') {
                throw new common_1.BadRequestException('Sadece onaylanmış randevular tamamlanabilir');
            }
            const updatedAppointment = await tx.appointments.update({
                where: { id: appointmentId },
                data: {
                    status: 'completed',
                },
            });
            try {
                await this.appointmentNotificationService.notifyCustomerAboutAppointmentStatusChange(appointment, 'completed');
            }
            catch (error) {
                this.logger.error(`Tamamlama bildirimi gönderilirken hata: ${error.message}`, error.stack);
            }
            return updatedAppointment;
        });
    }
};
exports.AppointmentManagementService = AppointmentManagementService;
exports.AppointmentManagementService = AppointmentManagementService = AppointmentManagementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        slot_service_1.SlotService,
        appointment_notification_service_1.AppointmentNotificationService])
], AppointmentManagementService);
//# sourceMappingURL=appointment-management.service.js.map