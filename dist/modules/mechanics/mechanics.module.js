"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicsModule = void 0;
const common_1 = require("@nestjs/common");
const mechanics_controller_1 = require("./mechanics.controller");
const mechanics_service_1 = require("./mechanics.service");
const mechanic_profile_service_1 = require("./services/mechanic-profile.service");
const mechanic_working_hours_service_1 = require("./services/mechanic-working-hours.service");
const mechanic_supported_vehicles_service_1 = require("./services/mechanic-supported-vehicles.service");
const mechanic_categories_service_1 = require("./services/mechanic-categories.service");
const mechanic_search_service_1 = require("./services/mechanic-search.service");
const mechanic_vehicle_maintenance_service_1 = require("./services/mechanic-vehicle-maintenance.service");
const mechanic_detail_service_1 = require("./services/mechanic-detail.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_module_1 = require("../../prisma/prisma.module");
const locations_module_1 = require("../locations/locations.module");
const notifications_module_1 = require("../notifications/notifications.module");
let MechanicsModule = class MechanicsModule {
};
exports.MechanicsModule = MechanicsModule;
exports.MechanicsModule = MechanicsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            locations_module_1.LocationsModule,
            notifications_module_1.NotificationsModule
        ],
        controllers: [mechanics_controller_1.MechanicsController],
        providers: [
            mechanics_service_1.MechanicsService,
            mechanic_profile_service_1.MechanicProfileService,
            mechanic_working_hours_service_1.MechanicWorkingHoursService,
            mechanic_supported_vehicles_service_1.MechanicSupportedVehiclesService,
            mechanic_categories_service_1.MechanicCategoriesService,
            mechanic_search_service_1.MechanicSearchService,
            mechanic_vehicle_maintenance_service_1.MechanicVehicleMaintenanceService,
            mechanic_detail_service_1.MechanicDetailService,
            prisma_service_1.PrismaService
        ],
        exports: [mechanics_service_1.MechanicsService]
    })
], MechanicsModule);
//# sourceMappingURL=mechanics.module.js.map