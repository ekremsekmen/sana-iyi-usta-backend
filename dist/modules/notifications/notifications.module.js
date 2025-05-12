"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_controller_1 = require("./notifications.controller");
const notifications_service_1 = require("./notifications.service");
const prisma_module_1 = require("../../prisma/prisma.module");
const fcm_service_1 = require("./services/fcm.service");
const campaign_notification_service_1 = require("./services/campaign-notification.service");
const appointment_notification_service_1 = require("./services/appointment-notification.service");
const message_notification_service_1 = require("./services/message-notification.service");
const maintenance_reminder_notification_service_1 = require("./services/maintenance-reminder-notification.service");
const review_notification_service_1 = require("./services/review-notification.service");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            notifications_service_1.NotificationsService,
            fcm_service_1.FcmService,
            campaign_notification_service_1.CampaignNotificationService,
            appointment_notification_service_1.AppointmentNotificationService,
            message_notification_service_1.MessageNotificationService,
            maintenance_reminder_notification_service_1.MaintenanceReminderNotificationService,
            review_notification_service_1.ReviewNotificationService
        ],
        exports: [
            notifications_service_1.NotificationsService,
            appointment_notification_service_1.AppointmentNotificationService,
            fcm_service_1.FcmService,
            message_notification_service_1.MessageNotificationService,
            maintenance_reminder_notification_service_1.MaintenanceReminderNotificationService,
            review_notification_service_1.ReviewNotificationService
        ]
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map