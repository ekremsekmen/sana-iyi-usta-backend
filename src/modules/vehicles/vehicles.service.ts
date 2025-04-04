import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VehicleSelectService } from './services/vehicle-select.service';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService,
    private vehicleSelectService: VehicleSelectService,
  ) {}

  async getAllBrands() {
    return this.vehicleSelectService.findAllBrands();
  }

  async getModelsByBrand(brandId: string) {
    return this.vehicleSelectService.findModelsByBrandId(brandId);
  }

  async getYearsByModel(modelId: string) {
    return this.vehicleSelectService.findYearsByModelId(modelId);
  }

  async getVariantsByYear(yearId: string) {
    return this.vehicleSelectService.findVariantsByYearId(yearId);
  }

  async getFullVehicleInfo(variantId: string) {
    return this.vehicleSelectService.getFullVehicleInfo(variantId);
  }
}