import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LocationDto } from './dto/location.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocationsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService
  ) {}

  async create(userId: string, createLocationDto: LocationDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { role: true, default_location_id: true }
    });
  
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
  
    if (user.role === 'mechanic') {
      return this.handleMechanicLocation(userId, createLocationDto);
    }
  
    // Müşteriler için konum sayısı kontrolü
    const userLocationsCount = await this.prisma.locations.count({
      where: { user_id: userId }
    });
  
    if (userLocationsCount > 3) {
      throw new ForbiddenException('En fazla 3 konum ekleyebilirsiniz');
    }
  
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

  private async handleMechanicLocation(userId: string, locationDto: LocationDto) {
    const existingLocations = await this.prisma.locations.findMany({
      where: { user_id: userId }
    });

    return this.prisma.$transaction(async (tx) => {
      let locationId: string;
      
      if (existingLocations.length > 0) {
        const existingLocation = existingLocations[0]; 
        
       
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

        locationId = updatedLocation.id;
      } else {
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

        locationId = newLocation.id;
      }
       
      await this.usersService.setDefaultLocation(userId, locationId, tx);      
     
      return tx.locations.findUnique({
        where: { id: locationId }
      });
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

   
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.role === 'mechanic') {
      return this.prisma.$transaction(async (tx) => {
        
        const updatedLocation = await tx.locations.update({
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

        await this.usersService.setDefaultLocation(userId, id, tx);

        return updatedLocation;
      });
    } else {
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
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: { id: userId },
        select: { role: true, default_location_id: true }
      });

      if (user && user.default_location_id === id) {
        await tx.users.update({
          where: { id: userId },
          data: { default_location_id: null },
        });
      }

      await tx.locations.delete({
        where: { id },
      });

      return { message: 'Konum başarıyla silindi' };
    });
  }
}
