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
exports.AppointmentQueryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let AppointmentQueryService = class AppointmentQueryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCustomerAppointments(customerId) {
        return this.prisma.appointments.findMany({
            where: {
                customer_id: customerId,
            },
            include: {
                mechanics: {
                    include: {
                        users: true,
                    },
                },
                locations: true,
                customer_vehicles: {
                    include: {
                        brands: true,
                        models: true,
                    },
                },
            },
            orderBy: {
                start_time: 'asc',
            },
        });
    }
    async getMechanicAppointments(mechanicId) {
        return this.prisma.appointments.findMany({
            where: {
                mechanic_id: mechanicId,
            },
            include: {
                customers: {
                    include: {
                        users: true,
                    },
                },
                locations: true,
                customer_vehicles: {
                    include: {
                        brands: true,
                        models: true,
                    },
                },
            },
            orderBy: {
                start_time: 'asc',
            },
        });
    }
    async getAppointmentById(appointmentId, userId, userRole) {
        const appointment = await this.prisma.appointments.findUnique({
            where: {
                id: appointmentId,
            },
            include: {
                mechanics: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                full_name: true,
                                profile_image: true,
                                phone_number: true,
                            },
                        },
                    },
                },
                customers: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                full_name: true,
                                profile_image: true,
                                phone_number: true,
                            },
                        },
                    },
                },
                locations: true,
                customer_vehicles: {
                    include: {
                        brands: true,
                        models: true,
                        variants: true,
                        model_years: true,
                    },
                },
                vehicle_maintenance_records: true,
                ratings_reviews: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Randevu bulunamadı');
        }
        const isMechanic = userRole === 'mechanic' && appointment.mechanics.users.id === userId;
        const isCustomer = userRole === 'customer' && appointment.customers.users.id === userId;
        if (!isMechanic && !isCustomer) {
            throw new common_1.ForbiddenException('Bu randevuyu görüntüleme yetkiniz yok');
        }
        return appointment;
    }
};
exports.AppointmentQueryService = AppointmentQueryService;
exports.AppointmentQueryService = AppointmentQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentQueryService);
//# sourceMappingURL=appointment-query.service.js.map