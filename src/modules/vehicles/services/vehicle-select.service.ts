import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BrandDto, ModelDto, YearDto, VariantDto, VehicleInfoDto } from '../dto/vehicle-select.dto';

@Injectable()
export class VehicleSelectService {
  constructor(private prisma: PrismaService) {}

  async findAllBrands(): Promise<BrandDto[]> {
    return this.prisma.brands.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findModelsByBrandId(brandId: string): Promise<ModelDto[]> {
    return this.prisma.models.findMany({
      where: {
        brand_id: brandId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findYearsByModelId(modelId: string): Promise<YearDto[]> {
    return this.prisma.model_years.findMany({
      where: {
        model_id: modelId,
      },
      orderBy: {
        year: 'desc',
      },
    });
  }

  async findVariantsByYearId(yearId: string): Promise<VariantDto[]> {
    return this.prisma.variants.findMany({
      where: {
        model_year_id: yearId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getFullVehicleInfo(variantId: string): Promise<VehicleInfoDto | null> {
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
}