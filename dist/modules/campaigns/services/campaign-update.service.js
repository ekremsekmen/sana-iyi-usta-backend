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
exports.CampaignUpdateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const campaign_validation_service_1 = require("./campaign-validation.service");
const client_1 = require("@prisma/client");
const files_service_1 = require("../../files/files.service");
let CampaignUpdateService = class CampaignUpdateService {
    constructor(prisma, validationService, filesService) {
        this.prisma = prisma;
        this.validationService = validationService;
        this.filesService = filesService;
    }
    async update(id, mechanicId, updateCampaignDto, userId) {
        try {
            const { category_ids, brand_ids, ...campaignData } = updateCampaignDto;
            await Promise.all([
                this.validationService.validateMechanicOwnership(mechanicId, userId),
                this.validationService.validateCampaignOwnership(id, mechanicId),
                brand_ids && brand_ids.length > 0 ? this.validationService.validateBrands(mechanicId, brand_ids) : Promise.resolve(),
                category_ids && category_ids.length > 0 ? this.validationService.validateCategories(mechanicId, category_ids) : Promise.resolve()
            ]);
            let validUntilDate;
            if (campaignData.valid_until) {
                validUntilDate = this.validationService.validateDate(campaignData.valid_until);
            }
            return await this.prisma.$transaction(async (tx) => {
                const updateData = {};
                if (campaignData.title !== undefined)
                    updateData.title = campaignData.title;
                if (campaignData.description !== undefined)
                    updateData.description = campaignData.description;
                if (campaignData.discount_rate !== undefined)
                    updateData.discount_rate = campaignData.discount_rate;
                if (validUntilDate)
                    updateData.valid_until = validUntilDate;
                if (Object.keys(updateData).length > 0) {
                    await tx.campaigns.update({
                        where: { id },
                        data: updateData,
                    });
                }
                if (category_ids !== undefined) {
                    await tx.campaign_categories.deleteMany({
                        where: { campaign_id: id },
                    });
                    if (category_ids.length > 0) {
                        await tx.campaign_categories.createMany({
                            data: category_ids.map(categoryId => ({
                                campaign_id: id,
                                category_id: categoryId,
                            })),
                        });
                    }
                }
                if (brand_ids !== undefined) {
                    await tx.campaign_brands.deleteMany({
                        where: { campaign_id: id },
                    });
                    if (brand_ids.length > 0) {
                        await tx.campaign_brands.createMany({
                            data: brand_ids.map(brandId => ({
                                campaign_id: id,
                                brand_id: brandId,
                                created_at: new Date()
                            })),
                        });
                    }
                }
                const campaignWithRelations = await tx.campaigns.findUnique({
                    where: { id },
                    include: {
                        campaign_categories: {
                            include: {
                                categories: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                },
                            },
                        },
                        campaign_brands: {
                            include: {
                                brands: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                },
                            },
                        }
                    },
                });
                return {
                    id: campaignWithRelations.id,
                    mechanic_id: campaignWithRelations.mechanic_id,
                    title: campaignWithRelations.title,
                    description: campaignWithRelations.description,
                    discount_rate: campaignWithRelations.discount_rate,
                    valid_until: campaignWithRelations.valid_until,
                    created_at: campaignWithRelations.created_at,
                    categories: campaignWithRelations.campaign_categories.map(cc => ({
                        id: cc.categories.id,
                        name: cc.categories.name
                    })),
                    brands: campaignWithRelations.campaign_brands.map(cb => ({
                        id: cb.brands.id,
                        name: cb.brands.name
                    }))
                };
            });
        }
        catch (error) {
            this.handleErrors(error, 'Kampanya güncelleme');
        }
    }
    async updateImage(id, mechanicId, file, userId) {
        try {
            await this.validationService.validateMechanicOwnership(mechanicId, userId);
            await this.validationService.validateCampaignOwnership(id, mechanicId);
            const imageUrl = await this.filesService.uploadFile(file, 'campaigns');
            await this.prisma.campaigns.update({
                where: { id },
                data: { image_url: imageUrl },
            });
            const updatedCampaign = await this.prisma.campaigns.findUnique({
                where: { id },
                include: {
                    campaign_categories: {
                        include: {
                            categories: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                        },
                    },
                    campaign_brands: {
                        include: {
                            brands: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                        },
                    }
                },
            });
            return {
                id: updatedCampaign.id,
                mechanic_id: updatedCampaign.mechanic_id,
                title: updatedCampaign.title,
                description: updatedCampaign.description,
                discount_rate: updatedCampaign.discount_rate,
                valid_until: updatedCampaign.valid_until,
                created_at: updatedCampaign.created_at,
                image_url: updatedCampaign.image_url,
                categories: updatedCampaign.campaign_categories.map(cc => ({
                    id: cc.categories.id,
                    name: cc.categories.name
                })),
                brands: updatedCampaign.campaign_brands.map(cb => ({
                    id: cb.brands.id,
                    name: cb.brands.name
                }))
            };
        }
        catch (error) {
            this.handleErrors(error, 'Kampanya resmi güncelleme');
        }
    }
    handleErrors(error, operation) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            console.error(`Prisma Hatası Kodu: ${error.code}`, error.message);
            throw new common_1.InternalServerErrorException(`Veritabanı hatası oluştu: ${error.message}`);
        }
        console.error(`${operation} sırasında hata: ${error.message}`, error.stack);
        throw error;
    }
};
exports.CampaignUpdateService = CampaignUpdateService;
exports.CampaignUpdateService = CampaignUpdateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        campaign_validation_service_1.CampaignValidationService,
        files_service_1.FilesService])
], CampaignUpdateService);
//# sourceMappingURL=campaign-update.service.js.map