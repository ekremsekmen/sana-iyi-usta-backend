import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CampaignDto } from '../dto/campaign.dto';
import { CampaignValidationService } from './campaign-validation.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CampaignUpdateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: CampaignValidationService
  ) {}

  async update(id: string, mechanicId: string, updateCampaignDto: CampaignDto) {
    try {
      const { category_id, brand_ids, ...campaignData } = updateCampaignDto;


      await this.validationService.validateCampaignOwnership(id, mechanicId);
      
      if (campaignData.title) {
        await this.validationService.validateDuplicateTitle(mechanicId, campaignData.title, id);
      }

      if (brand_ids && brand_ids.length > 0) {
        await this.validationService.validateBrands(mechanicId, brand_ids);
      }

      if (category_id) {
        await this.validationService.validateCategory(mechanicId, category_id);
      }

      let validUntilDate: Date | undefined;
      if (campaignData.valid_until) {
        validUntilDate = this.validationService.validateDate(campaignData.valid_until);
      }

      return await this.prisma.$transaction(async (tx) => {
        // Ana kampanya kaydını güncelle
        const updateData: Prisma.campaignsUpdateInput = {};

        if (campaignData.title !== undefined) updateData.title = campaignData.title;
        if (campaignData.description !== undefined) updateData.description = campaignData.description;
        if (campaignData.discount_rate !== undefined) updateData.discount_rate = campaignData.discount_rate;
        if (validUntilDate) updateData.valid_until = validUntilDate;
        
        // Ana kampanya kaydını güncelle
        if (Object.keys(updateData).length > 0) {
          await tx.campaigns.update({
            where: { id },
            data: updateData,
          });
        }

        // Kategori ilişkilerini güncelle
        if (category_id) {
          // Önce mevcut kategorileri temizle
          await tx.campaign_categories.deleteMany({
            where: { campaign_id: id },
          });

          // Sonra yeni kategoriyi oluştur
          await tx.campaign_categories.create({
            data: {
              campaign_id: id,
              category_id: category_id,
            },
          });
        }

        // Marka ilişkilerini güncelle
        if (brand_ids !== undefined) {
          // Önce mevcut markaları temizle
          await tx.campaign_brands.deleteMany({
            where: { campaign_id: id },
          });

          // Eğer yeni markalar varsa ekle
          if (brand_ids.length > 0) {
            await tx.campaign_brands.createMany({
              data: brand_ids.map(brandId => ({
                campaign_id: id,
                brand_id: brandId,
                created_at: new Date()
              })),
            });
          }
        }

        // Güncellenmiş kampanya bilgisini tüm ilişkileriyle döndür
        return await tx.campaigns.findUnique({
          where: { id },
          include: {
            campaign_categories: {
              include: {
                categories: true,
              },
            },
            campaign_brands: {
              include: {
                brands: true,
              },
            },
            mechanics: {
              select: {
                id: true,
                business_name: true,
                average_rating: true,
              },
            },
          },
        });
      });
    } catch (error) {
      this.handleErrors(error, 'Kampanya güncelleme');
    }
  }

  private handleErrors(error: any, operation: string) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(`Prisma Hatası Kodu: ${error.code}`, error.message);
      throw new InternalServerErrorException(`Veritabanı hatası oluştu: ${error.message}`);
    }
    console.error(`${operation} sırasında hata: ${error.message}`, error.stack);
    throw error;
  }
}
