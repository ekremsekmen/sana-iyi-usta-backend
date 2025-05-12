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
exports.MechanicSupportedVehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const crypto_1 = require("crypto");
let MechanicSupportedVehiclesService = class MechanicSupportedVehiclesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByMechanic(mechanicId) {
        const supportedVehicles = await this.prisma.mechanic_supported_vehicles.findMany({
            where: { mechanic_id: mechanicId },
            include: {
                brands: true,
            },
        });
        return supportedVehicles;
    }
    async create(dto) {
        try {
            if (Array.isArray(dto)) {
                if (dto.length === 0) {
                    return [];
                }
                const mechanicId = dto[0].mechanic_id;
                const hasInconsistentMechanicId = dto.some(item => item.mechanic_id !== mechanicId);
                if (hasInconsistentMechanicId) {
                    throw new common_1.BadRequestException('Tüm desteklenen araç kayıtları aynı tamirciye ait olmalıdır.');
                }
                return this.createMultiple(dto[0].mechanic_id, dto.map(item => item.brand_id));
            }
            else {
                const brand = await this.prisma.brands.findUnique({
                    where: { id: dto.brand_id },
                });
                if (!brand) {
                    throw new common_1.NotFoundException(`${dto.brand_id} ID'li marka bulunamadı.`);
                }
                return await this.prisma.mechanic_supported_vehicles.upsert({
                    where: {
                        mechanic_id_brand_id: {
                            mechanic_id: dto.mechanic_id,
                            brand_id: dto.brand_id
                        }
                    },
                    update: {},
                    create: {
                        id: (0, crypto_1.randomUUID)(),
                        mechanic_id: dto.mechanic_id,
                        brand_id: dto.brand_id,
                    },
                    include: {
                        brands: true,
                    }
                });
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error(`Desteklenen araç kaydı oluşturulurken hata: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Desteklenen araç kaydı oluşturulurken bir sunucu hatası oluştu: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.mechanic_supported_vehicles.delete({
                where: { id },
                include: {
                    brands: true,
                }
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`${id} ID'li desteklenen araç kaydı bulunamadı.`);
        }
    }
    async removeByMechanicAndBrand(mechanicId, brandId) {
        const record = await this.prisma.mechanic_supported_vehicles.findFirst({
            where: {
                mechanic_id: mechanicId,
                brand_id: brandId,
            },
        });
        if (!record) {
            throw new common_1.NotFoundException('Bu tamirci için bu marka kaydı bulunamadı.');
        }
        return this.remove(record.id);
    }
    async updateBulkSupportedVehicles(mechanicId, brandIds) {
        try {
            if (!brandIds || brandIds.length === 0) {
                throw new common_1.BadRequestException('En az bir desteklenen marka belirtilmelidir. Tüm markaları kaldırmak istiyorsanız, silme işlemini özel olarak gerçekleştirin.');
            }
            return await this.prisma.$transaction(async (tx) => {
                const brands = await tx.brands.findMany({
                    where: {
                        id: { in: brandIds }
                    },
                    select: { id: true }
                });
                const foundBrandIds = brands.map(b => b.id);
                const notFoundBrandIds = brandIds.filter(id => !foundBrandIds.includes(id));
                if (notFoundBrandIds.length > 0) {
                    throw new common_1.NotFoundException(`Bu ID'lere sahip markalar bulunamadı: ${notFoundBrandIds.join(', ')}`);
                }
                const existingRecords = await tx.mechanic_supported_vehicles.findMany({
                    where: { mechanic_id: mechanicId },
                    select: { id: true, brand_id: true }
                });
                const existingBrandIds = existingRecords.map(record => record.brand_id);
                const brandIdsToRemove = existingBrandIds.filter(id => !brandIds.includes(id));
                const brandIdsToAdd = brandIds.filter(id => !existingBrandIds.includes(id));
                if (brandIdsToRemove.length > 0) {
                    await tx.mechanic_supported_vehicles.deleteMany({
                        where: {
                            mechanic_id: mechanicId,
                            brand_id: { in: brandIdsToRemove }
                        }
                    });
                }
                const newRecords = brandIdsToAdd.map(brandId => ({
                    id: (0, crypto_1.randomUUID)(),
                    mechanic_id: mechanicId,
                    brand_id: brandId
                }));
                if (newRecords.length > 0) {
                    await tx.mechanic_supported_vehicles.createMany({
                        data: newRecords
                    });
                }
                return await tx.mechanic_supported_vehicles.findMany({
                    where: { mechanic_id: mechanicId },
                    include: { brands: true }
                });
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error(`Desteklenen araçları güncellerken hata: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Desteklenen araçları güncellerken bir sunucu hatası oluştu: ${error.message}`);
        }
    }
    async createMultiple(mechanicId, brandIds) {
        try {
            if (!brandIds || brandIds.length === 0) {
                throw new common_1.BadRequestException('En az bir desteklenen marka belirtilmelidir.');
            }
            return await this.prisma.$transaction(async (tx) => {
                const brands = await tx.brands.findMany({
                    where: {
                        id: { in: brandIds }
                    },
                    select: { id: true }
                });
                const foundBrandIds = brands.map(b => b.id);
                const notFoundBrandIds = brandIds.filter(id => !foundBrandIds.includes(id));
                if (notFoundBrandIds.length > 0) {
                    throw new common_1.NotFoundException(`Bu ID'lere sahip markalar bulunamadı: ${notFoundBrandIds.join(', ')}`);
                }
                const results = await Promise.all(brandIds.map(brandId => tx.mechanic_supported_vehicles.upsert({
                    where: {
                        mechanic_id_brand_id: {
                            mechanic_id: mechanicId,
                            brand_id: brandId
                        }
                    },
                    update: {},
                    create: {
                        id: (0, crypto_1.randomUUID)(),
                        mechanic_id: mechanicId,
                        brand_id: brandId
                    },
                    include: { brands: true }
                })));
                return results;
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error(`Desteklenen araçları eklerken hata: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Desteklenen araçları eklerken bir sunucu hatası oluştu: ${error.message}`);
        }
    }
    async addSupportedVehicle(dto) {
        return this.create(dto);
    }
    async createForMechanic(mechanicId, dto) {
        if (Array.isArray(dto)) {
            const modifiedDto = dto.map(item => ({
                ...item,
                mechanic_id: mechanicId
            }));
            return this.create(modifiedDto);
        }
        else {
            const modifiedDto = {
                ...dto,
                mechanic_id: mechanicId
            };
            return this.create(modifiedDto);
        }
    }
    async addSupportedVehicleForMechanic(mechanicId, body) {
        if (Array.isArray(body)) {
            body.forEach(item => item.mechanic_id = mechanicId);
        }
        else {
            body.mechanic_id = mechanicId;
        }
        return this.addSupportedVehicle(body);
    }
    async updateSupportedVehiclesForMechanic(mechanicId, dtoList) {
        dtoList.forEach(item => item.mechanic_id = mechanicId);
        return this.updateBulkSupportedVehicles(mechanicId, dtoList.map(item => item.brand_id));
    }
};
exports.MechanicSupportedVehiclesService = MechanicSupportedVehiclesService;
exports.MechanicSupportedVehiclesService = MechanicSupportedVehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MechanicSupportedVehiclesService);
//# sourceMappingURL=mechanic-supported-vehicles.service.js.map