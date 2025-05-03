import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CampaignValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async validateMechanicOwnership(mechanicId: string, userId: string) {
    const mechanic = await this.prisma.mechanics.findUnique({
      where: { id: mechanicId }
    });

    if (!mechanic || mechanic.user_id !== userId) {
      throw new BadRequestException('Bu tamirci için kampanya işlemi yapma yetkiniz yok');
    }
  }

  async validateCampaignOwnership(campaignId: string, mechanicId: string) {
    const existingCampaign = await this.prisma.campaigns.findUnique({
      where: { id: campaignId },
    });

    if (!existingCampaign) {
      throw new NotFoundException(`ID'si ${campaignId} olan kampanya bulunamadı`);
    }

    if (existingCampaign.mechanic_id !== mechanicId) {
      throw new BadRequestException('Bu kampanya üzerinde işlem yapma yetkiniz yok');
    }

    return existingCampaign;
  }

  async validateBrands(mechanicId: string, brandIds: string[]) {
    if (!brandIds || brandIds.length === 0) {
      throw new BadRequestException('En az bir marka seçmelisiniz');
    }

    // Döngü yerine tek bir sorgu ile desteklenen markaları alalım
    const supportedBrands = await this.prisma.mechanic_supported_vehicles.findMany({
      where: {
        mechanic_id: mechanicId,
        brand_id: { in: brandIds }
      },
      select: {
        brand_id: true
      }
    });

    // Set veri yapısı kullanarak kontrol edelim
    const supportedBrandIds = new Set(supportedBrands.map(sb => sb.brand_id));
    
    // Desteklenmeyen markaları bulalım
    const unsupportedBrandIds = brandIds.filter(id => !supportedBrandIds.has(id));
    
    if (unsupportedBrandIds.length > 0) {
      throw new BadRequestException(`Bir veya daha fazla marka için hizmet vermiyorsunuz. Lütfen desteklediğiniz markalar seçin.`);
    }
  }

  async validateCategories(mechanicId: string, categoryIds: string[]) {
    if (!categoryIds || categoryIds.length === 0) {
      throw new BadRequestException('En az bir kategori seçmelisiniz');
    }

    // Önce kategori varlığını kontrol edelim
    const existingCategories = await this.prisma.categories.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true }
    });

    if (existingCategories.length !== categoryIds.length) {
      const existingCategoryIds = new Set(existingCategories.map(c => c.id));
      const nonExistentCategoryIds = categoryIds.filter(id => !existingCategoryIds.has(id));
      throw new NotFoundException(`Bu ID'lere sahip kategoriler bulunamadı: ${nonExistentCategoryIds.join(', ')}`);
    }

    // Tamircinin desteklediği kategorileri tek sorguda alalım
    const supportedCategories = await this.prisma.mechanic_categories.findMany({
      where: {
        mechanic_id: mechanicId,
        category_id: { in: categoryIds }
      },
      select: {
        category_id: true
      }
    });

    const supportedCategoryIds = new Set(supportedCategories.map(sc => sc.category_id));
    
    // Desteklenmeyen kategorileri bulup hata mesajı oluşturalım
    const unsupportedCategories = existingCategories.filter(category => 
      !supportedCategoryIds.has(category.id)
    );
    
    if (unsupportedCategories.length > 0) {
      const categoryNames = unsupportedCategories.map(c => c.name).join(', ');
      throw new BadRequestException(`${categoryNames} ${unsupportedCategories.length > 1 ? 'kategorileri' : 'kategorisi'} için hizmet vermiyorsunuz. Lütfen desteklediğiniz kategorileri seçin.`);
    }

    return true;
  }

  validateDate(dateString: string) {
    const validUntilDate = new Date(dateString);
    if (isNaN(validUntilDate.getTime())) {
      throw new BadRequestException('Geçersiz tarih formatı');
    }

    if (validUntilDate <= new Date()) {
      throw new BadRequestException('Kampanya bitiş tarihi gelecek bir tarih olmalıdır');
    }

    return validUntilDate;
  }
}
