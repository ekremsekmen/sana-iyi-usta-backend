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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const files_service_1 = require("../files/files.service");
let UsersService = class UsersService {
    constructor(prisma, filesService) {
        this.prisma = prisma;
        this.filesService = filesService;
    }
    async findOne(id) {
        const user = await this.prisma.users.findUnique({
            where: { id },
            select: {
                id: true,
                full_name: true,
                phone_number: true,
                role: true,
                profile_image: true,
                e_mail: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Kullanıcı #${id} bulunamadı`);
        }
        const userInfo = {
            id: user.id,
            full_name: user.full_name,
            phone_number: user.phone_number,
            role: user.role,
            profile_image: user.profile_image,
            email: user.e_mail
        };
        const response = {
            user: userInfo
        };
        if (user.role === 'mechanic') {
            const mechanic = await this.prisma.mechanics.findFirst({
                where: { user_id: id },
                select: {
                    id: true,
                    business_name: true,
                    on_site_service: true,
                    average_rating: true,
                }
            });
            if (mechanic) {
                const mechanicInfo = {
                    id: mechanic.id,
                    business_name: mechanic.business_name,
                    on_site_service: mechanic.on_site_service,
                    average_rating: mechanic.average_rating ? Number(mechanic.average_rating) : undefined,
                };
                response.mechanic = mechanicInfo;
            }
        }
        else if (user.role === 'customer') {
            const customer = await this.prisma.customers.findFirst({
                where: { user_id: id },
                select: {
                    id: true,
                }
            });
            if (customer) {
                const customerInfo = {
                    id: customer.id,
                };
                response.customer = customerInfo;
            }
        }
        return response;
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.users.update({
            where: { id },
            data: {
                phone_number: updateUserDto.phone_number,
                profile_image: updateUserDto.profile_image,
                full_name: updateUserDto.full_name,
                role: updateUserDto.role,
            },
            select: {
                id: true,
                full_name: true,
                phone_number: true,
                profile_image: true,
                role: true,
            },
        });
        return user;
    }
    async uploadProfileImage(userId, file) {
        const imageUrl = await this.filesService.uploadFile(file, 'profile-images');
        const user = await this.prisma.users.update({
            where: { id: userId },
            data: {
                profile_image: imageUrl,
            },
            select: {
                id: true,
                profile_image: true,
            },
        });
        return user;
    }
    async setDefaultLocation(userId, locationId, prismaClient) {
        const txClient = prismaClient || this.prisma;
        const location = await txClient.locations.findFirst({
            where: {
                id: locationId,
                user_id: userId,
            },
        });
        if (!location) {
            throw new common_1.NotFoundException('Konum bulunamadı veya bu konuma erişim yetkiniz yok');
        }
        return txClient.users.update({
            where: { id: userId },
            data: { default_location_id: locationId },
            select: {
                id: true,
                default_location_id: true,
                locations_users_default_location_idTolocations: {
                    select: {
                        id: true,
                        address: true,
                        city: true,
                        district: true,
                        label: true,
                        latitude: true,
                        longitude: true,
                    },
                },
            },
        });
    }
    async getDefaultLocation(userId) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                default_location_id: true,
                locations_users_default_location_idTolocations: {
                    select: {
                        id: true,
                        address: true,
                        city: true,
                        district: true,
                        label: true,
                        latitude: true,
                        longitude: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Kullanıcı #${userId} bulunamadı`);
        }
        if (!user.default_location_id) {
            return {
                id: user.id,
                default_location: null
            };
        }
        return {
            id: user.id,
            default_location: user.locations_users_default_location_idTolocations
        };
    }
    async remove(id) {
        await this.prisma.users.delete({
            where: { id }
        });
        return { message: 'Kullanıcı başarıyla silindi' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        files_service_1.FilesService])
], UsersService);
//# sourceMappingURL=users.service.js.map