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
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const campaign_create_service_1 = require("./services/campaign-create.service");
const campaign_query_service_1 = require("./services/campaign-query.service");
const campaign_update_service_1 = require("./services/campaign-update.service");
const campaign_delete_service_1 = require("./services/campaign-delete.service");
const mechanics_service_1 = require("../mechanics/mechanics.service");
let CampaignsService = class CampaignsService {
    constructor(createService, queryService, updateService, deleteService, mechanicsService) {
        this.createService = createService;
        this.queryService = queryService;
        this.updateService = updateService;
        this.deleteService = deleteService;
        this.mechanicsService = mechanicsService;
    }
    async validateAndGetMechanicProfile(userId) {
        return this.mechanicsService.validateAndGetMechanicProfile(userId);
    }
    async create(mechanicId, createCampaignDto, userId) {
        return this.createService.create(mechanicId, createCampaignDto, userId);
    }
    async findByMechanic(mechanicId, userId) {
        return this.queryService.findByMechanic(mechanicId, userId);
    }
    async update(id, mechanicId, updateCampaignDto, userId) {
        return this.updateService.update(id, mechanicId, updateCampaignDto, userId);
    }
    async remove(id, mechanicId, userId) {
        return this.deleteService.remove(id, mechanicId, userId);
    }
    async findCampaignsForCustomer(userId) {
        return this.queryService.findCampaignsForCustomer(userId);
    }
    async findCampaignDetails(campaignId) {
        return this.queryService.findCampaignDetails(campaignId);
    }
    async updateImage(id, mechanicId, file, userId) {
        return this.updateService.updateImage(id, mechanicId, file, userId);
    }
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [campaign_create_service_1.CampaignCreateService,
        campaign_query_service_1.CampaignQueryService,
        campaign_update_service_1.CampaignUpdateService,
        campaign_delete_service_1.CampaignDeleteService,
        mechanics_service_1.MechanicsService])
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map