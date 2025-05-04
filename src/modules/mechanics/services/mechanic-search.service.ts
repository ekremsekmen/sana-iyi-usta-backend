import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SearchMechanicsDto, MechanicSearchResponseDto, SortOrder, SortBy } from '../dto/search-mechanics.dto';
import { LocationsService } from '../../locations/locations.service';

@Injectable()
export class MechanicSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly locationsService: LocationsService
  ) {}

  async searchMechanics(
    userId: string,
    searchDto: SearchMechanicsDto
  ): Promise<{ mechanics: MechanicSearchResponseDto[], total: number }> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        default_location_id: true,
        locations_users_default_location_idTolocations: true
      }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (!searchDto.city && (!user.default_location_id || !user.locations_users_default_location_idTolocations?.city)) {
      throw new BadRequestException('Bu hizmetten yararlanabilmek için varsayılan konumunuzu ayarlamalısınız veya arama kriterlerinde şehir belirtmelisiniz.');
    }

    const where: any = {};
    
    if (searchDto.city) {
      where.users = {
        locations: {
          some: {
            city: searchDto.city
          }
        }
      };
    } else if (user.default_location_id && user.locations_users_default_location_idTolocations?.city) {
      where.users = {
        locations: {
          some: {
            city: user.locations_users_default_location_idTolocations.city
          }
        }
      };
    }

    if (searchDto.categoryId) {
      where.mechanic_categories = {
        some: {
          category_id: searchDto.categoryId
        }
      };
    }

    if (searchDto.brandId) {
      where.mechanic_supported_vehicles = {
        some: {
          brand_id: searchDto.brandId
        }
      };
    }

    if (searchDto.onSiteService !== undefined) {
      where.on_site_service = searchDto.onSiteService;
    }

    const total = await this.prisma.mechanics.count({ where });

    const skip = searchDto.page * searchDto.limit;
    const take = searchDto.limit;

    const ratingOrder = searchDto.ratingSort || SortOrder.DESC;

    const mechanics = await this.prisma.mechanics.findMany({
      where,
      skip,
      take,
      orderBy: [
        { average_rating: ratingOrder }, // Veritabanı sorgusu sırasında rating sıralamasını yapıyoruz
        { business_name: 'asc' }    // Sonra alfabetik sıralama
      ],
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            profile_image: true,
            default_location_id: true, 
            locations: {
              where: {
                city: searchDto.city || user.locations_users_default_location_idTolocations?.city
              },
              select: {
                id: true,
                city: true,
                district: true,
                latitude: true,
                longitude: true
              }
            }
          }
        },
        mechanic_categories: {
          include: {
            categories: true
          }
        },
        mechanic_supported_vehicles: {
          include: {
            brands: true
          }
        }
      }
    });

    // Cevabı formatla
    const formattedResults = mechanics.map(mechanic => {
      const result: MechanicSearchResponseDto = {
        id: mechanic.id,
        business_name: mechanic.business_name,
        on_site_service: mechanic.on_site_service || false,
        average_rating: mechanic.average_rating ? Number(mechanic.average_rating) : null,
        user_id: mechanic.user_id,
        user: {
          full_name: mechanic.users.full_name,
          profile_image: mechanic.users.profile_image
        },
        categories: mechanic.mechanic_categories.map(mc => ({
          id: mc.category_id,
          name: mc.categories.name
        })),
        supported_vehicles: mechanic.mechanic_supported_vehicles.map(sv => ({
          id: sv.brand_id,
          name: sv.brands.name
        }))
      };

      const userLocation = user.locations_users_default_location_idTolocations;
      if (userLocation?.latitude && userLocation?.longitude && 
          mechanic.users.locations && mechanic.users.locations.length > 0) {
        
        let mechLocation = null;

        if (mechanic.users.default_location_id) {
          mechLocation = mechanic.users.locations.find(
            loc => loc.id === mechanic.users.default_location_id
          );
        }
        
        if (mechLocation?.latitude && mechLocation?.longitude) {
          // LocationsService'i kullanarak mesafe hesaplama
          result.distance = this.locationsService.calculateDistance(
            Number(userLocation.latitude), 
            Number(userLocation.longitude),
            Number(mechLocation.latitude), 
            Number(mechLocation.longitude)
          );
        }
      }

      return result;
    });

    let sortedResults = formattedResults;
    
    if (searchDto.sortBy === SortBy.DISTANCE) {
      sortedResults = formattedResults.sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        
        // En yakından uzağa sıralama
        return a.distance - b.distance;
      });
    } else if (searchDto.sortBy === SortBy.RATING) {
      // Veritabanından gelen sıralama zaten rating'e göre, ancak mesafe hesaplandıktan sonra
      // sonuçları tekrar sıralamak için burada bir işlem yapmıyoruz
      // Bu kısmı açıkça belirtmek için boş bırakıyoruz
    }

    return {
      mechanics: sortedResults,
      total
    };
  }
}
