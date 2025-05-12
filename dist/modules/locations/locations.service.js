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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
let LocationsService = class LocationsService {
    constructor(prisma, usersService) {
        this.prisma = prisma;
        this.usersService = usersService;
    }
    async create(userId, createLocationDto) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: { role: true, default_location_id: true }
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (user.role === 'mechanic') {
            return this.handleMechanicLocation(userId, createLocationDto);
        }
        const userLocationsCount = await this.prisma.locations.count({
            where: { user_id: userId }
        });
        if (userLocationsCount > 3) {
            throw new common_1.ForbiddenException('En fazla 3 konum ekleyebilirsiniz');
        }
        const existingLocation = await this.prisma.locations.findFirst({
            where: {
                user_id: userId,
                latitude: createLocationDto.latitude,
                longitude: createLocationDto.longitude,
            },
        });
        if (existingLocation) {
            throw new common_1.ConflictException('Bu konuma ait kayıt zaten mevcut');
        }
        return this.prisma.locations.create({
            data: {
                user_id: userId,
                address: createLocationDto.address,
                latitude: createLocationDto.latitude,
                longitude: createLocationDto.longitude,
                label: createLocationDto.label,
                city: createLocationDto.city,
                district: createLocationDto.district,
            },
        });
    }
    async handleMechanicLocation(userId, locationDto) {
        const existingLocations = await this.prisma.locations.findMany({
            where: { user_id: userId }
        });
        return this.prisma.$transaction(async (tx) => {
            let locationId;
            if (existingLocations.length > 0) {
                const existingLocation = existingLocations[0];
                const updatedLocation = await tx.locations.update({
                    where: { id: existingLocation.id },
                    data: {
                        address: locationDto.address,
                        latitude: locationDto.latitude,
                        longitude: locationDto.longitude,
                        label: locationDto.label,
                        city: locationDto.city,
                        district: locationDto.district,
                    }
                });
                locationId = updatedLocation.id;
            }
            else {
                const newLocation = await tx.locations.create({
                    data: {
                        user_id: userId,
                        address: locationDto.address,
                        latitude: locationDto.latitude,
                        longitude: locationDto.longitude,
                        label: locationDto.label,
                        city: locationDto.city,
                        district: locationDto.district,
                    }
                });
                locationId = newLocation.id;
            }
            await this.usersService.setDefaultLocation(userId, locationId, tx);
            return tx.locations.findUnique({
                where: { id: locationId }
            });
        });
    }
    async findAll(userId) {
        return this.prisma.locations.findMany({
            where: { user_id: userId },
        });
    }
    async findOne(id, userId) {
        const location = await this.prisma.locations.findUnique({
            where: { id },
        });
        if (!location) {
            throw new common_1.NotFoundException(`Konum #${id} bulunamadı`);
        }
        if (location.user_id !== userId) {
            throw new common_1.ForbiddenException('Bu konuma erişim yetkiniz yok');
        }
        return location;
    }
    async update(id, userId, updateLocationDto) {
        await this.findOne(id, userId);
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: { role: true }
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (user.role === 'mechanic') {
            return this.prisma.$transaction(async (tx) => {
                const updatedLocation = await tx.locations.update({
                    where: { id },
                    data: {
                        address: updateLocationDto.address,
                        latitude: updateLocationDto.latitude,
                        longitude: updateLocationDto.longitude,
                        label: updateLocationDto.label,
                        ...(updateLocationDto.city !== undefined && { city: updateLocationDto.city }),
                        ...(updateLocationDto.district !== undefined && { district: updateLocationDto.district }),
                    },
                });
                await this.usersService.setDefaultLocation(userId, id, tx);
                return updatedLocation;
            });
        }
        else {
            return this.prisma.locations.update({
                where: { id },
                data: {
                    address: updateLocationDto.address,
                    latitude: updateLocationDto.latitude,
                    longitude: updateLocationDto.longitude,
                    label: updateLocationDto.label,
                    ...(updateLocationDto.city !== undefined && { city: updateLocationDto.city }),
                    ...(updateLocationDto.district !== undefined && { district: updateLocationDto.district }),
                },
            });
        }
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.users.findUnique({
                where: { id: userId },
                select: { role: true, default_location_id: true }
            });
            if (user && user.default_location_id === id) {
                await tx.users.update({
                    where: { id: userId },
                    data: { default_location_id: null },
                });
            }
            await tx.locations.delete({
                where: { id },
            });
            return { message: 'Konum başarıyla silindi' };
        });
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return Math.round(distance * 10) / 10;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map