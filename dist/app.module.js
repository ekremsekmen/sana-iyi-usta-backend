"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const mechanics_module_1 = require("./modules/mechanics/mechanics.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const vehicles_module_1 = require("./modules/vehicles/vehicles.module");
const campaigns_module_1 = require("./modules/campaigns/campaigns.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const messages_module_1 = require("./modules/messages/messages.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const customers_module_1 = require("./modules/customers/customers.module");
const locations_module_1 = require("./modules/locations/locations.module");
const prisma_module_1 = require("./prisma/prisma.module");
const throttler_1 = require("@nestjs/throttler");
const config_1 = require("@nestjs/config");
const services_module_1 = require("./modules/services/services.module");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 1000,
                    name: 'default',
                }]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            mechanics_module_1.MechanicsModule,
            appointments_module_1.AppointmentsModule,
            vehicles_module_1.VehiclesModule,
            campaigns_module_1.CampaignsModule,
            notifications_module_1.NotificationsModule,
            messages_module_1.MessagesModule,
            reviews_module_1.ReviewsModule,
            customers_module_1.CustomersModule,
            locations_module_1.LocationsModule,
            prisma_module_1.PrismaModule,
            services_module_1.ServicesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map