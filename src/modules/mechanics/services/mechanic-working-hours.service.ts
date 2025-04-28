import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMechanicWorkingHoursDto } from '../dto/create-mechanic-working-hours.dto';
import { UpdateMechanicWorkingHoursDto } from '../dto/update-mechanic-working-hours.dto';
import { randomUUID } from 'crypto';
import { mechanic_working_hours } from '@prisma/client';

@Injectable()
export class MechanicWorkingHoursService {
  constructor(private readonly prisma: PrismaService) {}

  async createForMechanic(mechanicId: string, dto: CreateMechanicWorkingHoursDto | CreateMechanicWorkingHoursDto[]) {
    if (Array.isArray(dto)) {
      const modifiedDto = dto.map(item => ({
        ...item,
        mechanic_id: mechanicId
      }));
      return this.create(modifiedDto);
    } else {
      const modifiedDto = {
        ...dto,
        mechanic_id: mechanicId
      };
      return this.create(modifiedDto);
    }
  }

  async create(dto: CreateMechanicWorkingHoursDto | CreateMechanicWorkingHoursDto[]) {
    // Eğer girdi bir dizi ise, çoklu işlem yap
    if (Array.isArray(dto)) {
      const results = [];
      
      for (const item of dto) {
        try {
          const existingHours = await this.prisma.mechanic_working_hours.findFirst({
            where: {
              mechanic_id: item.mechanic_id,
              day_of_week: item.day_of_week,
            },
          });

          if (existingHours) {
            continue; // Çoklu eklemede eğer gün zaten varsa, atla ve devam et
          }

          const result = await this.prisma.mechanic_working_hours.create({
            data: {
              id: randomUUID(),
              mechanic_id: item.mechanic_id,
              day_of_week: item.day_of_week,
              start_time: item.start_time,
              end_time: item.end_time,
              slot_duration: item.slot_duration,
              is_day_off: item.is_day_off || false,
            },
          });
          
          results.push(result);
        } catch (error) {
          // Çoklu işlemde bireysel hataları yok say ve devam et
        }
      }
      
      return results;
    } 
    // Tekil DTO işlemi (mevcut davranışı koru)
    else {
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
      
      if (existing) {
        const result = await this.update(existing.id, dto);
        results.push(result);
      } else {
        const createResult = await this.create(dto);
        if (Array.isArray(createResult)) {
          results.push(...createResult);
        } else {
          results.push(createResult);
        }
      }
    }
    
    return results;
  }
}
