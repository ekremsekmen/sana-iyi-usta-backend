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
exports.ServiceSelectService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ServiceSelectService = class ServiceSelectService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllCategories(filterDto) {
        const { parentId } = filterDto || {};
        const whereClause = {};
        if (parentId === 'null') {
            whereClause['parent_id'] = null;
        }
        else if (parentId) {
            whereClause['parent_id'] = parentId;
        }
        const categories = await this.prisma.categories.findMany({
            where: whereClause,
            orderBy: {
                name: 'asc',
            },
        });
        return categories;
    }
    async getParentCategories() {
        return this.getAllCategories({ parentId: 'null' });
    }
    async getCategoryById(id) {
        const category = await this.prisma.categories.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Kategori bulunamadı: ${id}`);
        }
        return category;
    }
    async getSubcategoriesByParentId(parentId) {
        const parentExists = await this.prisma.categories.findUnique({
            where: { id: parentId },
        });
        if (!parentExists) {
            throw new common_1.NotFoundException(`Üst kategori bulunamadı: ${parentId}`);
        }
        return this.getAllCategories({ parentId });
    }
    async getEfficientCategoryTree() {
        const allCategories = await this.prisma.categories.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        const categoriesById = new Map();
        allCategories.forEach(category => {
            categoriesById.set(category.id, { ...category, subcategories: [] });
        });
        const rootCategories = [];
        allCategories.forEach(category => {
            if (category.parent_id === null) {
                rootCategories.push(categoriesById.get(category.id));
            }
            else {
                const parentCategory = categoriesById.get(category.parent_id);
                if (parentCategory) {
                    parentCategory.subcategories.push(categoriesById.get(category.id));
                }
            }
        });
        return rootCategories;
    }
};
exports.ServiceSelectService = ServiceSelectService;
exports.ServiceSelectService = ServiceSelectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceSelectService);
//# sourceMappingURL=service-select.service.js.map