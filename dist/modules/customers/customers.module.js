"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const customers_controller_1 = require("./customers.controller");
const customers_service_1 = require("./customers.service");
const customer_vehicle_service_1 = require("./services/customer-vehicle.service");
const vehicle_maintenance_record_service_1 = require("./services/vehicle-maintenance-record.service");
const customer_validate_service_1 = require("./services/customer-validate.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const files_module_1 = require("../files/files.module");
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = __decorate([
    (0, common_1.Module)({
        imports: [files_module_1.FilesModule],
        controllers: [customers_controller_1.CustomersController],
        providers: [
            customers_service_1.CustomersService,
            customer_vehicle_service_1.CustomerVehicleService,
            vehicle_maintenance_record_service_1.VehicleMaintenanceRecordService,
            customer_validate_service_1.CustomerValidateService,
            prisma_service_1.PrismaService
        ],
        exports: [customers_service_1.CustomersService]
    })
], CustomersModule);
//# sourceMappingURL=customers.module.js.map