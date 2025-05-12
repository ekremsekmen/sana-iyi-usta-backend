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
exports.VehicleMaintenanceRecordService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let VehicleMaintenanceRecordService = class VehicleMaintenanceRecordService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findRecordsForVehicle(userId, vehicleId) {
        const vehicle = await this.prisma.customer_vehicles.findFirst({
            where: {
                id: vehicleId,
                customers: {
                    user_id: userId
                }
            }
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Araç bulunamadı veya bu kullanıcıya ait değil');
        }
        const records = await this.findMaintenanceRecords(vehicleId);
        return records;
    }
    async findMaintenanceRecords(vehicleId) {
        return this.prisma.$transaction(async (prisma) => {
            const maintenanceRecords = await prisma.vehicle_maintenance_records.findMany({
                where: {
                    vehicle_id: vehicleId
                },
                include: {
                    mechanics: {
                        select: {
                            id: true,
                            business_name: true
                        }
                    },
                    appointments: {
                        select: {
                            appointment_date: true,
                            status: true,
                            appointment_type: true,
                            mechanics: {
                                select: {
                                    business_name: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    service_date: 'desc'
                }
            });
            return maintenanceRecords;
        });
    }
};
exports.VehicleMaintenanceRecordService = VehicleMaintenanceRecordService;
exports.VehicleMaintenanceRecordService = VehicleMaintenanceRecordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehicleMaintenanceRecordService);
//# sourceMappingURL=vehicle-maintenance-record.service.js.map