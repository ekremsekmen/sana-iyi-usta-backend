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
exports.MechanicVehicleMaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const crypto_1 = require("crypto");
const notifications_service_1 = require("../../notifications/notifications.service");
let MechanicVehicleMaintenanceService = class MechanicVehicleMaintenanceService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async createMaintenanceRecord(mechanicId, dto) {
        const appointment = await this.prisma.appointments.findUnique({
            where: { id: dto.appointment_id },
            include: {
                customer_vehicles: true,
                vehicle_maintenance_records: true,
                mechanics: true,
                customers: true
            }
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Randevu bulunamadı');
        }
        if (appointment.mechanic_id !== mechanicId) {
            throw new common_1.BadRequestException('Bu randevu sizin değil');
        }
        if (appointment.status !== 'confirmed' && appointment.status !== 'completed') {
            throw new common_1.BadRequestException('Yalnızca onaylanmış veya tamamlanmış randevular için bakım kaydı girebilirsiniz');
        }
        const existingRecord = await this.prisma.vehicle_maintenance_records.findUnique({
            where: { appointment_id: dto.appointment_id }
        });
        if (existingRecord) {
            throw new common_1.BadRequestException('Bu randevu için zaten bir bakım kaydı oluşturulmuş');
        }
        const maintenanceRecord = await this.prisma.vehicle_maintenance_records.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                vehicle_id: appointment.vehicle_id,
                mechanic_id: mechanicId,
                customer_id: appointment.customer_id,
                appointment_id: dto.appointment_id,
                details: dto.details,
                cost: dto.cost,
                odometer: dto.odometer,
                next_due_date: dto.next_due_date ? new Date(dto.next_due_date) : null
            }
        });
        if (maintenanceRecord) {
            try {
                await this.notificationsService.notifyMaintenanceRecordCreated(appointment.customers.user_id, appointment.vehicle_id, appointment.mechanics.business_name, dto.details);
            }
            catch (error) {
                console.error('Bakım kaydı bildirimi gönderilirken hata:', error);
            }
        }
        return maintenanceRecord;
    }
    async getMaintenanceRecordsByVehicle(mechanicId, vehicleId) {
        return this.prisma.vehicle_maintenance_records.findMany({
            where: {
                vehicle_id: vehicleId,
                mechanic_id: mechanicId
            },
            include: {
                appointments: {
                    select: {
                        appointment_date: true,
                        status: true,
                        appointment_type: true
                    }
                }
            },
            orderBy: {
                service_date: 'desc'
            }
        });
    }
};
exports.MechanicVehicleMaintenanceService = MechanicVehicleMaintenanceService;
exports.MechanicVehicleMaintenanceService = MechanicVehicleMaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], MechanicVehicleMaintenanceService);
//# sourceMappingURL=mechanic-vehicle-maintenance.service.js.map