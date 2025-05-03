import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MechanicProfileDto } from '../dto/mechanic-profile.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class MechanicProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: MechanicProfileDto) {
    // Kullanıcının zaten bir mechanic profili olup olmadığını kontrol et
    const existingMechanic = await this.prisma.mechanics.findFirst({
      where: { user_id: userId }
    });

    if (existingMechanic) {
      throw new ConflictException('Bu kullanıcı için zaten bir tamirci profili bulunmaktadır. Bir kullanıcı yalnızca bir tamirci profiline sahip olabilir.');
    }

    return this.prisma.mechanics.create({
      data: {
        id: randomUUID(), 
        business_name: dto.business_name,
        on_site_service: dto.on_site_service,
        users: { connect: { id: userId } },
      },
    });
  }

  async findOne(id: string) {
    const mechanic = await this.prisma.mechanics.findUnique({ where: { id } });
    if (!mechanic) {
      throw new NotFoundException(`Mechanic with id ${id} not found.`);
    }
    return mechanic;
  }

  async update(id: string, userId: string, dto: MechanicProfileDto) {
    try {
      const updateData: any = {
        business_name: dto.business_name,
        on_site_service: dto.on_site_service,
      };
      
      const currentMechanic = await this.prisma.mechanics.findUnique({
        where: { id },
        select: { user_id: true }
      });
      
      // Sadece kullanıcı değişiyorsa ilişkiyi güncelle
      if (currentMechanic && currentMechanic.user_id !== userId) {
        updateData.users = { 
          disconnect: { id: currentMechanic.user_id }, 
          connect: { id: userId }                
        };
      }
      
      return await this.prisma.mechanics.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new NotFoundException(`Mechanic with id ${id} not found.`);
    }
  }

  async remove(id: string) {
    return this.prisma.mechanics.delete({ where: { id } });
  }
}
