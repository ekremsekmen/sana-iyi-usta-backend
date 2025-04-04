import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async findAllBrands() {
    return this.prisma.brands.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findModelsByBrandId(brandId: string) {
    return this.prisma.models.findMany({
      where: {
        brand_id: brandId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findYearsByModelId(modelId: string) {
    return this.prisma.model_years.findMany({
      where: {
        model_id: modelId,
      },
      orderBy: {
        year: 'desc',
      },
    });
  }

  async findVariantsByYearId(yearId: string) {
    return this.prisma.variants.findMany({
      where: {
        model_year_id: yearId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getFullVehicleInfo(variantId: string) {
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
      model: variant.model_years.models.name,
      year: variant.model_years.year,
      variant: variant.name,
    };
  }
}
