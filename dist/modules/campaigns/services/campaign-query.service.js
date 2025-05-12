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
exports.CampaignQueryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const campaign_validation_service_1 = require("./campaign-validation.service");
let CampaignQueryService = class CampaignQueryService {
    constructor(prisma, validationService) {
        this.prisma = prisma;
        this.validationService = validationService;
    }
    async findByMechanic(mechanicId, userId) {
        try {
            await this.validationService.validateMechanicOwnership(mechanicId, userId);
            const campaigns = await this.prisma.campaigns.findMany({
                where: { mechanic_id: mechanicId },
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
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            });
            return campaigns.map(campaign => ({
                id: campaign.id,
                mechanic_id: campaign.mechanic_id,
                title: campaign.title,
                description: campaign.description,
                discount_rate: campaign.discount_rate,
                valid_until: campaign.valid_until,
                created_at: campaign.created_at,
                image_url: campaign.image_url,
                categories: campaign.campaign_categories.map(cc => ({
                    id: cc.categories.id,
                    name: cc.categories.name
                })),
                brands: campaign.campaign_brands.map(cb => ({
                    id: cb.brands.id,
                    name: cb.brands.name
                }))
            }));
        }
        catch (error) {
            this.handleErrors(error, 'Kampanya sorgulama');
        }
    }
    async findCampaignsForCustomer(userId) {
        try {
            const user = await this.prisma.users.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    default_location_id: true,
                    locations_users_default_location_idTolocations: {
                        select: {
                            city: true
                        }
                    }
                }
            });
            if (!user) {
                throw new common_1.NotFoundException('Kullanıcı bulunamadı');
            }
            if (!user.default_location_id || !user.locations_users_default_location_idTolocations?.city) {
                throw new common_1.BadRequestException('Bu hizmetten yararlanabilmek için varsayılan konumunuzu ayarlamanız gerekiyor.');
            }
            const customer = await this.prisma.customers.findFirst({
                where: { user_id: userId },
                select: {
                    id: true,
                    customer_vehicles: {
                        select: {
                            brand_id: true
                        }
                    }
                }
            });
            if (!customer) {
                throw new common_1.NotFoundException('Müşteri profili bulunamadı');
            }
            if (!customer.customer_vehicles || customer.customer_vehicles.length === 0) {
                throw new common_1.BadRequestException('Kampanyaları görebilmek için araç ya da araçlarınızı eklemelisiniz.');
            }
            const brandIds = [...new Set(customer.customer_vehicles.map(v => v.brand_id))];
            const whereConditions = {
                valid_until: {
                    gte: new Date()
                }
            };
            const orConditions = [];
            if (brandIds.length > 0) {
                orConditions.push({
                    campaign_brands: {
                        some: {
                            brand_id: {
                                in: brandIds
                            }
                        }
                    }
                });
            }
            const userCity = user.locations_users_default_location_idTolocations?.city;
            if (userCity) {
                orConditions.push({
                    mechanics: {
                        users: {
                            locations: {
                                some: {
                                    city: userCity
                                }
                            }
                        }
                    }
                });
            }
            if (orConditions.length > 0) {
                whereConditions.OR = orConditions;
            }
            const campaigns = await this.prisma.campaigns.findMany({
                where: whereConditions,
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
                    },
                    mechanics: {
                        include: {
                            users: {
                                select: {
                                    full_name: true,
                                    profile_image: true,
                                    locations: {
                                        select: {
                                            city: true,
                                            district: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc',
                },
            });
            return campaigns.map(campaign => {
                let mechanicLocation = null;
                if (campaign.mechanics.users.locations && campaign.mechanics.users.locations.length > 0) {
                    const sameCity = userCity
                        ? campaign.mechanics.users.locations.find(loc => loc.city === userCity)
                        : null;
                    const locationToUse = sameCity || campaign.mechanics.users.locations[0];
                    mechanicLocation = {
                        city: locationToUse.city,
                        district: locationToUse.district
                    };
                }
                return {
                    id: campaign.id,
                    mechanic_id: campaign.mechanic_id,
                    mechanic_name: campaign.mechanics.business_name,
                    mechanic_image: campaign.mechanics.users.profile_image,
                    title: campaign.title,
                    discount_rate: campaign.discount_rate,
                    valid_until: campaign.valid_until,
                    image_url: campaign.image_url,
                    categories: campaign.campaign_categories.map(cc => ({
                        id: cc.categories.id,
                        name: cc.categories.name
                    })),
                };
            });
        }
        catch (error) {
            this.handleErrors(error, 'Müşteri kampanyaları sorgulama');
        }
    }
    async findCampaignDetails(campaignId) {
        try {
            const campaign = await this.prisma.campaigns.findUnique({
                where: { id: campaignId },
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
                    },
                    mechanics: {
                        include: {
                            users: {
                                select: {
                                    full_name: true,
                                    profile_image: true,
                                    locations: {
                                        select: {
                                            id: true,
                                            address: true,
                                            city: true,
                                            district: true,
                                            latitude: true,
                                            longitude: true
                                        }
                                    }
                                }
                            },
                            ratings_reviews: {
                                select: {
                                    rating: true,
                                },
                            }
                        }
                    }
                },
            });
            if (!campaign) {
                throw new common_1.NotFoundException('Kampanya bulunamadı');
            }
            const totalReviews = campaign.mechanics.ratings_reviews.length;
            return {
                id: campaign.id,
                title: campaign.title,
                description: campaign.description,
                discount_rate: campaign.discount_rate,
                valid_until: campaign.valid_until,
                created_at: campaign.created_at,
                image_url: campaign.image_url,
                categories: campaign.campaign_categories.map(cc => ({
                    id: cc.categories.id,
                    name: cc.categories.name
                })),
                brands: campaign.campaign_brands.map(cb => ({
                    id: cb.brands.id,
                    name: cb.brands.name
                })),
                mechanic: {
                    id: campaign.mechanics.id,
                    business_name: campaign.mechanics.business_name,
                    average_rating: campaign.mechanics.average_rating,
                    total_reviews: totalReviews,
                    profile_image: campaign.mechanics.users.profile_image,
                    full_name: campaign.mechanics.users.full_name,
                    locations: campaign.mechanics.users.locations.map(location => ({
                        id: location.id,
                        address: location.address,
                        city: location.city,
                        district: location.district,
                        latitude: location.latitude,
                        longitude: location.longitude
                    }))
                }
            };
        }
        catch (error) {
            this.handleErrors(error, 'Kampanya detayları sorgulama');
        }
    }
    handleErrors(error, operation) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        if (error instanceof common_1.ForbiddenException) {
            throw error;
        }
        console.error(`${operation} sırasında hata: ${error.message}`, error.stack);
        throw new common_1.InternalServerErrorException(`${operation} sırasında bir sunucu hatası oluştu: ${error.message}`);
    }
};
exports.CampaignQueryService = CampaignQueryService;
exports.CampaignQueryService = CampaignQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        campaign_validation_service_1.CampaignValidationService])
], CampaignQueryService);
//# sourceMappingURL=campaign-query.service.js.map