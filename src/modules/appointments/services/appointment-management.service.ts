import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { AppointmentType } from '@prisma/client';
import { SlotService } from './slot.service';
import { AppointmentNotificationService } from '../../notifications/services/appointment-notification.service';

@Injectable()
export class AppointmentManagementService {
  private readonly logger = new Logger(AppointmentManagementService.name);
  
  constructor(
    private prisma: PrismaService,
    private slotService: SlotService,
    private appointmentNotificationService: AppointmentNotificationService
  ) {}

  async createAppointment(customerId: string, dto: CreateAppointmentDto) {
    const mechanic = await this.prisma.mechanics.findUnique({
      where: { id: dto.mechanic_id },
    });
    
    if (!mechanic) {
      throw new NotFoundException('Mekanik bulunamadı');
    }

    const vehicle = await this.prisma.customer_vehicles.findFirst({
      where: { 
        id: dto.vehicle_id,
        customer_id: customerId 
      },
    });
    
    if (!vehicle) {
      throw new NotFoundException('Araç bulunamadı veya size ait değil');
    }

    const isSlotAvailable = await this.slotService.isTimeSlotAvailable(
      dto.mechanic_id,
      new Date(dto.start_time),
      new Date(dto.end_time)
    );
    
    if (!isSlotAvailable) {
      throw new ConflictException('Seçilen zaman aralığı dolu');
    }

    let locationId = null;
    
    if (dto.appointment_type === AppointmentType.AT_SERVICE) {
      // Mekanik için users tablosundan default_location_id'yi al
      const mechanicUser = await this.prisma.users.findUnique({
        where: { id: mechanic.user_id },
      });
      locationId = mechanicUser?.default_location_id;
    } else if (dto.appointment_type === AppointmentType.ON_SITE) {
      // Müşteri için users tablosundan default_location_id'yi al
      const customer = await this.prisma.customers.findUnique({
        where: { id: customerId },
        include: { users: true },
      });
      
      if (customer?.users?.default_location_id) {
        locationId = customer.users.default_location_id;
      }
    }

    // Randevuyu oluştur
    const newAppointment = await this.prisma.appointments.create({
      data: {
        mechanic_id: dto.mechanic_id,
        customer_id: customerId,
        vehicle_id: dto.vehicle_id,
        appointment_date: new Date(dto.start_time),
        start_time: new Date(dto.start_time),
        end_time: new Date(dto.end_time),
        status: 'pending',
        description: dto.description,
        appointment_type: dto.appointment_type,
        location_id: locationId,
      },
    });

    // Tamirciye yeni bir randevu bildirimi gönder
    try {
      await this.appointmentNotificationService.notifyMechanicAboutNewAppointment(newAppointment);
    } catch (error) {
      this.logger.error(`Randevu bildirimi gönderilirken hata: ${error.message}`, error.stack);
    }

    return newAppointment;
  }

  async cancelAppointment(userId: string, appointmentId: string, userRole: string) {
    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointments.findUnique({
        where: { id: appointmentId },
        include: {
          customers: {
            include: { users: true },
          },
          mechanics: {
            include: { users: true },
          },
        },
      });
      
      if (!appointment) {
        throw new NotFoundException('Randevu bulunamadı');
      }
      
      if (
        (userRole === 'customer' && appointment.customers.users.id !== userId) ||
        (userRole === 'mechanic' && appointment.mechanics.users.id !== userId)
      ) {
        throw new BadRequestException('Bu randevuyu iptal etme yetkiniz yok');
      }
      
      const updatedAppointment = await tx.appointments.update({
        where: { id: appointmentId },
        data: {
          status: 'canceled',
        },
      });

      // Bildirim gönderme
      try {
        if (userRole === 'customer') {
          // Müşteri iptal ettiyse mekanikere bildir
          await this.appointmentNotificationService.notifyMechanicAboutCancelledAppointment(appointment);
        } else {
          // Mekanik iptal ettiyse müşteriye bildir
          await this.appointmentNotificationService.notifyCustomerAboutAppointmentStatusChange(appointment, 'canceled');
        }
      } catch (error) {
        this.logger.error(`İptal bildirimi gönderilirken hata: ${error.message}`, error.stack);
      }

      return updatedAppointment;
    });
  }

  async approveAppointment(mechanicUserId: string, appointmentId: string) {
    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointments.findUnique({
        where: { id: appointmentId },
        include: {
          mechanics: {
            include: { users: true },
          },
        },
      });
      
      if (!appointment) {
        throw new NotFoundException('Randevu bulunamadı');
      }
      
      if (appointment.mechanics.users.id !== mechanicUserId) {
        throw new BadRequestException('Bu randevuyu onaylama yetkiniz yok');
      }
      
      if (appointment.status !== 'pending') {
        throw new BadRequestException('Sadece bekleyen randevular onaylanabilir');
      }
      
      const updatedAppointment = await tx.appointments.update({
        where: { id: appointmentId },
        data: {
          status: 'confirmed',
        },
      });

      // Müşteriye onay bildirimi gönder
      try {
        await this.appointmentNotificationService.notifyCustomerAboutAppointmentStatusChange(
          appointment,
          'confirmed'
        );
      } catch (error) {
        this.logger.error(`Onay bildirimi gönderilirken hata: ${error.message}`, error.stack);
      }

      return updatedAppointment;
    });
  }

  async completeAppointment(mechanicUserId: string, appointmentId: string) {
    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointments.findUnique({
        where: { id: appointmentId },
        include: {
          mechanics: {
            include: { users: true },
          },
        },
      });
      
      if (!appointment) {
        throw new NotFoundException('Randevu bulunamadı');
      }
      
      if (appointment.mechanics.users.id !== mechanicUserId) {
        throw new BadRequestException('Bu randevuyu tamamlama yetkiniz yok');
      }
      
      if (appointment.status !== 'confirmed') {
        throw new BadRequestException('Sadece onaylanmış randevular tamamlanabilir');
      }
      
      const updatedAppointment = await tx.appointments.update({
        where: { id: appointmentId },
        data: {
          status: 'completed',
        },
      });

      // Müşteriye tamamlama bildirimi gönder
      try {
        await this.appointmentNotificationService.notifyCustomerAboutAppointmentStatusChange(
          appointment,
          'completed'
        );
      } catch (error) {
        this.logger.error(`Tamamlama bildirimi gönderilirken hata: ${error.message}`, error.stack);
      }

      return updatedAppointment;
    });
  }
}
