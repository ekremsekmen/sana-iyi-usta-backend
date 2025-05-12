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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const vehicles_service_1 = require("./vehicles.service");
const guards_1 = require("../../common/guards");
let VehiclesController = class VehiclesController {
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    async getAllBrands() {
        return this.vehiclesService.getAllBrands();
    }
    async getModelsByBrand(brandId) {
        return this.vehiclesService.getModelsByBrand(brandId);
    }
    async getYearsByModel(modelId) {
        return this.vehiclesService.getYearsByModel(modelId);
    }
    async getVariantsByYear(yearId) {
        return this.vehiclesService.getVariantsByYear(yearId);
    }
    async getVehicleInfo(variantId) {
        const vehicleInfo = await this.vehiclesService.getFullVehicleInfo(variantId);
        if (!vehicleInfo) {
            throw new common_1.NotFoundException('Bu varyant bulunamadı');
        }
        return vehicleInfo;
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Get)('brands'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getAllBrands", null);
__decorate([
    (0, common_1.Get)('brands/:brandId/models'),
    __param(0, (0, common_1.Param)('brandId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getModelsByBrand", null);
__decorate([
    (0, common_1.Get)('models/:modelId/years'),
    __param(0, (0, common_1.Param)('modelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getYearsByModel", null);
__decorate([
    (0, common_1.Get)('years/:yearId/variants'),
    __param(0, (0, common_1.Param)('yearId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getVariantsByYear", null);
__decorate([
    (0, common_1.Get)('vehicle/:variantId'),
    __param(0, (0, common_1.Param)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getVehicleInfo", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Controller)('vehicle-select'),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map