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
exports.CampaignDeleteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const campaign_validation_service_1 = require("./campaign-validation.service");
const client_1 = require("@prisma/client");
let CampaignDeleteService = class CampaignDeleteService {
    constructor(prisma, validationService) {
        this.prisma = prisma;
        this.validationService = validationService;
    }
    async remove(id, mechanicId, userId) {
        try {
            await this.validationService.validateMechanicOwnership(mechanicId, userId);
            await this.validationService.validateCampaignOwnership(id, mechanicId);
            return await this.prisma.$transaction(async (tx) => {
                await tx.campaign_brands.deleteMany({
                    where: { campaign_id: id },
                });
                await tx.campaign_categories.deleteMany({
                    where: { campaign_id: id },
                });
                await tx.campaigns.delete({
                    where: { id },
                });
                return { message: 'Kampanya başarıyla silindi' };
            });
        }
        catch (error) {
            this.handleErrors(error, 'Kampanya silme');
        }
    }
    handleErrors(error, operation) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`Kampanya bulunamadı veya zaten silinmiş.`);
            }
            console.error(`Prisma Hatası Kodu: ${error.code}`, error.message);
            throw new common_1.InternalServerErrorException(`Veritabanı hatası oluştu: ${error.message}`);
        }
        console.error(`${operation} sırasında hata: ${error.message}`, error.stack);
        throw error;
    }
};
exports.CampaignDeleteService = CampaignDeleteService;
exports.CampaignDeleteService = CampaignDeleteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        campaign_validation_service_1.CampaignValidationService])
], CampaignDeleteService);
//# sourceMappingURL=campaign-delete.service.js.map