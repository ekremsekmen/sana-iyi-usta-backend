import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CampaignDto } from '../dto/campaign.dto';
import { CampaignValidationService } from './campaign-validation.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CampaignCreateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: CampaignValidationService
  ) {}

  async create(mechanicId: string, createCampaignDto: CampaignDto, userId: string = null) {
    try {
      const { category_id, brand_ids, model_id, model_year_id, variant_id, ...campaignData } = createCampaignDto;

      // Validasyonlar
      await this.validationService.validateMechanicOwnership(mechanicId, userId);
      await this.validationService.validateBrands(mechanicId, brand_ids);
      await this.validationService.validateCategory(mechanicId, category_id);
      await this.validationService.validateDuplicateTitle(mechanicId, campaignData.title);
      const validUntilDate = this.validationService.validateDate(campaignData.valid_until);

      return await this.prisma.$transaction(async (tx) => {
        // Kampanyayı oluştur
        const campaign = await tx.campaigns.create({
          data: {
            title: campaignData.title,
            description: campaignData.description,
            discount_rate: campaignData.discount_rate,
            valid_until: validUntilDate,
            created_at: new Date(),
            mechanic_id: mechanicId,
            model_id: model_id || null,
            model_year_id: model_year_id || null,
            variant_id: variant_id || null,
          }
        });

        // Kampanya kategorisini oluştur
        await tx.campaign_categories.create({
          data: {
            campaign_id: campaign.id,
            category_id: category_id
          }
        });

        // Kampanya markalarını oluştur
        await tx.campaign_brands.createMany({
          data: brand_ids.map(brandId => ({
            campaign_id: campaign.id,
            brand_id: brandId,
            created_at: new Date()
          }))
        });

        // Tüm ilişkileri içeren kampanyayı getir
        return await tx.campaigns.findUnique({
          where: { id: campaign.id },
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
            models: true,
            model_years: true,
            variants: true,
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
      this.handleErrors(error, 'Kampanya oluşturma');
    }
  }

  private handleErrors(error: any, operation: string) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(`Prisma Hatası Kodu: ${error.code}`, error.message);
      if (error.code === 'P2002') {
        throw new InternalServerErrorException('Bu kampanya bilgileri ile zaten bir kayıt mevcut');
      } else if (error.code === 'P2003') {
        throw new InternalServerErrorException('Referans verilen bir kayıt bulunamadı');
      } else if (error.code === 'P2025') {
        throw new InternalServerErrorException('İlgili kayıt bulunamadı');
      }
      throw new InternalServerErrorException(`Veritabanı hatası oluştu: ${error.message}`);
    }
    console.error(`${operation} sırasında hata: ${error.message}`, error.stack);
    throw error;
  }
}
