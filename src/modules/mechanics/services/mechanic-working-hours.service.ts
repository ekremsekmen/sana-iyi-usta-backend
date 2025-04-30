import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { MechanicWorkingHoursDto } from '../dto/mechanic-working-hours.dto';
import { randomUUID } from 'crypto';
import { mechanic_working_hours } from '@prisma/client';

@Injectable()
export class MechanicWorkingHoursService {
  constructor(private readonly prisma: PrismaService) {}

  async createForMechanic(mechanicId: string, dto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[]) {
    if (Array.isArray(dto)) {
      if (dto.length === 0) {
        return []; 
      }
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

  async create(dto: MechanicWorkingHoursDto | MechanicWorkingHoursDto[]) {
    // Eğer girdi bir dizi ise, çoklu işlem yap
    if (Array.isArray(dto)) {
      if (dto.length === 0) {
        return []; // Boş dizi durumunda boş dizi döndür
      }
      
      // Tüm öğelerin aynı mechanic_id'ye sahip olduğundan emin ol
      const mechanicId = dto[0].mechanic_id;
      const hasInconsistentMechanicId = dto.some(item => item.mechanic_id !== mechanicId);
      
      if (hasInconsistentMechanicId) {
        throw new BadRequestException('Tüm çalışma saati kayıtları aynı tamirciye ait olmalıdır.');
      }
      
      try {
        const results: mechanic_working_hours[] = [];
        
        for (const item of dto) {
          const existingHours = await this.prisma.mechanic_working_hours.findFirst({
            where: {
              mechanic_id: item.mechanic_id,
              day_of_week: item.day_of_week,
            },
          });
          
          if (existingHours) {
            // Eğer kayıt zaten varsa, güncelle
            const updated = await this.prisma.mechanic_working_hours.update({
              where: { id: existingHours.id },
              data: {
                start_time: item.start_time,
                end_time: item.end_time,
                slot_duration: item.slot_duration,
                is_day_off: item.is_day_off || false,
              },
            });
            results.push(updated);
          } else {
            // Yeni kayıt oluştur
            const created = await this.prisma.mechanic_working_hours.create({
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
            results.push(created);
          }
        }
        
        return results;
      } catch (error) {
        throw new Error(`Error creating multiple working hours: ${error.message}`);
      }
    } 
    // Tekil DTO işlemi
    else {
      try {
        const existingHours = await this.prisma.mechanic_working_hours.findFirst({
          where: {
            mechanic_id: dto.mechanic_id,
            day_of_week: dto.day_of_week,
          },
        });
  
        if (existingHours) {
          return await this.prisma.mechanic_working_hours.update({
            where: { id: existingHours.id },
            data: {
              start_time: dto.start_time,
              end_time: dto.end_time,
              slot_duration: dto.slot_duration,
              is_day_off: dto.is_day_off || false,
            },
          });
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

  async update(id: string, dto: MechanicWorkingHoursDto) {
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

  async createOrUpdateBulk(mechanicId: string, dtoList: MechanicWorkingHoursDto[]) {
    // Boş dizi kontrolü
    if (!dtoList || dtoList.length === 0) {
      throw new BadRequestException('En az bir çalışma saati kaydı belirtilmelidir.');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const results: mechanic_working_hours[] = [];
        
        const existingHours = await tx.mechanic_working_hours.findMany({
          where: {
            mechanic_id: mechanicId,
          },
        });
        
        for (const dto of dtoList) {
          dto.mechanic_id = mechanicId;
          
          const existing = existingHours.find(hour => hour.day_of_week === dto.day_of_week);
          
          if (existing) {
            const result = await tx.mechanic_working_hours.update({
              where: { id: existing.id },
              data: {
                start_time: dto.start_time,
                end_time: dto.end_time,
                slot_duration: dto.slot_duration,
                is_day_off: dto.is_day_off || false,
              },
            });
            results.push(result);
          } else {
            const created = await tx.mechanic_working_hours.create({
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
            results.push(created);
          }
        }
        
        return results;
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Çalışma saatlerini güncellerken hata: ${error.message}`);
    }
  }
}
