import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtGuard } from 'src/common/guards';

@UseGuards(JwtGuard) 
@Controller('vehicle-select')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
  ) {}

  @Get('brands')
  async getAllBrands() {
    return this.vehiclesService.getAllBrands();
  }

  @Get('brands/:brandId/models')
  async getModelsByBrand(@Param('brandId') brandId: string) {
    return this.vehiclesService.getModelsByBrand(brandId);
  }

  @Get('models/:modelId/years')
  async getYearsByModel(@Param('modelId') modelId: string) {
    return this.vehiclesService.getYearsByModel(modelId);
  }

  @Get('years/:yearId/variants')
  async getVariantsByYear(@Param('yearId') yearId: string) {
    return this.vehiclesService.getVariantsByYear(yearId);
  }

  @Get('vehicle/:variantId')
  async getVehicleInfo(@Param('variantId') variantId: string) {
    const vehicleInfo = await this.vehiclesService.getFullVehicleInfo(variantId);
    
    if (!vehicleInfo) {
      throw new NotFoundException('Bu varyant bulunamadı');
    }
    
    return vehicleInfo;
  }
}