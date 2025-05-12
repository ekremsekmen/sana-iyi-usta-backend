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
exports.VehicleSelectService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let VehicleSelectService = class VehicleSelectService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllBrands() {
        return this.prisma.brands.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findModelsByBrandId(brandId) {
        return this.prisma.models.findMany({
            where: {
                brand_id: brandId,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findYearsByModelId(modelId) {
        return this.prisma.model_years.findMany({
            where: {
                model_id: modelId,
            },
            orderBy: {
                year: 'desc',
            },
        });
    }
    async findVariantsByYearId(yearId) {
        return this.prisma.variants.findMany({
            where: {
                model_year_id: yearId,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async getFullVehicleInfo(variantId) {
        const variant = await this.prisma.variants.findUnique({
            where: { id: variantId },
            include: {
                model_years: {
                    include: {
                        models: {
                            include: {
                                brands: true,
                            },
                        },
                    },
                },
            },
        });
        if (!variant) {
            return null;
        }
        return {
            brand: variant.model_years.models.brands.name,
            brandId: variant.model_years.models.brands.id,
            model: variant.model_years.models.name,
            modelId: variant.model_years.models.id,
            year: variant.model_years.year,
            yearId: variant.model_years.id,
            variant: variant.name,
            variantId: variant.id,
        };
    }
};
exports.VehicleSelectService = VehicleSelectService;
exports.VehicleSelectService = VehicleSelectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehicleSelectService);
//# sourceMappingURL=vehicle-select.service.js.map