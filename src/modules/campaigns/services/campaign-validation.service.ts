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

    for (const brandId of brandIds) {
      const supportedBrand = await this.prisma.mechanic_supported_vehicles.findFirst({
        where: {
          mechanic_id: mechanicId,
          brand_id: brandId
        }
      });

      if (!supportedBrand) {
        throw new BadRequestException(`Bir veya daha fazla marka için hizmet vermiyorsunuz. Lütfen desteklediğiniz markalar seçin.`);
      }
    }
  }

  async validateCategories(mechanicId: string, categoryIds: string[]) {
    if (!categoryIds || categoryIds.length === 0) {
      throw new BadRequestException('En az bir kategori seçmelisiniz');
    }

    for (const categoryId of categoryIds) {
      const category = await this.prisma.categories.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        throw new NotFoundException(`Bu ID'ye sahip kategori bulunamadı: ${categoryId}`);
      }

      const supportedCategory = await this.prisma.mechanic_categories.findFirst({
        where: {
          mechanic_id: mechanicId,
          category_id: categoryId
        }
      });

      if (!supportedCategory) {
        throw new BadRequestException(`${category.name} kategorisi için hizmet vermiyorsunuz. Lütfen desteklediğiniz kategorileri seçin.`);
      }
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
