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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const slot_service_1 = require("./services/slot.service");
const appointment_management_service_1 = require("./services/appointment-management.service");
const appointment_query_service_1 = require("./services/appointment-query.service");
const appointment_reminder_service_1 = require("./services/appointment-reminder.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let AppointmentsService = class AppointmentsService {
    constructor(prisma, slotService, appointmentManagementService, appointmentQueryService, appointmentReminderService) {
        this.prisma = prisma;
        this.slotService = slotService;
        this.appointmentManagementService = appointmentManagementService;
        this.appointmentQueryService = appointmentQueryService;
        this.appointmentReminderService = appointmentReminderService;
    }
    async findCustomerIdByUserId(userId) {
        const customer = await this.prisma.customers.findFirst({
            where: { user_id: userId }
        });
        if (!customer) {
            throw new common_1.NotFoundException('Müşteri bulunamadı');
        }
        return customer.id;
    }
    async findMechanicIdByUserId(userId) {
        const mechanic = await this.prisma.mechanics.findFirst({
            where: { user_id: userId }
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Tamirci bulunamadı');
        }
        return mechanic.id;
    }
    async createAppointmentByUser(userId, dto) {
        const customerId = await this.findCustomerIdByUserId(userId);
        return this.appointmentManagementService.createAppointment(customerId, dto);
    }
    async getAvailableSlots(dto) {
        return this.slotService.getAvailableSlots(dto);
    }
    async getCustomerAppointmentsByUser(userId) {
        const customerId = await this.findCustomerIdByUserId(userId);
        return this.appointmentQueryService.getCustomerAppointments(customerId);
    }
    async getMechanicAppointmentsByUser(userId) {
        const mechanicId = await this.findMechanicIdByUserId(userId);
        return this.appointmentQueryService.getMechanicAppointments(mechanicId);
    }
    async createAppointment(customerId, dto) {
        return this.appointmentManagementService.createAppointment(customerId, dto);
    }
    async getCustomerAppointments(customerId) {
        return this.appointmentQueryService.getCustomerAppointments(customerId);
    }
    async getMechanicAppointments(mechanicId) {
        return this.appointmentQueryService.getMechanicAppointments(mechanicId);
    }
    async cancelAppointment(userId, appointmentId, userRole) {
        return this.appointmentManagementService.cancelAppointment(userId, appointmentId, userRole);
    }
    async approveAppointment(mechanicUserId, appointmentId) {
        return this.appointmentManagementService.approveAppointment(mechanicUserId, appointmentId);
    }
    async completeAppointment(mechanicUserId, appointmentId) {
        return this.appointmentManagementService.completeAppointment(mechanicUserId, appointmentId);
    }
    async getAppointmentById(userId, appointmentId, userRole) {
        return this.appointmentQueryService.getAppointmentById(appointmentId, userId, userRole);
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        slot_service_1.SlotService,
        appointment_management_service_1.AppointmentManagementService,
        appointment_query_service_1.AppointmentQueryService,
        appointment_reminder_service_1.AppointmentReminderService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map