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
exports.CampaignCreateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const campaign_validation_service_1 = require("./campaign-validation.service");
const notifications_service_1 = require("../../notifications/notifications.service");
const client_1 = require("@prisma/client");
let CampaignCreateService = class CampaignCreateService {
    constructor(prisma, validationService, notificationsService) {
        this.prisma = prisma;
        this.validationService = validationService;
        this.notificationsService = notificationsService;
    }
    async create(mechanicId, createCampaignDto, userId) {
        try {
            const { category_ids, brand_ids, ...campaignData } = createCampaignDto;
            await Promise.all([
                this.validationService.validateMechanicOwnership(mechanicId, userId),
                this.validationService.validateBrands(mechanicId, brand_ids),
                this.validationService.validateCategories(mechanicId, category_ids)
            ]);
            const validUntilDate = this.validationService.validateDate(campaignData.valid_until);
            const result = await this.prisma.$transaction(async (tx) => {
                const campaign = await tx.campaigns.create({
                    data: {
                        title: campaignData.title,
                        description: campaignData.description,
                        discount_rate: campaignData.discount_rate,
                        valid_until: validUntilDate,
                        created_at: new Date(),
                        mechanic_id: mechanicId,
                        image_url: campaignData.image_url
                    }
                });
                await tx.campaign_categories.createMany({
                    data: category_ids.map(categoryId => ({
                        campaign_id: campaign.id,
                        category_id: categoryId
                    }))
                });
                await tx.campaign_brands.createMany({
                    data: brand_ids.map(brandId => ({
                        campaign_id: campaign.id,
                        brand_id: brandId,
                        created_at: new Date()
                    }))
                });
                const campaignWithRelations = await tx.campaigns.findUnique({
                    where: { id: campaign.id },
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
                    image_url: campaignWithRelations.image_url,
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
            try {
                await this.notificationsService.sendCampaignNotifications(mechanicId, result.id, result.title, brand_ids);
            }
            catch (notificationError) {
                console.error('Kampanya bildirimleri gönderilirken hata:', notificationError);
            }
            return result;
        }
        catch (error) {
            this.handleErrors(error, 'Kampanya oluşturma');
        }
    }
    handleErrors(error, operation) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            console.error(`Prisma Hatası Kodu: ${error.code}`, error.message);
            if (error.code === 'P2002') {
                throw new common_1.InternalServerErrorException('Bu kampanya bilgileri ile zaten bir kayıt mevcut');
            }
            else if (error.code === 'P2003') {
                throw new common_1.InternalServerErrorException('Referans verilen bir kayıt bulunamadı');
            }
            else if (error.code === 'P2025') {
                throw new common_1.InternalServerErrorException('İlgili kayıt bulunamadı');
            }
            throw new common_1.InternalServerErrorException(`Veritabanı hatası oluştu: ${error.message}`);
        }
        console.error(`${operation} sırasında hata: ${error.message}`, error.stack);
        throw error;
    }
};
exports.CampaignCreateService = CampaignCreateService;
exports.CampaignCreateService = CampaignCreateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        campaign_validation_service_1.CampaignValidationService,
        notifications_service_1.NotificationsService])
], CampaignCreateService);
//# sourceMappingURL=campaign-create.service.js.map