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
exports.CustomerVehicleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const crypto_1 = require("crypto");
const customer_validate_service_1 = require("./customer-validate.service");
let CustomerVehicleService = class CustomerVehicleService {
    constructor(prisma, customerValidateService) {
        this.prisma = prisma;
        this.customerValidateService = customerValidateService;
    }
    async createVehicleForUser(userId, createVehicleDto) {
        const customer = await this.customerValidateService.findCustomerByUserId(userId);
        return this.createVehicle(customer.id, createVehicleDto);
    }
    async findAllVehiclesForUser(userId) {
        const customer = await this.customerValidateService.findCustomerByUserId(userId);
        return this.findAllVehicles(customer.id);
    }
    async createVehicle(customerId, createVehicleDto) {
        const customerExists = await this.prisma.customers.findUnique({
            where: { id: customerId },
        });
        if (!customerExists) {
            throw new common_1.NotFoundException(`${customerId} ID'li müşteri bulunamadı`);
        }
        if (createVehicleDto.plate_number) {
            const existingVehicle = await this.prisma.customer_vehicles.findFirst({
                where: {
                    plate_number: createVehicleDto.plate_number,
                },
            });
            if (existingVehicle) {
                throw new common_1.ConflictException(`${createVehicleDto.plate_number} plakalı araç sistemde zaten kayıtlı`);
            }
        }
        const vehicle = await this.prisma.customer_vehicles.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                customer_id: customerId,
                ...createVehicleDto,
            },
            include: {
                brands: true,
                models: true,
                model_years: true,
                variants: true,
            },
        });
        return vehicle;
    }
    async findOneVehicle(id) {
        const vehicle = await this.prisma.customer_vehicles.findUnique({
            where: { id },
            include: {
                brands: true,
                models: true,
                model_years: true,
                variants: true,
            },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`${id} ID'li araç bulunamadı`);
        }
        return vehicle;
    }
    async findAllVehicles(customerId) {
        const customerExists = await this.prisma.customers.findUnique({
            where: { id: customerId },
        });
        if (!customerExists) {
            throw new common_1.NotFoundException(`${customerId} ID'li müşteri bulunamadı`);
        }
        return this.prisma.customer_vehicles.findMany({
            where: {
                customer_id: customerId,
            },
            include: {
                brands: true,
                models: true,
                model_years: true,
                variants: true,
            },
        });
    }
    async findVehicleForUser(userId, vehicleId) {
        const customer = await this.customerValidateService.findCustomerByUserId(userId);
        await this.customerValidateService.verifyVehicleOwnership(customer.id, vehicleId);
        return this.prisma.customer_vehicles.findFirst({
            where: {
                id: vehicleId,
                customer_id: customer.id
            },
            include: {
                brands: true,
                models: true,
                model_years: true,
                variants: true,
            },
        });
    }
    async removeVehicleForUser(userId, vehicleId) {
        const customer = await this.customerValidateService.findCustomerByUserId(userId);
        await this.customerValidateService.verifyVehicleOwnership(customer.id, vehicleId);
        await this.prisma.$transaction(async (prisma) => {
            await prisma.vehicle_maintenance_records.deleteMany({
                where: {
                    vehicle_id: vehicleId,
                },
            });
            await prisma.customer_vehicles.delete({
                where: {
                    id: vehicleId,
                },
            });
        });
    }
    async updateVehiclePhoto(userId, vehicleId, photoUrl) {
        const customer = await this.customerValidateService.findCustomerByUserId(userId);
        await this.customerValidateService.verifyVehicleOwnership(customer.id, vehicleId);
        const updatedVehicle = await this.prisma.customer_vehicles.update({
            where: {
                id: vehicleId,
            },
            data: {
                photo_url: photoUrl,
            },
            include: {
                brands: true,
                models: true,
                model_years: true,
                variants: true,
            },
        });
        return updatedVehicle;
    }
};
exports.CustomerVehicleService = CustomerVehicleService;
exports.CustomerVehicleService = CustomerVehicleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        customer_validate_service_1.CustomerValidateService])
], CustomerVehicleService);
//# sourceMappingURL=customer-vehicle.service.js.map