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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const vehicle_select_service_1 = require("./services/vehicle-select.service");
let VehiclesService = class VehiclesService {
    constructor(prisma, vehicleSelectService) {
        this.prisma = prisma;
        this.vehicleSelectService = vehicleSelectService;
    }
    async getAllBrands() {
        return this.vehicleSelectService.findAllBrands();
    }
    async getModelsByBrand(brandId) {
        return this.vehicleSelectService.findModelsByBrandId(brandId);
    }
    async getYearsByModel(modelId) {
        return this.vehicleSelectService.findYearsByModelId(modelId);
    }
    async getVariantsByYear(yearId) {
        return this.vehicleSelectService.findVariantsByYearId(yearId);
    }
    async getFullVehicleInfo(variantId) {
        return this.vehicleSelectService.getFullVehicleInfo(variantId);
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vehicle_select_service_1.VehicleSelectService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map