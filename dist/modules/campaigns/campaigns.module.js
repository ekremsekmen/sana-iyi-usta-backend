"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignsModule = void 0;
const common_1 = require("@nestjs/common");
const campaigns_controller_1 = require("./campaigns.controller");
const campaigns_service_1 = require("./campaigns.service");
const prisma_module_1 = require("../../prisma/prisma.module");
const mechanics_module_1 = require("../mechanics/mechanics.module");
const campaign_create_service_1 = require("./services/campaign-create.service");
const campaign_query_service_1 = require("./services/campaign-query.service");
const campaign_update_service_1 = require("./services/campaign-update.service");
const campaign_delete_service_1 = require("./services/campaign-delete.service");
const campaign_validation_service_1 = require("./services/campaign-validation.service");
const notifications_module_1 = require("../notifications/notifications.module");
const files_module_1 = require("../files/files.module");
let CampaignsModule = class CampaignsModule {
};
exports.CampaignsModule = CampaignsModule;
exports.CampaignsModule = CampaignsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, mechanics_module_1.MechanicsModule, notifications_module_1.NotificationsModule, files_module_1.FilesModule],
        controllers: [campaigns_controller_1.CampaignsController],
        providers: [
            campaigns_service_1.CampaignsService,
            campaign_validation_service_1.CampaignValidationService,
            campaign_create_service_1.CampaignCreateService,
            campaign_query_service_1.CampaignQueryService,
            campaign_update_service_1.CampaignUpdateService,
            campaign_delete_service_1.CampaignDeleteService,
        ],
        exports: [campaigns_service_1.CampaignsService]
    })
], CampaignsModule);
//# sourceMappingURL=campaigns.module.js.map