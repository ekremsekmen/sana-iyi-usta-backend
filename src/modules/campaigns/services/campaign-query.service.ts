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

  async findCampaignsForCustomer(userId: string) {
    try {
      // 1. Kullanıcının default location bilgisini al
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          default_location_id: true,
          locations_users_default_location_idTolocations: {
            select: {
              city: true
            }
          }
        }
      });

      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }

      // 2. Kullanıcının araçlarını al
      const customer = await this.prisma.customers.findFirst({
        where: { user_id: userId },
        select: {
          id: true,
          customer_vehicles: {
            select: {
              brand_id: true
            }
          }
        }
      });

      if (!customer) {
        throw new NotFoundException('Müşteri profili bulunamadı');
      }

      const brandIds = [...new Set(customer.customer_vehicles.map(v => v.brand_id))];

      const whereConditions: Prisma.campaignsWhereInput = {
        valid_until: {
          gte: new Date() 
        }
      };

      const orConditions = [];

      if (brandIds.length > 0) {
        orConditions.push({
          campaign_brands: {
            some: {
              brand_id: {
                in: brandIds
              }
            }
          }
        });
      }

      const userCity = user.locations_users_default_location_idTolocations?.city;
      if (userCity) {
        orConditions.push({
          mechanics: {
            users: {
              locations: {
                some: {
                  city: userCity
                }
              }
            }
          }
        });
      }

      if (orConditions.length > 0) {
        whereConditions.OR = orConditions;
      }

      const campaigns = await this.prisma.campaigns.findMany({
        where: whereConditions,
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
          mechanics: {
            include: {
              users: {
                select: {
                  full_name: true,
                  locations: {
                    select: {
                      city: true,
                      district: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // 6. Sonuçları düzenle
      return campaigns.map(campaign => {
        let mechanicLocation = null;
        
        if (campaign.mechanics.users.locations && campaign.mechanics.users.locations.length > 0) {
          const sameCity = userCity 
            ? campaign.mechanics.users.locations.find(loc => loc.city === userCity)
            : null;
          
          const locationToUse = sameCity || campaign.mechanics.users.locations[0];
          
          mechanicLocation = {
            city: locationToUse.city,
            district: locationToUse.district
          };
        }
        
        return {
          id: campaign.id,
          mechanic_id: campaign.mechanic_id,
          mechanic_name: campaign.mechanics.business_name,
          mechanic_location: mechanicLocation,
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
        };
      });
    } catch (error) {
      this.handleErrors(error, 'Müşteri kampanyaları sorgulama');
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
