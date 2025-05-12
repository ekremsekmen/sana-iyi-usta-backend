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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const customer_vehicle_dto_1 = require("./dto/customer-vehicle.dto");
const guards_1 = require("../../common/guards");
const platform_express_1 = require("@nestjs/platform-express");
let CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    async getMyVehicles(request) {
        return this.customersService.findAllVehiclesForUser(request.user.id);
    }
    async addMyVehicle(createVehicleDto, request) {
        return this.customersService.createVehicleForUser(request.user.id, createVehicleDto);
    }
    async getMyVehicle(vehicleId, request) {
        return this.customersService.findVehicleForUser(request.user.id, vehicleId);
    }
    async deleteMyVehicle(vehicleId, request) {
        return this.customersService.removeVehicleForUser(request.user.id, vehicleId);
    }
    async getVehicleMaintenanceRecords(vehicleId, request) {
        return this.customersService.findVehicleMaintenanceRecords(request.user.id, vehicleId);
    }
    async uploadVehiclePhoto(vehicleId, file, request) {
        return this.customersService.uploadVehiclePhoto(request.user.id, vehicleId, file);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)('vehicles'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getMyVehicles", null);
__decorate([
    (0, common_1.Post)('vehicles'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_vehicle_dto_1.CreateCustomerVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "addMyVehicle", null);
__decorate([
    (0, common_1.Get)('vehicles/:vehicleId'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('vehicleId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getMyVehicle", null);
__decorate([
    (0, common_1.Delete)('vehicles/:vehicleId'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('vehicleId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "deleteMyVehicle", null);
__decorate([
    (0, common_1.Get)('vehicles/:vehicleId/maintenance-records'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('vehicleId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getVehicleMaintenanceRecords", null);
__decorate([
    (0, common_1.Patch)('vehicles/:vehicleId/photo'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('vehicleId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "uploadVehiclePhoto", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map