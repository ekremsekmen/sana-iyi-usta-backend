import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CampaignDto } from '../dto/campaign.dto';
import { CampaignValidationService } from './campaign-validation.service';
import { Prisma } from '@prisma/client';
import { FilesService } from '../../files/files.service';

@Injectable()
export class CampaignUpdateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: CampaignValidationService,
    private readonly filesService: FilesService
  ) {}

  async update(id: string, mechanicId: string, updateCampaignDto: CampaignDto, userId: string) {
    try {
      const { category_ids, brand_ids, ...campaignData } = updateCampaignDto;

      // Validasyon işlemlerini paralel olarak çalıştıralım
      await Promise.all([
        this.validationService.validateMechanicOwnership(mechanicId, userId),
        this.validationService.validateCampaignOwnership(id, mechanicId),
        brand_ids && brand_ids.length > 0 ? this.validationService.validateBrands(mechanicId, brand_ids) : Promise.resolve(),
        category_ids && category_ids.length > 0 ? this.validationService.validateCategories(mechanicId, category_ids) : Promise.resolve()
      ]);

      let validUntilDate: Date | undefined;
      if (campaignData.valid_until) {
        validUntilDate = this.validationService.validateDate(campaignData.valid_until);
      }

      return await this.prisma.$transaction(async (tx) => {
        const updateData: Prisma.campaignsUpdateInput = {};

        if (campaignData.title !== undefined) updateData.title = campaignData.title;
        if (campaignData.description !== undefined) updateData.description = campaignData.description;
        if (campaignData.discount_rate !== undefined) updateData.discount_rate = campaignData.discount_rate;
        if (validUntilDate) updateData.valid_until = validUntilDate;
        
        if (Object.keys(updateData).length > 0) {
          await tx.campaigns.update({
            where: { id },
            data: updateData,
          });
        }

        if (category_ids !== undefined) {
          await tx.campaign_categories.deleteMany({
            where: { campaign_id: id },
          });

          if (category_ids.length > 0) {
            await tx.campaign_categories.createMany({
              data: category_ids.map(categoryId => ({
                campaign_id: id,
                category_id: categoryId,
              })),
            });
          }
        }

        if (brand_ids !== undefined) {
          await tx.campaign_brands.deleteMany({
            where: { campaign_id: id },
          });

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

        // İlişkisel verileri al
        const campaignWithRelations = await tx.campaigns.findUnique({
          where: { id },
          include: {
            campaign_categories: {
              include: {
                categories: {
                  select: {
                    id: true,
                    name: true
                  }
                },
              },
            },
            campaign_brands: {
              include: {
                brands: {
                  select: {
                    id: true,
                    name: true
                  }
                },
              },
            }
          },
        });

        // Sadeleştirilmiş yanıt oluştur
        return {
          id: campaignWithRelations.id,
          mechanic_id: campaignWithRelations.mechanic_id,
          title: campaignWithRelations.title,
          description: campaignWithRelations.description,
          discount_rate: campaignWithRelations.discount_rate,
          valid_until: campaignWithRelations.valid_until,
          created_at: campaignWithRelations.created_at,
          categories: campaignWithRelations.campaign_categories.map(cc => ({
            id: cc.categories.id,
            name: cc.categories.name
          })),
          brands: campaignWithRelations.campaign_brands.map(cb => ({
            id: cb.brands.id,
            name: cb.brands.name
          }))
        };
      });
    } catch (error) {
      this.handleErrors(error, 'Kampanya güncelleme');
    }
  }

  async updateImage(id: string, mechanicId: string, file: Express.Multer.File, userId: string) {
    try {
      // Validasyon işlemleri
      await this.validationService.validateMechanicOwnership(mechanicId, userId);
      await this.validationService.validateCampaignOwnership(id, mechanicId);
      
      // Dosya yükleme
      const imageUrl = await this.filesService.uploadFile(file, 'campaigns');
      
      // Kampanya güncelleme
      await this.prisma.campaigns.update({
        where: { id },
        data: { image_url: imageUrl },
      });
      
      // Güncellenmiş kampanyayı getir
      const updatedCampaign = await this.prisma.campaigns.findUnique({
        where: { id },
        include: {
          campaign_categories: {
            include: {
              categories: {
                select: {
                  id: true,
                  name: true
                }
              },
            },
          },
          campaign_brands: {
            include: {
              brands: {
                select: {
                  id: true,
                  name: true
                }
              },
            },
          }
        },
      });
      
      // Yanıt oluştur
      return {
        id: updatedCampaign.id,
        mechanic_id: updatedCampaign.mechanic_id,
        title: updatedCampaign.title,
        description: updatedCampaign.description,
        discount_rate: updatedCampaign.discount_rate,
        valid_until: updatedCampaign.valid_until,
        created_at: updatedCampaign.created_at,
        image_url: updatedCampaign.image_url,
        categories: updatedCampaign.campaign_categories.map(cc => ({
          id: cc.categories.id,
          name: cc.categories.name
        })),
        brands: updatedCampaign.campaign_brands.map(cb => ({
          id: cb.brands.id,
          name: cb.brands.name
        }))
      };
    } catch (error) {
      this.handleErrors(error, 'Kampanya resmi güncelleme');
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
