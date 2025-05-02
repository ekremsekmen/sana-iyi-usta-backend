import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CampaignQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { mechanicId?: string, categoryId?: string, brandId?: string, active?: string } = {}) {
    try {
      const { mechanicId, categoryId, brandId, active } = query;
      const where: Prisma.campaignsWhereInput = {}; 

      if (mechanicId) {
        where.mechanic_id = mechanicId;
      }

      if (categoryId) {
        where.campaign_categories = {
          some: {
            category_id: categoryId,
          },
        };
      }

      if (brandId) {
        where.campaign_brands = {
          some: {
            brand_id: brandId,
          },
        };
      }

      // Aktif kampanyaları filtreleme
      if (active === 'true') {
        where.valid_until = {
          gte: new Date(),
        };
      } else if (active === 'false') {
        where.valid_until = {
          lt: new Date(),
        };
      }

      return await this.prisma.campaigns.findMany({
        where,
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
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      this.handleErrors(error, 'Kampanya sorgulama');
    }
  }

  async findOne(id: string) {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
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

      if (!campaign) {
        throw new NotFoundException(`ID'si ${id} olan kampanya bulunamadı`);
      }

      return campaign;
    } catch (error) {
      this.handleErrors(error, 'Kampanya detayı getirme');
    }
  }

  async findByMechanic(mechanicId: string) {
    return this.findAll({ mechanicId });
  }

  private handleErrors(error: any, operation: string) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    console.error(`${operation} sırasında hata: ${error.message}`, error.stack);
    throw new InternalServerErrorException(`${operation} sırasında bir sunucu hatası oluştu: ${error.message}`);
  }
}
