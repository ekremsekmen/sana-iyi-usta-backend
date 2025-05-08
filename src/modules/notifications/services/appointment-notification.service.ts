import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { FcmService } from './fcm.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class AppointmentNotificationService {
  private readonly logger = new Logger(AppointmentNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmService: FcmService,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notifications.create({
      data: {
        user_id: createNotificationDto.userId,
        message: createNotificationDto.message,
        type: createNotificationDto.type,
      },
    });
  }

  private async sendPushNotification(userId: string, title: string, message: string, data?: Record<string, string>) {
    try {
      // Kullanıcının FCM token'larını al
      const userSessions = await this.prisma.user_sessions.findMany({
        where: {
          user_id: userId,
          fcm_token: { not: null },
        },
      });

      const fcmTokens = userSessions
        .filter(session => session.fcm_token)
        .map(session => session.fcm_token);

      if (fcmTokens.length > 0) {
        await this.fcmService.sendMulticastNotification(fcmTokens, title, message, data);
      }
    } catch (error) {
      this.logger.error(`Push bildirim gönderilemedi: ${error.message}`, error.stack);
    }
  }

  async notifyMechanicAboutNewAppointment(appointment) {
    try {
      // Mekanik ve müşteri bilgilerini al
      const mechanic = await this.prisma.mechanics.findUnique({
        where: { id: appointment.mechanic_id },
        include: { users: true },
      });

      const customer = await this.prisma.customers.findUnique({
        where: { id: appointment.customer_id },
        include: { users: true },
      });

      if (!mechanic || !customer) {
        return { success: false, message: 'Mekanik veya müşteri bulunamadı' };
      }

      const appointmentDate = new Date(appointment.appointment_date);
      const formattedDate = appointmentDate.toLocaleDateString('tr-TR');
      const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      const message = `${customer.users.full_name} adlı müşteri ${formattedDate} tarihinde ${formattedTime} saatinde randevu aldı.`;

      // Veritabanına bildirim oluştur
      await this.createNotification({
        userId: mechanic.user_id,
        message,
        type: 'appointment_created',
      });

      // Push bildirim gönder
      await this.sendPushNotification(
        mechanic.user_id,
        'Yeni Randevu',
        message,
        {
          appointmentId: appointment.id,
          type: 'appointment_created'
        }
      );

      return { success: true, message: 'Bildirim başarıyla gönderildi' };
    } catch (error) {
      this.logger.error(`Yeni randevu bildirimi gönderilirken hata: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  async notifyCustomerAboutUpcomingAppointment(appointment) {
    try {
      const customer = await this.prisma.customers.findUnique({
        where: { id: appointment.customer_id },
        include: { users: true },
      });

      const mechanic = await this.prisma.mechanics.findUnique({
        where: { id: appointment.mechanic_id },
        include: { users: true },
      });

      if (!customer || !mechanic) {
        return { success: false, message: 'Müşteri veya mekanik bulunamadı' };
      }

      const appointmentDate = new Date(appointment.appointment_date);
      const formattedDate = appointmentDate.toLocaleDateString('tr-TR');
      const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      const message = `${mechanic.business_name} ile yarın (${formattedDate}) saat ${formattedTime}'de randevunuz var.`;

      // Veritabanına bildirim oluştur
      await this.createNotification({
        userId: customer.user_id,
        message,
        type: 'appointment_reminder',
      });

      // Push bildirim gönder
      await this.sendPushNotification(
        customer.user_id,
        'Randevu Hatırlatması',
        message,
        {
          appointmentId: appointment.id,
          type: 'appointment_reminder'
        }
      );

      return { success: true, message: 'Hatırlatma bildirimi gönderildi' };
    } catch (error) {
      this.logger.error(`Randevu hatırlatma bildirimi gönderilirken hata: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  async notifyMechanicAboutCancelledAppointment(appointment) {
    try {
      const mechanic = await this.prisma.mechanics.findUnique({
        where: { id: appointment.mechanic_id },
        include: { users: true },
      });

      const customer = await this.prisma.customers.findUnique({
        where: { id: appointment.customer_id },
        include: { users: true },
      });

      if (!mechanic || !customer) {
        return { success: false, message: 'Mekanik veya müşteri bulunamadı' };
      }

      const appointmentDate = new Date(appointment.appointment_date);
      const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      const message = `${customer.users.full_name} adlı müşteri ${formattedTime} saatindeki randevuyu iptal etti.`;

      // Veritabanına bildirim oluştur
      await this.createNotification({
        userId: mechanic.user_id,
        message,
        type: 'appointment_canceled',
      });

      // Push bildirim gönder
      await this.sendPushNotification(
        mechanic.user_id,
        'Randevu İptali',
        message,
        {
          appointmentId: appointment.id,
          type: 'appointment_canceled'
        }
      );

      return { success: true, message: 'İptal bildirimi gönderildi' };
    } catch (error) {
      this.logger.error(`Randevu iptal bildirimi gönderilirken hata: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  async notifyCustomerAboutAppointmentStatusChange(appointment, statusAction: string) {
    try {
      const customer = await this.prisma.customers.findUnique({
        where: { id: appointment.customer_id },
        include: { users: true },
      });

      const mechanic = await this.prisma.mechanics.findUnique({
        where: { id: appointment.mechanic_id },
        include: { users: true },
      });

      if (!customer || !mechanic) {
        return { success: false, message: 'Müşteri veya mekanik bulunamadı' };
      }

      const appointmentDate = new Date(appointment.appointment_date);
      const formattedDate = appointmentDate.toLocaleDateString('tr-TR');
      const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      let message = '';
      let title = '';
      
      switch (statusAction) {
        case 'confirmed':
          title = 'Randevu Onaylandı';
          message = `${mechanic.business_name} ${formattedDate} tarihindeki ${formattedTime} randevunuzu onayladı.`;
          break;
        case 'completed':
          title = 'Randevu Tamamlandı';
          message = `${mechanic.business_name} ${formattedDate} tarihindeki randevunuzu tamamladı.`;
          break;
        case 'canceled':
          title = 'Randevu İptal Edildi';
          message = `${mechanic.business_name} ${formattedDate} tarihindeki ${formattedTime} randevunuzu iptal etti.`;
          break;
        default:
          title = 'Randevu Durumu Değişti';
          message = `${mechanic.business_name} tarafından randevu durumunuz güncellendi.`;
      }

      // Veritabanına bildirim oluştur
      await this.createNotification({
        userId: customer.user_id,
        message,
        type: 'appointment_status_updated',
      });

      // Push bildirim gönder
      await this.sendPushNotification(
        customer.user_id,
        title,
        message,
        {
          appointmentId: appointment.id,
          type: 'appointment_status_updated',
          status: statusAction
        }
      );

      return { success: true, message: 'Durum değişikliği bildirimi gönderildi' };
    } catch (error) {
      this.logger.error(`Randevu durum bildirimi gönderilirken hata: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }
}
