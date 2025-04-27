import { Controller, Get, Param, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CategoryDto, CategoryFilterDto } from './dto/service-select.dto';
import { JwtGuard } from 'src/common/guards';

@UseGuards(JwtGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('categories')
  async getCategories(@Query() filterDto: CategoryFilterDto): Promise<CategoryDto[]> {
    return this.servicesService.getAllCategories(filterDto);
  }

  @Get('parent-categories')
  async getParentCategories(): Promise<CategoryDto[]> {
    const filterDto: CategoryFilterDto = { parentId: 'null' };
    return this.servicesService.getAllCategories(filterDto);
  }

  @Get('category-tree')
  async getCategoryTree(): Promise<CategoryDto[]> {
    // Optimize edilmiş kategori ağacını getir
    return this.servicesService.getEfficientCategoryTree();
  }

  @Get('category/:id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryDto> {
    try {
      return await this.servicesService.getCategoryById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Kategori bulunamadı: ${id}`);
    }
  }

  @Get('subcategories/:parentId')
  async getSubcategoriesByParentId(@Param('parentId') parentId: string): Promise<CategoryDto[]> {
    try {
      const filterDto: CategoryFilterDto = { parentId };
      return await this.servicesService.getAllCategories(filterDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Alt kategoriler bulunamadı. Üst kategori ID: ${parentId}`);
    }
  }
}
