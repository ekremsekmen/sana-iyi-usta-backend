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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const customer_vehicle_service_1 = require("./services/customer-vehicle.service");
const vehicle_maintenance_record_service_1 = require("./services/vehicle-maintenance-record.service");
const files_service_1 = require("../files/files.service");
let CustomersService = class CustomersService {
    constructor(customerVehicleService, vehicleMaintenanceRecordService, filesService) {
        this.customerVehicleService = customerVehicleService;
        this.vehicleMaintenanceRecordService = vehicleMaintenanceRecordService;
        this.filesService = filesService;
    }
    async createVehicleForUser(userId, createVehicleDto) {
        return this.customerVehicleService.createVehicleForUser(userId, createVehicleDto);
    }
    async findAllVehiclesForUser(userId) {
        return this.customerVehicleService.findAllVehiclesForUser(userId);
    }
    async findVehicleForUser(userId, vehicleId) {
        return this.customerVehicleService.findVehicleForUser(userId, vehicleId);
    }
    async removeVehicleForUser(userId, vehicleId) {
        return this.customerVehicleService.removeVehicleForUser(userId, vehicleId);
    }
    async findVehicleMaintenanceRecords(userId, vehicleId) {
        return this.vehicleMaintenanceRecordService.findRecordsForVehicle(userId, vehicleId);
    }
    async uploadVehiclePhoto(userId, vehicleId, file) {
        const photoUrl = await this.filesService.uploadFile(file, 'vehicle-photos');
        return this.customerVehicleService.updateVehiclePhoto(userId, vehicleId, photoUrl);
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_vehicle_service_1.CustomerVehicleService,
        vehicle_maintenance_record_service_1.VehicleMaintenanceRecordService,
        files_service_1.FilesService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map