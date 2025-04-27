import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CategoryDto, CategoryFilterDto } from '../dto/service-select.dto';

@Injectable()
export class ServiceSelectService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories(filterDto?: CategoryFilterDto): Promise<CategoryDto[]> {
    const { parentId } = filterDto || {};
    
    const whereClause = {};
    
    if (parentId === 'null') {
      // Sadece üst kategorileri getir (parent_id null olanlar)
      whereClause['parent_id'] = null;
    } else if (parentId) {
      // Belirli bir üst kategoriye ait alt kategorileri getir
      whereClause['parent_id'] = parentId;
    }
    
    const categories = await this.prisma.categories.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc',
      },
    });
    
    return categories;
  }

  async getParentCategories(): Promise<CategoryDto[]> {
    // getAllCategories metodunu yeniden kullanarak kod tekrarını önle
    return this.getAllCategories({ parentId: 'null' });
  }

  async getCategoryById(id: string): Promise<CategoryDto> {
    const category = await this.prisma.categories.findUnique({
      where: { id },
    });
    
    if (!category) {
      throw new NotFoundException(`Kategori bulunamadı: ${id}`);
    }
    
    return category;
  }

  async getSubcategoriesByParentId(parentId: string): Promise<CategoryDto[]> {
    // Parent'ın varlığını kontrol et
    const parentExists = await this.prisma.categories.findUnique({
      where: { id: parentId },
    });
    
    if (!parentExists) {
      throw new NotFoundException(`Üst kategori bulunamadı: ${parentId}`);
    }
    
    // getAllCategories metodunu yeniden kullanarak kod tekrarını önle
    return this.getAllCategories({ parentId });
  }
  
  // Tek sorguda tüm kategori ağacını getiren verimli metot
  async getEfficientCategoryTree(): Promise<CategoryDto[]> {
    // Tüm kategorileri tek seferde getir
    const allCategories = await this.prisma.categories.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    // Kategorileri ID'ye göre indeksle
    const categoriesById = new Map<string, CategoryDto & { subcategories: CategoryDto[] }>();
    
    // Her kategori için boş subcategories array'i oluştur
    allCategories.forEach(category => {
      categoriesById.set(category.id, { ...category, subcategories: [] });
    });
    
    // Üst kategorileri tutacak array
    const rootCategories: CategoryDto[] = [];
    
    // İlişkileri kur
    allCategories.forEach(category => {
      if (category.parent_id === null) {
        // Bu bir üst kategori
        rootCategories.push(categoriesById.get(category.id));
      } else {
        // Bu bir alt kategori, parent'ına ekle
        const parentCategory = categoriesById.get(category.parent_id);
        if (parentCategory) {
          parentCategory.subcategories.push(categoriesById.get(category.id));
        }
      }
    });
    
    return rootCategories;
  }
}
