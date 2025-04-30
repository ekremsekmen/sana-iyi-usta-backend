import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MechanicProfileDto } from '../dto/mechanic-profile.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class MechanicProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: MechanicProfileDto) {
    return this.prisma.mechanics.create({
      data: {
        id: randomUUID(), 
        business_name: dto.business_name,
        on_site_service: dto.on_site_service,
        users: { connect: { id: dto.user_id } },
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

  async update(id: string, dto: MechanicProfileDto) {
    try {
      const updateData: any = {
        business_name: dto.business_name,
        on_site_service: dto.on_site_service,
      };
      
      const currentMechanic = await this.prisma.mechanics.findUnique({
        where: { id },
        select: { user_id: true }
      });
      
      if (currentMechanic && currentMechanic.user_id !== dto.user_id && dto.user_id) {
        updateData.users = { 
          disconnect: { id: currentMechanic.user_id }, 
          connect: { id: dto.user_id }                
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
