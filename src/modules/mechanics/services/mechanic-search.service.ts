import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SearchMechanicsDto, MechanicSearchResponseDto, SortOrder, SortBy } from '../dto/search-mechanics.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class MechanicSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchMechanics(
    userId: string,
    searchDto: SearchMechanicsDto
  ): Promise<{ mechanics: MechanicSearchResponseDto[], total: number }> {
    // Kullanıcının varsayılan konumunu al
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

    // Eğer şehir belirtilmemişse ve varsayılan konum ayarlanmamışsa veya şehir bilgisi yoksa hata fırlat
    if (!searchDto.city && (!user.default_location_id || !user.locations_users_default_location_idTolocations?.city)) {
      throw new BadRequestException('Bu hizmetten yararlanabilmek için varsayılan konumunuzu ayarlamalısınız veya arama kriterlerinde şehir belirtmelisiniz.');
    }

    const where: any = {};
    
    // Şehir filtresi
    if (searchDto.city) {
      // Kullanıcının şehri verilmişse, o şehirdeki tamirciler
      where.users = {
        locations: {
          some: {
            city: searchDto.city
          }
        }
      };
    } else if (user.default_location_id && user.locations_users_default_location_idTolocations?.city) {
      // Kullanıcının varsayılan konum şehrine göre filtreleme
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

    // Kullanıcının seçtiği sıralama yönünü belirle
    const ratingOrder = searchDto.ratingSort || SortOrder.DESC;

    // Tamircileri sorgula
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
            full_name: true,
            profile_image: true,
            locations: {
              where: {
                city: searchDto.city || user.locations_users_default_location_idTolocations?.city
              },
              select: {
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

      // Eğer kullanıcının konumu ve tamircinin konumu varsa mesafeyi hesapla
      const userLocation = user.locations_users_default_location_idTolocations;
      if (userLocation?.latitude && userLocation?.longitude && 
          mechanic.users.locations && mechanic.users.locations.length > 0) {
        
        const mechLocation = mechanic.users.locations[0]; // İlk konumu kullanıyor
        if (mechLocation.latitude && mechLocation.longitude) {
          result.distance = this.calculateDistance(
            Number(userLocation.latitude), 
            Number(userLocation.longitude),
            Number(mechLocation.latitude), 
            Number(mechLocation.longitude)
          );
        }
      }

      return result;
    });

    // Sıralama stratejisini belirle ve sonuçları ona göre sırala
    let sortedResults = formattedResults;
    
    if (searchDto.sortBy === SortBy.DISTANCE) {
      // Mesafeye göre sıralama - mesafe bilgisi olmayan tamirciler sona yerleştirilir
      sortedResults = formattedResults.sort((a, b) => {
        // Mesafesi hesaplanmamış olanları sona yerleştir
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

  // İki konum arasındaki mesafeyi hesaplamak için Haversine formülü
  private calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Kilometre cinsinden mesafe
    return Math.round(distance * 10) / 10; // Bir ondalık basamağa yuvarla
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}
