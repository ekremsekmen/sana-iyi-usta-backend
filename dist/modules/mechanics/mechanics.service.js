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
exports.MechanicsService = void 0;
const common_1 = require("@nestjs/common");
const mechanic_profile_service_1 = require("./services/mechanic-profile.service");
const mechanic_working_hours_service_1 = require("./services/mechanic-working-hours.service");
const mechanic_supported_vehicles_service_1 = require("./services/mechanic-supported-vehicles.service");
const mechanic_categories_service_1 = require("./services/mechanic-categories.service");
const mechanic_search_service_1 = require("./services/mechanic-search.service");
const mechanic_vehicle_maintenance_service_1 = require("./services/mechanic-vehicle-maintenance.service");
const mechanic_detail_service_1 = require("./services/mechanic-detail.service");
let MechanicsService = class MechanicsService {
    constructor(mechanicProfileService, mechanicWorkingHoursService, mechanicSupportedVehiclesService, mechanicCategoriesService, mechanicSearchService, mechanicVehicleMaintenanceService, mechanicDetailService) {
        this.mechanicProfileService = mechanicProfileService;
        this.mechanicWorkingHoursService = mechanicWorkingHoursService;
        this.mechanicSupportedVehiclesService = mechanicSupportedVehiclesService;
        this.mechanicCategoriesService = mechanicCategoriesService;
        this.mechanicSearchService = mechanicSearchService;
        this.mechanicVehicleMaintenanceService = mechanicVehicleMaintenanceService;
        this.mechanicDetailService = mechanicDetailService;
    }
    create(userId, createMechanicDto) {
        return this.mechanicProfileService.create(userId, createMechanicDto);
    }
    findOne(id) {
        return this.mechanicProfileService.findOne(id);
    }
    update(id, userId, updateMechanicDto) {
        return this.mechanicProfileService.update(id, userId, updateMechanicDto);
    }
    remove(id) {
        return this.mechanicProfileService.remove(id);
    }
    createWorkingHours(mechanicId, dto) {
        return this.mechanicWorkingHoursService.createForMechanic(mechanicId, dto);
    }
    getWorkingHours(mechanicId) {
        return this.mechanicWorkingHoursService.findByMechanic(mechanicId);
    }
    getWorkingHourById(id) {
        return this.mechanicWorkingHoursService.findOne(id);
    }
    updateWorkingHours(id, dto) {
        return this.mechanicWorkingHoursService.update(id, dto);
    }
    deleteWorkingHours(id) {
        return this.mechanicWorkingHoursService.remove(id);
    }
    updateBulkWorkingHours(mechanicId, dtoList) {
        return this.mechanicWorkingHoursService.createOrUpdateBulk(mechanicId, dtoList);
    }
    getSupportedVehicles(mechanicId) {
        return this.mechanicSupportedVehiclesService.findByMechanic(mechanicId);
    }
    addSupportedVehicle(dto) {
        return this.mechanicSupportedVehiclesService.addSupportedVehicle(dto);
    }
    addSupportedVehicleForMechanic(mechanicId, dto) {
        return this.mechanicSupportedVehiclesService.addSupportedVehicleForMechanic(mechanicId, dto);
    }
    updateSupportedVehiclesForMechanic(mechanicId, dtoList) {
        return this.mechanicSupportedVehiclesService.updateSupportedVehiclesForMechanic(mechanicId, dtoList);
    }
    removeSupportedVehicle(id) {
        return this.mechanicSupportedVehiclesService.remove(id);
    }
    removeSupportedVehicleByBrand(mechanicId, brandId) {
        return this.mechanicSupportedVehiclesService.removeByMechanicAndBrand(mechanicId, brandId);
    }
    updateBulkSupportedVehicles(mechanicId, brandIds) {
        return this.mechanicSupportedVehiclesService.updateBulkSupportedVehicles(mechanicId, brandIds);
    }
    getCategories(mechanicId) {
        return this.mechanicCategoriesService.findByMechanic(mechanicId);
    }
    addCategory(dto) {
        return this.mechanicCategoriesService.create(dto);
    }
    addCategoryForMechanic(mechanicId, dto) {
        return this.mechanicCategoriesService.createForMechanic(mechanicId, dto);
    }
    removeCategory(id) {
        return this.mechanicCategoriesService.remove(id);
    }
    removeCategoryByMechanicAndCategory(mechanicId, categoryId) {
        return this.mechanicCategoriesService.removeByMechanicAndCategory(mechanicId, categoryId);
    }
    updateBulkCategories(mechanicId, categoryIds) {
        return this.mechanicCategoriesService.updateBulkCategories(mechanicId, categoryIds);
    }
    updateCategoriesForMechanic(mechanicId, dto) {
        dto.forEach(item => item.mechanic_id = mechanicId);
        return this.updateBulkCategories(mechanicId, dto.map(item => item.category_id));
    }
    findByUserId(userId) {
        return this.mechanicProfileService.findByUserId(userId);
    }
    async searchMechanics(userId, searchDto) {
        return this.mechanicSearchService.searchMechanics(userId, searchDto);
    }
    async createMaintenanceRecord(mechanicId, dto) {
        return this.mechanicVehicleMaintenanceService.createMaintenanceRecord(mechanicId, dto);
    }
    async getMaintenanceRecordsByVehicle(mechanicId, vehicleId) {
        return this.mechanicVehicleMaintenanceService.getMaintenanceRecordsByVehicle(mechanicId, vehicleId);
    }
    async validateAndGetMechanicProfile(userId) {
        const mechanic = await this.findByUserId(userId);
        if (!mechanic.hasMechanicProfile) {
            throw new common_1.NotFoundException('Tamirci profili bulunamadı.');
        }
        return mechanic.profile;
    }
    async validateWorkingHourBelongsToMechanic(hourId, mechanicId) {
        const existingHours = await this.getWorkingHourById(hourId);
        if (!existingHours || existingHours.mechanic_id !== mechanicId) {
            throw new common_1.NotFoundException('Belirtilen çalışma saati kaydı bulunamadı veya bu tamirciye ait değil.');
        }
        return existingHours;
    }
    async getMechanicDetailByUserId(userId) {
        return this.mechanicDetailService.getMechanicDetailByUserId(userId);
    }
    async getMechanicDetailById(mechanicId) {
        return this.mechanicDetailService.getMechanicDetailById(mechanicId);
    }
};
exports.MechanicsService = MechanicsService;
exports.MechanicsService = MechanicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mechanic_profile_service_1.MechanicProfileService,
        mechanic_working_hours_service_1.MechanicWorkingHoursService,
        mechanic_supported_vehicles_service_1.MechanicSupportedVehiclesService,
        mechanic_categories_service_1.MechanicCategoriesService,
        mechanic_search_service_1.MechanicSearchService,
        mechanic_vehicle_maintenance_service_1.MechanicVehicleMaintenanceService,
        mechanic_detail_service_1.MechanicDetailService])
], MechanicsService);
//# sourceMappingURL=mechanics.service.js.map