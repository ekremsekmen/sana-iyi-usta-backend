import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto, UserProfileResponseDto } from './dto/user-profile.dto';
import { DefaultLocationResponseDto } from './dto/default-location.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<UserProfileResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        phone_number: true,
        role: true,
        profile_image: true,
        created_at: true,
        e_mail: true,
        default_location_id: true,
        locations_users_default_location_idTolocations: {
          select: {
            id: true,
            address: true,
            city: true,
            district: true,
            label: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Kullanıcı #${id} bulunamadı`);
    }

    // Varsayılan konumu hazırla
    const defaultLocation = user.default_location_id 
      ? user.locations_users_default_location_idTolocations 
      : null;

    // Kullanıcı nesnesini oluştur
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { default_location_id, locations_users_default_location_idTolocations, ...userWithoutLocation } = user;
    const userDto = {
      ...userWithoutLocation,
      default_location: defaultLocation,
      user_role: user.role, // Rol bilgisini açık şekilde belirtelim
    };

    const response: UserProfileResponseDto = {
      user: userDto
    };

    if (user.role === 'mechanic') {
      const mechanic = await this.prisma.mechanics.findFirst({
        where: { user_id: id },
        include: {
          mechanic_categories: {
            include: {
              categories: true
            }
          },
          mechanic_working_hours: true,
          mechanic_supported_vehicles: {
            include: {
              brands: true
            }
          }
        }
      });

      if (mechanic) {
        response.mechanic = mechanic;
      }
    } else if (user.role === 'customer') {
      const customer = await this.prisma.customers.findFirst({
        where: { user_id: id },
      });

      if (customer) {
        response.customer = customer;
      }
    }
    
    return response;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.update({
      where: { id },
      data: {
        phone_number: updateUserDto.phone_number,
        profile_image: updateUserDto.profile_image,
        full_name: updateUserDto.full_name,
      },
      select: {
        id: true,
        full_name: true,
        phone_number: true,
        profile_image: true,
        e_mail: true,
        role: true,
        created_at: true,
      },
    });

    return user;
  }

  async setDefaultLocation(userId: string, locationId: string, prismaClient?: any) {
    // Eğer dışarıdan transaction gönderilmişse onu kullan, yoksa normal prisma kullan
    const txClient = prismaClient || this.prisma;
    
    // İlk olarak lokasyonun kullanıcıya ait olduğunu doğrulayalım
    const location = await txClient.locations.findFirst({
      where: {
        id: locationId,
        user_id: userId,
      },
    });
  
    if (!location) {
      throw new NotFoundException('Konum bulunamadı veya bu konuma erişim yetkiniz yok');
    }
  
    return txClient.users.update({
      where: { id: userId },
      data: { default_location_id: locationId },
      select: {
        id: true,
        default_location_id: true,
        locations_users_default_location_idTolocations: {
          select: {
            id: true,
            address: true,
            city: true,
            district: true,
            label: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });
  }

  async getDefaultLocation(userId: string): Promise<DefaultLocationResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        default_location_id: true,
        locations_users_default_location_idTolocations: {
          select: {
            id: true,
            address: true,
            city: true,
            district: true,
            label: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Kullanıcı #${userId} bulunamadı`);
    }

    if (!user.default_location_id) {
      return { 
        id: user.id,
        default_location: null 
      };
    }

    return {
      id: user.id,
      default_location: user.locations_users_default_location_idTolocations
    };
  }

  async remove(id: string) {
    await this.prisma.users.delete({ 
      where: { id } 
    });
    
    return { message: 'Kullanıcı başarıyla silindi' };
  }
}
