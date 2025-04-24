import { Controller, Get, Param, NotFoundException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtGuard } from 'src/common/guards';

@UseGuards(JwtGuard) 
@Controller('service-select')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  @Get('categories')
  async getAllCategories() {
    return this.servicesService.getAllCategories();
  }

  @Get('categories/:categoryId/subcategories')
  async getSubcategoriesByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    const subcategories = await this.servicesService.getSubcategoriesByCategory(categoryId);
    
    if (!subcategories || subcategories.length === 0) {
      throw new NotFoundException('Bu kategoriye ait alt kategoriler bulunamadı');
    }
    
    return subcategories;
  }

  @Get('subcategories/:subcategoryId')
  async getServiceInfo(@Param('subcategoryId') subcategoryId: string) {
    const serviceInfo = await this.servicesService.getFullServiceInfo(subcategoryId);
    
    if (!serviceInfo) {
      throw new NotFoundException('Bu alt kategori bulunamadı');
    }
    
    return serviceInfo;
  }
}
