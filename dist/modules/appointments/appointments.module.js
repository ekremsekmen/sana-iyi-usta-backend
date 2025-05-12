"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsModule = void 0;
const common_1 = require("@nestjs/common");
const appointments_controller_1 = require("./appointments.controller");
const appointments_service_1 = require("./appointments.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const slot_service_1 = require("./services/slot.service");
const appointment_management_service_1 = require("./services/appointment-management.service");
const appointment_query_service_1 = require("./services/appointment-query.service");
const notifications_module_1 = require("../notifications/notifications.module");
const appointment_reminder_service_1 = require("./services/appointment-reminder.service");
let AppointmentsModule = class AppointmentsModule {
};
exports.AppointmentsModule = AppointmentsModule;
exports.AppointmentsModule = AppointmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [appointments_controller_1.AppointmentsController],
        providers: [
            appointments_service_1.AppointmentsService,
            slot_service_1.SlotService,
            appointment_management_service_1.AppointmentManagementService,
            appointment_query_service_1.AppointmentQueryService,
            prisma_service_1.PrismaService,
            appointment_reminder_service_1.AppointmentReminderService
        ],
        exports: [appointments_service_1.AppointmentsService]
    })
], AppointmentsModule);
//# sourceMappingURL=appointments.module.js.map