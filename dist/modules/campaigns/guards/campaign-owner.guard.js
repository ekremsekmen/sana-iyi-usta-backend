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
exports.CampaignOwnerGuard = void 0;
const common_1 = require("@nestjs/common");
const campaign_validation_service_1 = require("../services/campaign-validation.service");
let CampaignOwnerGuard = class CampaignOwnerGuard {
    constructor(validationService) {
        this.validationService = validationService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const { id, mechanicId } = request.params;
        if (!id || !mechanicId) {
            throw new common_1.ForbiddenException('Kampanya veya mekanik bilgisi eksik.');
        }
        try {
            await this.validationService.validateCampaignOwnership(id, mechanicId);
            await this.validationService.validateMechanicOwnership(mechanicId, user.id);
            return true;
        }
        catch (error) {
            throw new common_1.ForbiddenException('Bu işlemi gerçekleştirme yetkiniz yok.');
        }
    }
};
exports.CampaignOwnerGuard = CampaignOwnerGuard;
exports.CampaignOwnerGuard = CampaignOwnerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [campaign_validation_service_1.CampaignValidationService])
], CampaignOwnerGuard);
//# sourceMappingURL=campaign-owner.guard.js.map