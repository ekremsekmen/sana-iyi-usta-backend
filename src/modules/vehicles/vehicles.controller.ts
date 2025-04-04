import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get('brands')
  async getAllBrands() {
    return this.vehiclesService.findAllBrands();
  }

  @Get('brands/:brandId/models')
  async getModelsByBrand(@Param('brandId') brandId: string) {
    return this.vehiclesService.findModelsByBrandId(brandId);
  }

  @Get('models/:modelId/years')
  async getYearsByModel(@Param('modelId') modelId: string) {
    return this.vehiclesService.findYearsByModelId(modelId);
  }

  @Get('years/:yearId/variants')
  async getVariantsByYear(@Param('yearId') yearId: string) {
    return this.vehiclesService.findVariantsByYearId(yearId);
  }

  @Get('info/:variantId')
  async getVehicleInfo(@Param('variantId') variantId: string) {
    const vehicleInfo = await this.vehiclesService.getFullVehicleInfo(variantId);
    
    if (!vehicleInfo) {
      throw new NotFoundException('Bu varyant bulunamadı');
    }
    
    return vehicleInfo;
  }
}
