import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceSelectService } from './services/service-select.service';

@Injectable()
export class ServicesService {
  constructor(
    private prisma: PrismaService,
    private serviceSelectService: ServiceSelectService,
  ) {}

  async getAllCategories() {
    return this.serviceSelectService.findAllCategories();
  }

  async getSubcategoriesByCategory(categoryId: number) {
    return this.serviceSelectService.findSubcategoriesByCategoryId(categoryId);
  }

  async getFullServiceInfo(subcategoryId: string) {
    return this.serviceSelectService.getFullServiceInfo(subcategoryId);
  }
}
