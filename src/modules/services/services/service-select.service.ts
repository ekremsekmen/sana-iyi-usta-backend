import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ServiceCategoryDto, ServiceSubcategoryDto, ServiceInfoDto } from '../dto/service-select.dto';

@Injectable()
export class ServiceSelectService {
  constructor(private prisma: PrismaService) {}

  async findAllCategories(): Promise<ServiceCategoryDto[]> {
    return this.prisma.services_categories.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findSubcategoriesByCategoryId(categoryId: number): Promise<ServiceSubcategoryDto[]> {
    return this.prisma.service_subcategories.findMany({
      where: {
        category_id: categoryId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getFullServiceInfo(subcategoryId: string): Promise<ServiceInfoDto | null> {
    const subcategory = await this.prisma.service_subcategories.findUnique({
      where: { id: subcategoryId },
      include: {
        services_categories: true,
      },
    });

    if (!subcategory) {
      return null;
    }

    return {
      category_id: subcategory.category_id,
      subcategory_id: subcategory.id,
      category: subcategory.services_categories.name,
      subcategory: subcategory.name,
    };
  }
}
