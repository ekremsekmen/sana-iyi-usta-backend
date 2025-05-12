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
exports.CampaignValidationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let CampaignValidationService = class CampaignValidationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateMechanicOwnership(mechanicId, userId) {
        const mechanic = await this.prisma.mechanics.findUnique({
            where: { id: mechanicId }
        });
        if (!mechanic || mechanic.user_id !== userId) {
            throw new common_1.BadRequestException('Bu tamirci için kampanya işlemi yapma yetkiniz yok');
        }
    }
    async validateCampaignOwnership(campaignId, mechanicId) {
        const existingCampaign = await this.prisma.campaigns.findUnique({
            where: { id: campaignId },
        });
        if (!existingCampaign) {
            throw new common_1.NotFoundException(`ID'si ${campaignId} olan kampanya bulunamadı`);
        }
        if (existingCampaign.mechanic_id !== mechanicId) {
            throw new common_1.BadRequestException('Bu kampanya üzerinde işlem yapma yetkiniz yok');
        }
        return existingCampaign;
    }
    async validateBrands(mechanicId, brandIds) {
        if (!brandIds || brandIds.length === 0) {
            throw new common_1.BadRequestException('En az bir marka seçmelisiniz');
        }
        const supportedBrands = await this.prisma.mechanic_supported_vehicles.findMany({
            where: {
                mechanic_id: mechanicId,
                brand_id: { in: brandIds }
            },
            select: {
                brand_id: true
            }
        });
        const supportedBrandIds = new Set(supportedBrands.map(sb => sb.brand_id));
        const unsupportedBrandIds = brandIds.filter(id => !supportedBrandIds.has(id));
        if (unsupportedBrandIds.length > 0) {
            throw new common_1.BadRequestException(`Bir veya daha fazla marka için hizmet vermiyorsunuz. Lütfen desteklediğiniz markalar seçin.`);
        }
    }
    async validateCategories(mechanicId, categoryIds) {
        if (!categoryIds || categoryIds.length === 0) {
            throw new common_1.BadRequestException('En az bir kategori seçmelisiniz');
        }
        const existingCategories = await this.prisma.categories.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, name: true }
        });
        if (existingCategories.length !== categoryIds.length) {
            const existingCategoryIds = new Set(existingCategories.map(c => c.id));
            const nonExistentCategoryIds = categoryIds.filter(id => !existingCategoryIds.has(id));
            throw new common_1.NotFoundException(`Bu ID'lere sahip kategoriler bulunamadı: ${nonExistentCategoryIds.join(', ')}`);
        }
        const supportedCategories = await this.prisma.mechanic_categories.findMany({
            where: {
                mechanic_id: mechanicId,
                category_id: { in: categoryIds }
            },
            select: {
                category_id: true
            }
        });
        const supportedCategoryIds = new Set(supportedCategories.map(sc => sc.category_id));
        const unsupportedCategories = existingCategories.filter(category => !supportedCategoryIds.has(category.id));
        if (unsupportedCategories.length > 0) {
            const categoryNames = unsupportedCategories.map(c => c.name).join(', ');
            throw new common_1.BadRequestException(`${categoryNames} ${unsupportedCategories.length > 1 ? 'kategorileri' : 'kategorisi'} için hizmet vermiyorsunuz. Lütfen desteklediğiniz kategorileri seçin.`);
        }
        return true;
    }
    validateDate(dateString) {
        const validUntilDate = new Date(dateString);
        if (isNaN(validUntilDate.getTime())) {
            throw new common_1.BadRequestException('Geçersiz tarih formatı');
        }
        if (validUntilDate <= new Date()) {
            throw new common_1.BadRequestException('Kampanya bitiş tarihi gelecek bir tarih olmalıdır');
        }
        return validUntilDate;
    }
};
exports.CampaignValidationService = CampaignValidationService;
exports.CampaignValidationService = CampaignValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CampaignValidationService);
//# sourceMappingURL=campaign-validation.service.js.map