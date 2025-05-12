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
exports.MechanicSearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const search_mechanics_dto_1 = require("../dto/search-mechanics.dto");
const locations_service_1 = require("../../locations/locations.service");
let MechanicSearchService = class MechanicSearchService {
    constructor(prisma, locationsService) {
        this.prisma = prisma;
        this.locationsService = locationsService;
    }
    async searchMechanics(userId, searchDto) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                default_location_id: true,
                locations_users_default_location_idTolocations: true
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (!searchDto.city && (!user.default_location_id || !user.locations_users_default_location_idTolocations?.city)) {
            throw new common_1.BadRequestException('Bu hizmetten yararlanabilmek için varsayılan konumunuzu ayarlamalısınız veya arama kriterlerinde şehir belirtmelisiniz.');
        }
        const where = {};
        if (searchDto.city) {
            where.users = {
                locations: {
                    some: {
                        city: searchDto.city
                    }
                }
            };
        }
        else if (user.default_location_id && user.locations_users_default_location_idTolocations?.city) {
            where.users = {
                locations: {
                    some: {
                        city: user.locations_users_default_location_idTolocations.city
                    }
                }
            };
        }
        if (searchDto.categoryId) {
            where.mechanic_categories = {
                some: {
                    category_id: searchDto.categoryId
                }
            };
        }
        if (searchDto.brandId) {
            where.mechanic_supported_vehicles = {
                some: {
                    brand_id: searchDto.brandId
                }
            };
        }
        if (searchDto.onSiteService !== undefined) {
            where.on_site_service = searchDto.onSiteService;
        }
        const total = await this.prisma.mechanics.count({ where });
        const skip = searchDto.page * searchDto.limit;
        const take = searchDto.limit;
        const ratingOrder = searchDto.ratingSort || search_mechanics_dto_1.SortOrder.DESC;
        const mechanics = await this.prisma.mechanics.findMany({
            where,
            skip,
            take,
            orderBy: [
                { average_rating: ratingOrder },
                { business_name: 'asc' }
            ],
            include: {
                users: {
                    select: {
                        id: true,
                        full_name: true,
                        profile_image: true,
                        default_location_id: true,
                        locations: {
                            where: {
                                city: searchDto.city || user.locations_users_default_location_idTolocations?.city
                            },
                            select: {
                                id: true,
                                city: true,
                                district: true,
                                latitude: true,
                                longitude: true
                            }
                        }
                    }
                },
                mechanic_categories: {
                    include: {
                        categories: true
                    }
                },
                mechanic_supported_vehicles: {
                    include: {
                        brands: true
                    }
                }
            }
        });
        const formattedResults = mechanics.map(mechanic => {
            const result = {
                id: mechanic.id,
                business_name: mechanic.business_name,
                on_site_service: mechanic.on_site_service || false,
                average_rating: mechanic.average_rating ? Number(mechanic.average_rating) : null,
                user_id: mechanic.user_id,
                user: {
                    full_name: mechanic.users.full_name,
                    profile_image: mechanic.users.profile_image
                },
                categories: mechanic.mechanic_categories.map(mc => ({
                    id: mc.category_id,
                    name: mc.categories.name
                })),
                supported_vehicles: mechanic.mechanic_supported_vehicles.map(sv => ({
                    id: sv.brand_id,
                    name: sv.brands.name
                }))
            };
            const userLocation = user.locations_users_default_location_idTolocations;
            if (userLocation?.latitude && userLocation?.longitude &&
                mechanic.users.locations && mechanic.users.locations.length > 0) {
                let mechLocation = null;
                if (mechanic.users.default_location_id) {
                    mechLocation = mechanic.users.locations.find(loc => loc.id === mechanic.users.default_location_id);
                }
                if (mechLocation?.latitude && mechLocation?.longitude) {
                    result.distance = this.locationsService.calculateDistance(Number(userLocation.latitude), Number(userLocation.longitude), Number(mechLocation.latitude), Number(mechLocation.longitude));
                }
            }
            return result;
        });
        let sortedResults = formattedResults;
        if (searchDto.sortBy === search_mechanics_dto_1.SortBy.DISTANCE) {
            sortedResults = formattedResults.sort((a, b) => {
                if (a.distance === undefined && b.distance === undefined)
                    return 0;
                if (a.distance === undefined)
                    return 1;
                if (b.distance === undefined)
                    return -1;
                return a.distance - b.distance;
            });
        }
        else if (searchDto.sortBy === search_mechanics_dto_1.SortBy.RATING) {
        }
        return {
            mechanics: sortedResults,
            total
        };
    }
};
exports.MechanicSearchService = MechanicSearchService;
exports.MechanicSearchService = MechanicSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        locations_service_1.LocationsService])
], MechanicSearchService);
//# sourceMappingURL=mechanic-search.service.js.map