import { Injectable } from '@nestjs/common';
import { ServiceSelectService } from './services/service-select.service';
import { CategoryDto, CategoryFilterDto } from './dto/service-select.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly serviceSelectService: ServiceSelectService) {}

  async getAllCategories(filterDto?: CategoryFilterDto): Promise<CategoryDto[]> {
    return this.serviceSelectService.getAllCategories(filterDto);
  }

  async getCategoryById(id: string): Promise<CategoryDto> {
    return this.serviceSelectService.getCategoryById(id);
  }
  
  async getEfficientCategoryTree(): Promise<CategoryDto[]> {
    return this.serviceSelectService.getEfficientCategoryTree();
  }
}
