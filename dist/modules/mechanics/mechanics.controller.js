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
exports.MechanicsController = void 0;
const common_1 = require("@nestjs/common");
const mechanics_service_1 = require("./mechanics.service");
const mechanic_profile_dto_1 = require("./dto/mechanic-profile.dto");
const guards_1 = require("../../common/guards");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const search_mechanics_dto_1 = require("./dto/search-mechanics.dto");
const create_vehicle_maintenance_record_dto_1 = require("./dto/create-vehicle-maintenance-record.dto");
let MechanicsController = class MechanicsController {
    constructor(mechanicsService) {
        this.mechanicsService = mechanicsService;
    }
    create(mechanicProfileDto, request) {
        return this.mechanicsService.create(request.user.id, mechanicProfileDto);
    }
    async findOne(request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return mechanicProfile;
    }
    async update(mechanicProfileDto, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.update(mechanicProfile.id, request.user.id, mechanicProfileDto);
    }
    async remove(request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.remove(mechanicProfile.id);
    }
    async getSupportedVehicles(request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.getSupportedVehicles(mechanicProfile.id);
    }
    async addSupportedVehicle(body, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.addSupportedVehicleForMechanic(mechanicProfile.id, body);
    }
    async removeSupportedVehicle(brandId, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.removeSupportedVehicleByBrand(mechanicProfile.id, brandId);
    }
    async updateSupportedVehicles(dto, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.updateSupportedVehiclesForMechanic(mechanicProfile.id, dto);
    }
    async getWorkingHours(request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.getWorkingHours(mechanicProfile.id);
    }
    async createWorkingHours(mechanicWorkingHoursDto, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.createWorkingHours(mechanicProfile.id, mechanicWorkingHoursDto);
    }
    async updateWorkingHours(hourId, mechanicWorkingHoursDto, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        await this.mechanicsService.validateWorkingHourBelongsToMechanic(hourId, mechanicProfile.id);
        return this.mechanicsService.updateWorkingHours(hourId, mechanicWorkingHoursDto);
    }
    async deleteWorkingHours(hourId, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        await this.mechanicsService.validateWorkingHourBelongsToMechanic(hourId, mechanicProfile.id);
        return this.mechanicsService.deleteWorkingHours(hourId);
    }
    async getCategories(request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.getCategories(mechanicProfile.id);
    }
    async addCategory(body, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.addCategoryForMechanic(mechanicProfile.id, body);
    }
    async removeCategory(categoryId, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.removeCategoryByMechanicAndCategory(mechanicProfile.id, categoryId);
    }
    async updateCategories(dto, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.updateCategoriesForMechanic(mechanicProfile.id, dto);
    }
    async checkMechanicProfile(request) {
        return this.mechanicsService.findByUserId(request.user.id);
    }
    async searchMechanics(searchDto, request) {
        return this.mechanicsService.searchMechanics(request.user.id, searchDto);
    }
    async createMaintenanceRecord(dto, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.createMaintenanceRecord(mechanicProfile.id, dto);
    }
    async getMaintenanceRecordsByVehicle(vehicleId, request) {
        const mechanicProfile = await this.mechanicsService.validateAndGetMechanicProfile(request.user.id);
        return this.mechanicsService.getMaintenanceRecordsByVehicle(mechanicProfile.id, vehicleId);
    }
    async getMechanicDetailByUserId(userId) {
        return this.mechanicsService.getMechanicDetailByUserId(userId);
    }
    async getMechanicById(mechanicId) {
        return this.mechanicsService.getMechanicDetailById(mechanicId);
    }
};
exports.MechanicsController = MechanicsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.MECHANIC),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mechanic_profile_dto_1.MechanicProfileDto, Object]),
    __metadata("design:returntype", void 0)
], MechanicsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Patch)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mechanic_profile_dto_1.MechanicProfileDto, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Get)('supported-vehicles'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "getSupportedVehicles", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Post)('supported-vehicles'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "addSupportedVehicle", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Delete)('supported-vehicles/:brandId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('brandId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "removeSupportedVehicle", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Patch)('supported-vehicles'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "updateSupportedVehicles", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Get)('working-hours'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "getWorkingHours", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Post)('working-hours'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "createWorkingHours", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Patch)('working-hours/:hourId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('hourId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true }))),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "updateWorkingHours", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Delete)('working-hours/:hourId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('hourId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "deleteWorkingHours", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Get)('categories'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Post)('categories'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "addCategory", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Delete)('categories/:categoryId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('categoryId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "removeCategory", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Patch)('categories'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "updateCategories", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Get)('profile/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "checkMechanicProfile", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Post)('search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_mechanics_dto_1.SearchMechanicsDto, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "searchMechanics", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Post)('maintenance-records'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.MECHANIC),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_maintenance_record_dto_1.CreateVehicleMaintenanceRecordDto, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "createMaintenanceRecord", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Get)('vehicles/:vehicleId/maintenance-records'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('vehicleId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "getMaintenanceRecordsByVehicle", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Get)('detail-by-userid/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "getMechanicDetailByUserId", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.Get)('detail-by-mechanicid/:mechanicId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('mechanicId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MechanicsController.prototype, "getMechanicById", null);
exports.MechanicsController = MechanicsController = __decorate([
    (0, common_1.Controller)('mechanics'),
    (0, common_1.UseGuards)(guards_1.JwtGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [mechanics_service_1.MechanicsService])
], MechanicsController);
//# sourceMappingURL=mechanics.controller.js.map