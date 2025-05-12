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
exports.MechanicDetailService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let MechanicDetailService = class MechanicDetailService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMechanicDetailByUserId(userId) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            include: {
                locations: true,
                locations_users_default_location_idTolocations: true
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        const mechanic = await this.prisma.mechanics.findFirst({
            where: { user_id: userId },
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Tamirci profili bulunamadı');
        }
        const workingHours = await this.prisma.mechanic_working_hours.findMany({
            where: { mechanic_id: mechanic.id },
            orderBy: { day_of_week: 'asc' },
        });
        const supportedVehicles = await this.prisma.mechanic_supported_vehicles.findMany({
            where: { mechanic_id: mechanic.id },
            include: {
                brands: true,
            },
        });
        const categories = await this.prisma.mechanic_categories.findMany({
            where: { mechanic_id: mechanic.id },
            include: {
                categories: true,
            },
        });
        const ratings = await this.prisma.ratings_reviews.findMany({
            where: { mechanic_id: mechanic.id },
            include: {
                customers: {
                    include: {
                        users: {
                            select: {
                                full_name: true,
                                profile_image: true
                            }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' },
        });
        return {
            user: {
                id: user.id,
                full_name: user.full_name,
                phone_number: user.phone_number,
                profile_image: user.profile_image,
                email: user.e_mail,
                default_location: user.locations_users_default_location_idTolocations,
                locations: user.locations
            },
            mechanic: {
                id: mechanic.id,
                business_name: mechanic.business_name,
                on_site_service: mechanic.on_site_service,
                average_rating: mechanic.average_rating ? Number(mechanic.average_rating) : null,
                created_at: mechanic.created_at
            },
            working_hours: workingHours,
            supported_vehicles: supportedVehicles.map(sv => ({
                id: sv.id,
                brand: sv.brands
            })),
            categories: categories.map(cat => ({
                id: cat.id,
                category: cat.categories
            })),
            ratings: ratings.map(rating => ({
                id: rating.id,
                rating: Number(rating.rating),
                review: rating.review,
                mechanic_response: rating.mechanic_response,
                created_at: rating.created_at,
                customer: {
                    id: rating.customer_id,
                    full_name: rating.customers.users.full_name,
                    profile_image: rating.customers.users.profile_image
                }
            }))
        };
    }
    async getMechanicDetailById(mechanicId) {
        const mechanic = await this.prisma.mechanics.findUnique({
            where: { id: mechanicId },
            include: {
                users: {
                    include: {
                        locations: true,
                        locations_users_default_location_idTolocations: true
                    }
                }
            }
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Tamirci profili bulunamadı');
        }
        const workingHours = await this.prisma.mechanic_working_hours.findMany({
            where: { mechanic_id: mechanic.id },
            orderBy: { day_of_week: 'asc' },
        });
        const supportedVehicles = await this.prisma.mechanic_supported_vehicles.findMany({
            where: { mechanic_id: mechanic.id },
            include: {
                brands: true,
            },
        });
        const categories = await this.prisma.mechanic_categories.findMany({
            where: { mechanic_id: mechanic.id },
            include: {
                categories: true,
            },
        });
        const ratings = await this.prisma.ratings_reviews.findMany({
            where: { mechanic_id: mechanic.id },
            include: {
                customers: {
                    include: {
                        users: {
                            select: {
                                full_name: true,
                                profile_image: true
                            }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' },
        });
        return {
            user: {
                id: mechanic.user_id,
                full_name: mechanic.users.full_name,
                phone_number: mechanic.users.phone_number,
                profile_image: mechanic.users.profile_image,
                email: mechanic.users.e_mail,
                default_location: mechanic.users.locations_users_default_location_idTolocations,
                locations: mechanic.users.locations
            },
            mechanic: {
                id: mechanic.id,
                business_name: mechanic.business_name,
                on_site_service: mechanic.on_site_service,
                average_rating: mechanic.average_rating ? Number(mechanic.average_rating) : null,
                created_at: mechanic.created_at
            },
            working_hours: workingHours,
            supported_vehicles: supportedVehicles.map(sv => ({
                id: sv.id,
                brand: sv.brands
            })),
            categories: categories.map(cat => ({
                id: cat.id,
                category: cat.categories
            })),
            ratings: ratings.map(rating => ({
                id: rating.id,
                rating: Number(rating.rating),
                review: rating.review,
                mechanic_response: rating.mechanic_response,
                created_at: rating.created_at,
                customer: {
                    id: rating.customer_id,
                    full_name: rating.customers.users.full_name,
                    profile_image: rating.customers.users.profile_image
                }
            }))
        };
    }
};
exports.MechanicDetailService = MechanicDetailService;
exports.MechanicDetailService = MechanicDetailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MechanicDetailService);
//# sourceMappingURL=mechanic-detail.service.js.map