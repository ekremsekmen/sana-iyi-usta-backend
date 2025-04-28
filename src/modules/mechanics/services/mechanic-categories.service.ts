import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateMechanicCategoryDto } from '../dto/create-mechanic-category.dto';

@Injectable()
export class MechanicCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByMechanic(mechanicId: string) {
    const categories = await this.prisma.mechanic_categories.findMany({
      where: { mechanic_id: mechanicId },
      include: {
        categories: true,
      },
    });

    return categories;
  }

  async create(dto: CreateMechanicCategoryDto) {
    try {
      const existingRecord = await this.prisma.mechanic_categories.findFirst({
        where: {
          mechanic_id: dto.mechanic_id,
          category_id: dto.category_id,
        },
      });

      if (existingRecord) {
        throw new ConflictException('Bu kategori zaten tamircinin hizmetleri listesinde mevcut.');
      }

      const category = await this.prisma.categories.findUnique({
        where: { id: dto.category_id },
      });

      if (!category) {
        throw new NotFoundException(`${dto.category_id} ID'li kategori bulunamadı.`);
      }

      return await this.prisma.mechanic_categories.create({
        data: {
          id: randomUUID(),
          mechanic_id: dto.mechanic_id,
          category_id: dto.category_id,
        },
        include: {
          categories: true,
        }
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Kategori kaydı oluşturulurken hata: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.mechanic_categories.delete({
        where: { id },
        include: {
          categories: true,
        }
      });
    } catch (error) {
      throw new NotFoundException(`${id} ID'li kategori kaydı bulunamadı.`);
    }
  }

  async removeByMechanicAndCategory(mechanicId: string, categoryId: string) {
    const record = await this.prisma.mechanic_categories.findFirst({
      where: {
        mechanic_id: mechanicId,
        category_id: categoryId,
      },
    });

    if (!record) {
      throw new NotFoundException('Bu tamirci için bu kategori kaydı bulunamadı.');
    }

    return this.remove(record.id);
  }

  async updateBulkCategories(mechanicId: string, categoryIds: string[]) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Tüm kategori ID'lerinin geçerli olduğunu kontrol et
        if (categoryIds.length > 0) {
          const categories = await tx.categories.findMany({
            where: {
              id: { in: categoryIds }
            },
            select: { id: true }
          });

          const foundCategoryIds = categories.map(c => c.id);
          const notFoundCategoryIds = categoryIds.filter(id => !foundCategoryIds.includes(id));

          if (notFoundCategoryIds.length > 0) {
            throw new NotFoundException(`Bu ID'lere sahip kategoriler bulunamadı: ${notFoundCategoryIds.join(', ')}`);
          }
        }
        
        // Mevcut kategorileri al
        const existingRecords = await tx.mechanic_categories.findMany({
          where: { mechanic_id: mechanicId },
          select: { id: true, category_id: true }
        });
        
        const existingCategoryIds = existingRecords.map(record => record.category_id);
        
        // Silinecek kategorileri belirle
        const categoryIdsToRemove = existingCategoryIds.filter(id => !categoryIds.includes(id));
        
        // Eklenecek kategorileri belirle
        const categoryIdsToAdd = categoryIds.filter(id => !existingCategoryIds.includes(id));
        
        // Silinecek kayıtları sil
        if (categoryIdsToRemove.length > 0) {
          await tx.mechanic_categories.deleteMany({
            where: {
              mechanic_id: mechanicId,
              category_id: { in: categoryIdsToRemove }
            }
          });
        }
        
        // Yeni kayıtları ekle
        const newRecords = categoryIdsToAdd.map(categoryId => ({
          id: randomUUID(),
          mechanic_id: mechanicId,
          category_id: categoryId
        }));
        
        if (newRecords.length > 0) {
          await tx.mechanic_categories.createMany({
            data: newRecords
          });
        }
        
        // Güncellenmiş kayıtları döndür
        return await tx.mechanic_categories.findMany({
          where: { mechanic_id: mechanicId },
          include: { categories: true }
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Kategorileri güncellerken hata: ${error.message}`);
    }
  }
}
