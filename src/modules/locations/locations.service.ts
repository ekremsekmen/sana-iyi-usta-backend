import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LocationDto } from './dto/location.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createLocationDto: LocationDto) {
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

    return this.prisma.locations.update({
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
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.users.update({
      where: { 
        id: userId,
        default_location_id: id 
      },
      data: { default_location_id: null },
    });

    await this.prisma.locations.delete({
      where: { id },
    });

    return { message: 'Konum başarıyla silindi' };
  }
}
