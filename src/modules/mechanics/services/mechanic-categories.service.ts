import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { MechanicCategoryDto } from '../dto/mechanic-category.dto';

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

  async create(dto: MechanicCategoryDto | MechanicCategoryDto[]) {
    try {
      // Dizi (çoklu) kategori işlemi
      if (Array.isArray(dto)) {
        if (dto.length === 0) {
          return []; // Boş dizi durumunda boş dizi döndür
        }
        
        // Tüm öğelerin aynı mechanic_id'ye sahip olduğundan emin ol
        const mechanicId = dto[0].mechanic_id;
        const hasInconsistentMechanicId = dto.some(item => item.mechanic_id !== mechanicId);
        
        if (hasInconsistentMechanicId) {
          throw new BadRequestException('Tüm kategori kayıtları aynı tamirciye ait olmalıdır.');
        }
        
        return this.createMultipleCategories(dto[0].mechanic_id, dto.map(item => item.category_id));
      } 
      // Tekil kategori işlemi
      else {
        // Kategori varlığını kontrol et
        const category = await this.prisma.categories.findUnique({
          where: { id: dto.category_id },
        });

        if (!category) {
          throw new NotFoundException(`${dto.category_id} ID'li kategori bulunamadı.`);
        }

        // Upsert işlemi ile varsa güncelle, yoksa oluştur
        return await this.prisma.mechanic_categories.upsert({
          where: {
            mechanic_id_category_id: {
              mechanic_id: dto.mechanic_id,
              category_id: dto.category_id,
            },
          },
          update: {}, // Sadece varlığını korumak için güncelleme yapmıyoruz
          create: {
            id: randomUUID(),
            mechanic_id: dto.mechanic_id,
            category_id: dto.category_id,
          },
          include: {
            categories: true,
          }
        });
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Genel Error yerine InternalServerErrorException kullanıldı
      console.error(`Kategori kaydı oluşturulurken hata: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Kategori kaydı oluşturulurken bir sunucu hatası oluştu: ${error.message}`);
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
      // Boş dizi kontrolü - eğer boş dizi gönderilirse hata fırlat
      if (!categoryIds || categoryIds.length === 0) {
        throw new BadRequestException('En az bir kategori belirtilmelidir. Tüm kategorileri kaldırmak istiyorsanız, silme işlemini özel olarak gerçekleştirin.');
      }
      
      return await this.prisma.$transaction(async (tx) => {
        // Tüm kategori ID'lerinin geçerli olduğunu kontrol et
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
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Genel Error yerine InternalServerErrorException kullanıldı
      console.error(`Kategorileri güncellerken hata: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Kategorileri güncellerken bir sunucu hatası oluştu: ${error.message}`);
    }
  }

  // Çoklu kategori ekleme yardımcı metodu
  private async createMultipleCategories(mechanicId: string, categoryIds: string[]) {
    try {
      // Boş dizi kontrolü
      if (!categoryIds || categoryIds.length === 0) {
        throw new BadRequestException('En az bir kategori belirtilmelidir.');
      }
      
      return await this.prisma.$transaction(async (tx) => {
        // Tüm kategori ID'lerinin geçerli olduğunu kontrol et
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
  
        const results = [];
        
        for (const categoryId of categoryIds) {
          // Upsert işlemi ile her bir kategori için kayıt oluştur veya güncelle
          const result = await tx.mechanic_categories.upsert({
            where: {
              mechanic_id_category_id: {
                mechanic_id: mechanicId,
                category_id: categoryId,
              },
            },
            update: {}, // Sadece varlığını korumak için güncelleme yapmıyoruz
            create: {
              id: randomUUID(),
              mechanic_id: mechanicId,
              category_id: categoryId,
            },
            include: {
              categories: true,
            }
          });
          
          results.push(result);
        }
        
        return results;
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Genel Error yerine InternalServerErrorException kullanıldı
      console.error(`Kategorileri eklerken hata: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Kategorileri eklerken bir sunucu hatası oluştu: ${error.message}`);
    }
  }

  async createForMechanic(mechanicId: string, dto: MechanicCategoryDto | MechanicCategoryDto[]) {
    if (Array.isArray(dto)) {
      const modifiedDto = dto.map(item => ({
        ...item,
        mechanic_id: mechanicId
      }));
      return this.create(modifiedDto);
    } else {
      const modifiedDto = {
        ...dto,
        mechanic_id: mechanicId
      };
      return this.create(modifiedDto);
    }
  }
}
