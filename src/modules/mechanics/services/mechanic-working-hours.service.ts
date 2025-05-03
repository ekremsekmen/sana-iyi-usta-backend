import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
    if (Array.isArray(dto)) {
      if (dto.length === 0) {
        return []; 
      }
      
      const mechanicId = dto[0].mechanic_id;
      const hasInconsistentMechanicId = dto.some(item => item.mechanic_id !== mechanicId);
      
      if (hasInconsistentMechanicId) {
        throw new BadRequestException('Tüm çalışma saati kayıtları aynı tamirciye ait olmalıdır.');
      }
      
      try {
        // Prisma transaction kullanarak tüm işlemleri atomik olarak gerçekleştir
        return await this.prisma.$transaction(async (tx) => {
          const results = await Promise.all(
            dto.map(item => 
              tx.mechanic_working_hours.upsert({ // tx kullanıldı
                where: {
                  mechanic_id_day_of_week: {
                    mechanic_id: item.mechanic_id,
                    day_of_week: item.day_of_week,
                  },
                },
                update: {
                  start_time: item.start_time,
                  end_time: item.end_time,
                  slot_duration: item.slot_duration,
                  is_day_off: item.is_day_off ?? false, // ?? operatörü kullanıldı
                },
                create: {
                  id: randomUUID(),
                  mechanic_id: item.mechanic_id,
                  day_of_week: item.day_of_week,
                  start_time: item.start_time,
                  end_time: item.end_time,
                  slot_duration: item.slot_duration,
                  is_day_off: item.is_day_off ?? false, // ?? operatörü kullanıldı
                },
              })
            )
          );
          return results;
        });
      } catch (error) {
        // Hata yönetimi: Genel hata yerine InternalServerErrorException kullanıldı
        console.error(`Toplu çalışma saati oluşturulurken hata: ${error.message}`, error.stack); // Orijinal hatayı loglama
        throw new InternalServerErrorException('Toplu çalışma saatleri oluşturulurken bir sunucu hatası oluştu.');
      }
    } 
    // Tekil DTO işlemi
    else {
      try {
        // Upsert işlemi ile varsa güncelle, yoksa oluştur
        return await this.prisma.mechanic_working_hours.upsert({
          where: {
            mechanic_id_day_of_week: {
              mechanic_id: dto.mechanic_id,
              day_of_week: dto.day_of_week,
            },
          },
          update: {
            start_time: dto.start_time,
            end_time: dto.end_time,
            slot_duration: dto.slot_duration,
            is_day_off: dto.is_day_off ?? false, // ?? operatörü kullanıldı
          },
          create: {
            id: randomUUID(),
            mechanic_id: dto.mechanic_id,
            day_of_week: dto.day_of_week,
            start_time: dto.start_time,
            end_time: dto.end_time,
            slot_duration: dto.slot_duration,
            is_day_off: dto.is_day_off ?? false, // ?? operatörü kullanıldı
          },
        });
      } catch (error) {
         // Hata yönetimi: Genel hata yerine InternalServerErrorException kullanıldı
        console.error(`Çalışma saati oluşturulurken hata: ${error.message}`, error.stack); // Orijinal hatayı loglama
        throw new InternalServerErrorException('Çalışma saati oluşturulurken bir sunucu hatası oluştu.');
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

  async update(id: string, dto: Partial<MechanicWorkingHoursDto>) {
    try {
      const updateData: any = {};
      
      // Only include fields that were provided in the update
      if (dto.start_time !== undefined) updateData.start_time = dto.start_time;
      if (dto.end_time !== undefined) updateData.end_time = dto.end_time;
      if (dto.slot_duration !== undefined) updateData.slot_duration = dto.slot_duration;
      if (dto.is_day_off !== undefined) updateData.is_day_off = dto.is_day_off;
      if (dto.day_of_week !== undefined) updateData.day_of_week = dto.day_of_week;
      
      return await this.prisma.mechanic_working_hours.update({
        where: { id },
        data: updateData,
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
        
        for (const dto of dtoList) {
          dto.mechanic_id = mechanicId;
          
          // Upsert işlemi ile varsa güncelle, yoksa oluştur
          const result = await tx.mechanic_working_hours.upsert({
            where: {
              mechanic_id_day_of_week: {
                mechanic_id: mechanicId,
                day_of_week: dto.day_of_week,
              },
            },
            update: {
              start_time: dto.start_time,
              end_time: dto.end_time,
              slot_duration: dto.slot_duration,
              is_day_off: dto.is_day_off ?? false, // ?? operatörü kullanıldı
            },
            create: {
              id: randomUUID(),
              mechanic_id: mechanicId,
              day_of_week: dto.day_of_week,
              start_time: dto.start_time,
              end_time: dto.end_time,
              slot_duration: dto.slot_duration,
              is_day_off: dto.is_day_off ?? false, // ?? operatörü kullanıldı
            },
          });
          
          results.push(result);
        }
        
        return results;
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Hata yönetimi: Genel hata yerine InternalServerErrorException kullanıldı
      console.error(`Çalışma saatlerini güncellerken hata: ${error.message}`, error.stack); // Orijinal hatayı loglama
      throw new InternalServerErrorException('Çalışma saatleri güncellenirken bir sunucu hatası oluştu.');
    }
  }
}
