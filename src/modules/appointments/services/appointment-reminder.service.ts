import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentNotificationService } from '../../notifications/services/appointment-notification.service';

@Injectable()
export class AppointmentReminderService {
  private readonly logger = new Logger(AppointmentReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly appointmentNotificationService: AppointmentNotificationService,
  ) {}

  // Her gün sabah 9'da çalışacak
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendAppointmentReminders() {
    this.logger.log('Randevu hatırlatma bildirimleri gönderiliyor...');

    try {
      // Yarınki tarihi hesapla (yerel saat diliminde)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
      
      // Yarın gerçekleşecek ve onaylanmış randevuları bul
      const upcomingAppointments = await this.prisma.appointments.findMany({
        where: {
          appointment_date: {
            gte: tomorrow,
            lt: dayAfterTomorrow,
          },
          status: 'confirmed', // Sadece onaylanmış randevular için
        },
        include: {
          customers: {
            include: {
              users: true,
            },
          },
          mechanics: {
            include: {
              users: true,
            },
          },
        },
      });

      this.logger.log(`${upcomingAppointments.length} adet yaklaşan randevu bulundu.`);

      // Her randevu için bildirim gönder
      for (const appointment of upcomingAppointments) {
        try {
          await this.appointmentNotificationService.notifyCustomerAboutUpcomingAppointment(appointment);
          this.logger.log(`Randevu hatırlatması gönderildi: Randevu ID ${appointment.id}`);
        } catch (error) {
          this.logger.error(
            `Randevu hatırlatması gönderilirken hata: ${error.message}`,
            error.stack,
          );
        }
      }

      return { success: true, count: upcomingAppointments.length };
    } catch (error) {
      this.logger.error(
        `Randevu hatırlatmaları işlenirken hata: ${error.message}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }
}
