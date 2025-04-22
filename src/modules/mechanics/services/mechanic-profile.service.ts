import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMechanicDto } from '../dto/create-mechanic.dto';
import { UpdateMechanicDto } from '../dto/update-mechanic.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class MechanicProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMechanicDto) {
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

  async update(id: string, dto: UpdateMechanicDto) {
    try {
      return await this.prisma.mechanics.update({
        where: { id },
        data: {
          business_name: dto.business_name,
          on_site_service: dto.on_site_service,
          users: { connect: { id: dto.user_id } },
        },
      });
    } catch {
      throw new NotFoundException(`Mechanic with id ${id} not found.`);
    }
  }

  async remove(id: string) {
    return this.prisma.mechanics.delete({ where: { id } });
  }
}
