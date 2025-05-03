import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CampaignValidationService } from './campaign-validation.service';

@Injectable()
export class CampaignQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: CampaignValidationService
  ) {}

  async findByMechanic(mechanicId: string, userId: string) {
    try {
      await this.validationService.validateMechanicOwnership(mechanicId, userId);

      // Sorguyu daha verimli hale getirelim - ilişkiler için dataloader benzeri yaklaşım
      const campaigns = await this.prisma.campaigns.findMany({
        where: { mechanic_id: mechanicId },
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
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Sadeleştirilmiş yanıt oluştur
      return campaigns.map(campaign => ({
        id: campaign.id,
        mechanic_id: campaign.mechanic_id,
        title: campaign.title,
        description: campaign.description,
        discount_rate: campaign.discount_rate,
        valid_until: campaign.valid_until,
        created_at: campaign.created_at,
        categories: campaign.campaign_categories.map(cc => ({
          id: cc.categories.id,
          name: cc.categories.name
        })),
        brands: campaign.campaign_brands.map(cb => ({
          id: cb.brands.id,
          name: cb.brands.name
        }))
      }));
    } catch (error) {
      this.handleErrors(error, 'Kampanya sorgulama');
    }
  }

  private handleErrors(error: any, operation: string) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    if (error instanceof ForbiddenException) {
      throw error;
    }
    console.error(`${operation} sırasında hata: ${error.message}`, error.stack);
    throw new InternalServerErrorException(`${operation} sırasında bir sunucu hatası oluştu: ${error.message}`);
  }
}
