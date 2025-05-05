import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { GetAvailableSlotsDto } from '../dto/get-available-slots.dto';

@Injectable()
export class SlotService {
  constructor(private prisma: PrismaService) {}

  async getAvailableSlots(dto: GetAvailableSlotsDto) {
    const date = new Date(dto.date);
    const dayOfWeek = date.getDay(); // 0: Pazar, 1: Pazartesi, ...

    const workingHours = await this.prisma.mechanic_working_hours.findUnique({
      where: {
        mechanic_id_day_of_week: {
          mechanic_id: dto.mechanic_id,
          day_of_week: dayOfWeek,
        },
      },
    });

    if (!workingHours || workingHours.is_day_off) {
      return [];
    }

    const [startHour, startMinute] = workingHours.start_time.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end_time.split(':').map(Number);
    
    // Tarih kısmını alıp saat bilgilerini sıfırla
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    const timezoneOffset = date.getTimezoneOffset() * 60000; // dakikayı milisaniyeye çevir
    
    const startDateTime = new Date(dateOnly.getTime() + (startHour * 3600000 + startMinute * 60000) - timezoneOffset);
    
    const endDateTime = new Date(dateOnly.getTime() + (endHour * 3600000 + endMinute * 60000) - timezoneOffset);
    
    const slotDuration = workingHours.slot_duration; // dakika cinsinden
    
    const slots = [];
    let currentSlotStart = new Date(startDateTime);
    
    while (currentSlotStart.getTime() + slotDuration * 60 * 1000 <= endDateTime.getTime()) {
      const slotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60 * 1000);
      
      slots.push({
        start_time: new Date(currentSlotStart),
        end_time: slotEnd,
        available: true,
      });
      
      currentSlotStart = slotEnd;
    }
    
    const existingAppointments = await this.prisma.appointments.findMany({
      where: {
        mechanic_id: dto.mechanic_id,
        start_time: {
          gte: startDateTime,
        },
        end_time: {
          lte: endDateTime,
        },
      },
    });
    
    existingAppointments.forEach(appointment => {
      for (const slot of slots) {
        if (
          (slot.start_time <= appointment.start_time && slot.end_time > appointment.start_time) ||
          (slot.start_time >= appointment.start_time && slot.start_time < appointment.end_time)
        ) {
          slot.available = false;
        }
      }
    });
    
    return slots;
  }

  async isTimeSlotAvailable(mechanicId: string, startTime: Date, endTime: Date): Promise<boolean> {
    const overlappingAppointments = await this.prisma.appointments.findFirst({
      where: {
        mechanic_id: mechanicId,
        OR: [
          {
            start_time: {
              lte: startTime,
            },
            end_time: {
              gt: startTime,
            },
          },
          {
            start_time: {
              lt: endTime,
            },
            end_time: {
              gte: endTime,
            },
          },
          {
            start_time: {
              gte: startTime,
            },
            end_time: {
              lte: endTime,
            },
          },
        ],
      },
    });
    
    return !overlappingAppointments;
  }
}
