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
exports.CampaignsController = void 0;
const common_1 = require("@nestjs/common");
const campaigns_service_1 = require("./campaigns.service");
const campaign_dto_1 = require("./dto/campaign.dto");
const guards_1 = require("../../common/guards");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const platform_express_1 = require("@nestjs/platform-express");
let CampaignsController = class CampaignsController {
    constructor(campaignsService) {
        this.campaignsService = campaignsService;
    }
    async findByMechanic(request) {
        const mechanic = await this.campaignsService.validateAndGetMechanicProfile(request.user.id);
        return this.campaignsService.findByMechanic(mechanic.id, request.user.id);
    }
    async create(createCampaignDto, request) {
        const mechanic = await this.campaignsService.validateAndGetMechanicProfile(request.user.id);
        return this.campaignsService.create(mechanic.id, createCampaignDto, request.user.id);
    }
    async update(id, updateCampaignDto, request) {
        const mechanic = await this.campaignsService.validateAndGetMechanicProfile(request.user.id);
        return this.campaignsService.update(id, mechanic.id, updateCampaignDto, request.user.id);
    }
    async remove(id, request) {
        const mechanic = await this.campaignsService.validateAndGetMechanicProfile(request.user.id);
        return this.campaignsService.remove(id, mechanic.id, request.user.id);
    }
    async findCampaignsForCustomer(request) {
        return this.campaignsService.findCampaignsForCustomer(request.user.id);
    }
    async findCampaignDetails(id) {
        return this.campaignsService.findCampaignDetails(id);
    }
    async uploadImage(id, file, request) {
        const mechanic = await this.campaignsService.validateAndGetMechanicProfile(request.user.id);
        return this.campaignsService.updateImage(id, mechanic.id, file, request.user.id);
    }
};
exports.CampaignsController = CampaignsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.MECHANIC),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "findByMechanic", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.MECHANIC),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [campaign_dto_1.CampaignDto, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, campaign_dto_1.CampaignDto, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('campaign-for-customer'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "findCampaignsForCustomer", null);
__decorate([
    (0, common_1.Get)(':id/details'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "findCampaignDetails", null);
__decorate([
    (0, common_1.Patch)(':id/campaign-image'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.MECHANIC),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "uploadImage", null);
exports.CampaignsController = CampaignsController = __decorate([
    (0, common_1.Controller)('campaigns'),
    (0, common_1.UseGuards)(guards_1.JwtGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [campaigns_service_1.CampaignsService])
], CampaignsController);
//# sourceMappingURL=campaigns.controller.js.map