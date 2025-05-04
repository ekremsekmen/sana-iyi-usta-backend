import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LocationDto } from './dto/location.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createLocationDto: LocationDto) {
    // Kullanıcının rolünü kontrol et
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { role: true, default_location_id: true }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Tamirci (mechanic) rolündeki kullanıcılar için özel işlem
    if (user.role === 'mechanic') {
      return this.handleMechanicLocation(userId, createLocationDto);
    }

    // Normal kullanıcılar için standart işlem
    const existingLocation = await this.prisma.locations.findFirst({
      where: {
        user_id: userId,
        latitude: createLocationDto.latitude,
        longitude: createLocationDto.longitude,
      },
    });

    if (existingLocation) {
       throw new ConflictException('Bu konuma ait kayıt zaten mevcut');
    }

    return this.prisma.locations.create({
      data: {
        user_id: userId,
        address: createLocationDto.address,
        latitude: createLocationDto.latitude,
        longitude: createLocationDto.longitude,
        label: createLocationDto.label,
        city: createLocationDto.city,
        district: createLocationDto.district,
      },
    });
  }

  // Tamirci rolündeki kullanıcılar için konum işlemini yöneten yardımcı metod
  private async handleMechanicLocation(userId: string, locationDto: LocationDto) {
    // Kullanıcının mevcut tüm konumlarını bul
    const existingLocations = await this.prisma.locations.findMany({
      where: { user_id: userId }
    });

    // Transaction ile tüm işlemleri atomik olarak gerçekleştir
    return this.prisma.$transaction(async (tx) => {
      // Eğer tamircinin daha önce eklediği konum varsa, güncelleyelim
      if (existingLocations.length > 0) {
        const existingLocation = existingLocations[0]; // İlk konumu alalım
        
        // Mevcut konumu güncelle
        const updatedLocation = await tx.locations.update({
          where: { id: existingLocation.id },
          data: {
            address: locationDto.address,
            latitude: locationDto.latitude,
            longitude: locationDto.longitude,
            label: locationDto.label,
            city: locationDto.city,
            district: locationDto.district,
          }
        });

        // Güncellenmiş konumu varsayılan konum olarak ayarla
        await tx.users.update({
          where: { id: userId },
          data: { default_location_id: updatedLocation.id }
        });

        return updatedLocation;
      }

      // Yeni konumu oluştur (daha önce konum yoksa)
      const newLocation = await tx.locations.create({
        data: {
          user_id: userId,
          address: locationDto.address,
          latitude: locationDto.latitude,
          longitude: locationDto.longitude,
          label: locationDto.label,
          city: locationDto.city,
          district: locationDto.district,
        }
      });

      // Yeni konumu varsayılan konum olarak ayarla
      await tx.users.update({
        where: { id: userId },
        data: { default_location_id: newLocation.id }
      });

      return newLocation;
    });
  }

  async findAll(userId: string) {
    return this.prisma.locations.findMany({
      where: { user_id: userId },
    });
  }

  async findOne(id: string, userId: string) {
    const location = await this.prisma.locations.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Konum #${id} bulunamadı`);
    }

    if (location.user_id !== userId) {
      throw new ForbiddenException('Bu konuma erişim yetkiniz yok');
    }

    return location;
  }

  async update(id: string, userId: string, updateLocationDto: LocationDto) {
    await this.findOne(id, userId);

    // Kullanıcının rolünü kontrol et
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Konum güncellemesi
    const updatedLocation = await this.prisma.locations.update({
      where: { id },
      data: {
        address: updateLocationDto.address,
        latitude: updateLocationDto.latitude,
        longitude: updateLocationDto.longitude,
        label: updateLocationDto.label,
        ...(updateLocationDto.city !== undefined && { city: updateLocationDto.city }),
        ...(updateLocationDto.district !== undefined && { district: updateLocationDto.district }),
      },
    });

    // Eğer kullanıcı tamirci rolündeyse, güncellenen konumu varsayılan yap
    if (user.role === 'mechanic') {
      await this.prisma.users.update({
        where: { id: userId },
        data: { default_location_id: id }
      });
    }

    return updatedLocation;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    // Kullanıcı bilgilerini ve rolünü al
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { role: true, default_location_id: true }
    });

    // Tamirciler de artık konumlarını silebilir
    // Varsayılan konum olarak ayarlanmışsa, null yap
    if (user && user.default_location_id === id) {
      await this.prisma.users.update({
        where: { id: userId },
        data: { default_location_id: null },
      });
    }

    await this.prisma.locations.delete({
      where: { id },
    });

    return { message: 'Konum başarıyla silindi' };
  }
}
