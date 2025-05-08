import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { FcmService } from './fcm.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class ReviewNotificationService {
  private readonly logger = new Logger(ReviewNotificationService.name);

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

  async notifyMechanicAboutNewReview(review, appointment, customerName) {
    try {
      const mechanic = await this.prisma.mechanics.findUnique({
        where: { id: review.mechanic_id },
        include: { users: true },
      });

      if (!mechanic) {
        return { success: false, message: 'Mekanik bulunamadı' };
      }

      const appointmentDate = new Date(appointment.appointment_date);
      const formattedDate = appointmentDate.toLocaleDateString('tr-TR');
      const formattedTime = appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      
      const starRating = '⭐'.repeat(review.rating);
      const message = `${customerName} tarafından ${formattedDate} tarihindeki ${formattedTime} saatindeki randevunuz için ${starRating} değerlendirme yapıldı.`;
      
      // Veritabanına bildirim oluştur
      await this.createNotification({
        userId: mechanic.user_id,
        message,
        type: 'new_review',
      });
      
      // Push bildirim gönder
      await this.sendPushNotification(
        mechanic.user_id,
        'Yeni Değerlendirme',
        message,
        {
          reviewId: review.id,
          appointmentId: appointment.id,
          rating: review.rating.toString(),
          type: 'new_review'
        }
      );
      
      return { success: true, message: 'Değerlendirme bildirimi gönderildi' };
    } catch (error) {
      this.logger.error(`Değerlendirme bildirimi gönderilirken hata: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }
}
