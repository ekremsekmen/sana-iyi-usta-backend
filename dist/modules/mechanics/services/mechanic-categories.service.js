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
exports.MechanicCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const crypto_1 = require("crypto");
let MechanicCategoriesService = class MechanicCategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByMechanic(mechanicId) {
        const categories = await this.prisma.mechanic_categories.findMany({
            where: { mechanic_id: mechanicId },
            include: {
                categories: true,
            },
        });
        return categories;
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
                    throw new common_1.BadRequestException('Tüm kategori kayıtları aynı tamirciye ait olmalıdır.');
                }
                return this.createMultipleCategories(dto[0].mechanic_id, dto.map(item => item.category_id));
            }
            else {
                const category = await this.prisma.categories.findUnique({
                    where: { id: dto.category_id },
                });
                if (!category) {
                    throw new common_1.NotFoundException(`${dto.category_id} ID'li kategori bulunamadı.`);
                }
                return await this.prisma.mechanic_categories.upsert({
                    where: {
                        mechanic_id_category_id: {
                            mechanic_id: dto.mechanic_id,
                            category_id: dto.category_id,
                        },
                    },
                    update: {},
                    create: {
                        id: (0, crypto_1.randomUUID)(),
                        mechanic_id: dto.mechanic_id,
                        category_id: dto.category_id,
                    },
                    include: {
                        categories: true,
                    }
                });
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error(`Kategori kaydı oluşturulurken hata: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Kategori kaydı oluşturulurken bir sunucu hatası oluştu: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.mechanic_categories.delete({
                where: { id },
                include: {
                    categories: true,
                }
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`${id} ID'li kategori kaydı bulunamadı.`);
        }
    }
    async removeByMechanicAndCategory(mechanicId, categoryId) {
        const record = await this.prisma.mechanic_categories.findFirst({
            where: {
                mechanic_id: mechanicId,
                category_id: categoryId,
            },
        });
        if (!record) {
            throw new common_1.NotFoundException('Bu tamirci için bu kategori kaydı bulunamadı.');
        }
        return this.remove(record.id);
    }
    async updateBulkCategories(mechanicId, categoryIds) {
        try {
            if (!categoryIds || categoryIds.length === 0) {
                throw new common_1.BadRequestException('En az bir kategori belirtilmelidir. Tüm kategorileri kaldırmak istiyorsanız, silme işlemini özel olarak gerçekleştirin.');
            }
            return await this.prisma.$transaction(async (tx) => {
                const categories = await tx.categories.findMany({
                    where: {
                        id: { in: categoryIds }
                    },
                    select: { id: true }
                });
                const foundCategoryIds = categories.map(c => c.id);
                const notFoundCategoryIds = categoryIds.filter(id => !foundCategoryIds.includes(id));
                if (notFoundCategoryIds.length > 0) {
                    throw new common_1.NotFoundException(`Bu ID'lere sahip kategoriler bulunamadı: ${notFoundCategoryIds.join(', ')}`);
                }
                const existingRecords = await tx.mechanic_categories.findMany({
                    where: { mechanic_id: mechanicId },
                    select: { id: true, category_id: true }
                });
                const existingCategoryIds = existingRecords.map(record => record.category_id);
                const categoryIdsToRemove = existingCategoryIds.filter(id => !categoryIds.includes(id));
                const categoryIdsToAdd = categoryIds.filter(id => !existingCategoryIds.includes(id));
                if (categoryIdsToRemove.length > 0) {
                    await tx.mechanic_categories.deleteMany({
                        where: {
                            mechanic_id: mechanicId,
                            category_id: { in: categoryIdsToRemove }
                        }
                    });
                }
                const newRecords = categoryIdsToAdd.map(categoryId => ({
                    id: (0, crypto_1.randomUUID)(),
                    mechanic_id: mechanicId,
                    category_id: categoryId
                }));
                if (newRecords.length > 0) {
                    await tx.mechanic_categories.createMany({
                        data: newRecords
                    });
                }
                return await tx.mechanic_categories.findMany({
                    where: { mechanic_id: mechanicId },
                    include: { categories: true }
                });
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error(`Kategorileri güncellerken hata: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Kategorileri güncellerken bir sunucu hatası oluştu: ${error.message}`);
        }
    }
    async createMultipleCategories(mechanicId, categoryIds) {
        try {
            if (!categoryIds || categoryIds.length === 0) {
                throw new common_1.BadRequestException('En az bir kategori belirtilmelidir.');
            }
            return await this.prisma.$transaction(async (tx) => {
                const categories = await tx.categories.findMany({
                    where: {
                        id: { in: categoryIds }
                    },
                    select: { id: true }
                });
                const foundCategoryIds = categories.map(c => c.id);
                const notFoundCategoryIds = categoryIds.filter(id => !foundCategoryIds.includes(id));
                if (notFoundCategoryIds.length > 0) {
                    throw new common_1.NotFoundException(`Bu ID'lere sahip kategoriler bulunamadı: ${notFoundCategoryIds.join(', ')}`);
                }
                const results = [];
                for (const categoryId of categoryIds) {
                    const result = await tx.mechanic_categories.upsert({
                        where: {
                            mechanic_id_category_id: {
                                mechanic_id: mechanicId,
                                category_id: categoryId,
                            },
                        },
                        update: {},
                        create: {
                            id: (0, crypto_1.randomUUID)(),
                            mechanic_id: mechanicId,
                            category_id: categoryId,
                        },
                        include: {
                            categories: true,
                        }
                    });
                    results.push(result);
                }
                return results;
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error(`Kategorileri eklerken hata: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Kategorileri eklerken bir sunucu hatası oluştu: ${error.message}`);
        }
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
};
exports.MechanicCategoriesService = MechanicCategoriesService;
exports.MechanicCategoriesService = MechanicCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MechanicCategoriesService);
//# sourceMappingURL=mechanic-categories.service.js.map