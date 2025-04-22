import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMechanicWorkingHoursDto } from '../dto/create-mechanic-working-hours.dto';
import { UpdateMechanicWorkingHoursDto } from '../dto/update-mechanic-working-hours.dto';
import { randomUUID } from 'crypto';
import { mechanic_working_hours } from '@prisma/client';

@Injectable()
export class MechanicWorkingHoursService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMechanicWorkingHoursDto) {
    try {
      const existingHours = await this.prisma.mechanic_working_hours.findFirst({
        where: {
          mechanic_id: dto.mechanic_id,
          day_of_week: dto.day_of_week,
        },
      });

      if (existingHours) {
        throw new ConflictException(`Working hours for day ${dto.day_of_week} already exist.`);
      }

      return await this.prisma.mechanic_working_hours.create({
        data: {
          id: randomUUID(),
          mechanic_id: dto.mechanic_id,
          day_of_week: dto.day_of_week,
          start_time: dto.start_time,
          end_time: dto.end_time,
          slot_duration: dto.slot_duration,
          is_day_off: dto.is_day_off || false,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error creating working hours: ${error.message}`);
    }
  }

  async findByMechanic(mechanicId: string) {
    return this.prisma.mechanic_working_hours.findMany({
      where: { mechanic_id: mechanicId },
      orderBy: { day_of_week: 'asc' },
    });
  }

  async findOne(id: string) {
    const workingHours = await this.prisma.mechanic_working_hours.findUnique({
      where: { id },
    });

    if (!workingHours) {
      throw new NotFoundException(`Working hours with id ${id} not found.`);
    }

    return workingHours;
  }

  async update(id: string, dto: UpdateMechanicWorkingHoursDto) {
    try {
      return await this.prisma.mechanic_working_hours.update({
        where: { id },
        data: {
          start_time: dto.start_time,
          end_time: dto.end_time,
          slot_duration: dto.slot_duration,
          is_day_off: dto.is_day_off,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Working hours with id ${id} not found.`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.mechanic_working_hours.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Working hours with id ${id} not found.`);
    }
  }

  async createOrUpdateBulk(mechanicId: string, dtoList: CreateMechanicWorkingHoursDto[]) {
    const results: mechanic_working_hours[] = [];
    
    const existingHours = await this.prisma.mechanic_working_hours.findMany({
      where: {
        mechanic_id: mechanicId,
      },
    });
    
    for (const dto of dtoList) {
      dto.mechanic_id = mechanicId;
      
      const existing = existingHours.find(hour => hour.day_of_week === dto.day_of_week);
      
      let result: mechanic_working_hours;
      if (existing) {
        result = await this.update(existing.id, dto);
      } else {
        result = await this.create(dto);
      }
      
      results.push(result);
    }
    
    return results;
  }
}
