import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { FcmService } from './fcm.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class CampaignNotificationService {
  private readonly logger = new Logger(CampaignNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmService: FcmService
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

  async sendCampaignNotifications(
    mechanicId: string, 
    campaignId: string, 
    campaignTitle: string,
    brandIds: string[],
  ) {
    // 1. Mekanik'in bulunduğu şehri bul
    const mechanic = await this.prisma.mechanics.findUnique({
      where: { id: mechanicId },
      select: {
        business_name: true,
        users: {
          include: {
            locations: true,
          },
        },
      },
    });

    if (!mechanic || !mechanic.users.locations.length) {
      return { sent: 0, message: 'Mekanik lokasyonu bulunamadı' };
    }

    const mechanicCity = mechanic.users.locations.find(loc => loc.city)?.city;
    
    if (!mechanicCity) {
      return { sent: 0, message: 'Mekanik şehir bilgisi bulunamadı' };
    }

    const eligibleCustomers = await this.prisma.customers.findMany({
      where: {
        customer_vehicles: {
          some: {
            brand_id: {
              in: brandIds,
            },
          },
        },
        users: {
          locations: {
            some: {
              city: mechanicCity,
            },
          },
        },
      },
      include: {
        users: {
          include: {
            user_sessions: true,
          },
        },
      },
    });

    const notifications = [];
    const pushTokens = [];

    // Bildirim mesajını tamircinin işyeri adıyla kişiselleştirelim
    const notificationMessage = `${mechanic.business_name}, aracınıza özel "${campaignTitle}" kampanyası başlattı!`;

    for (const customer of eligibleCustomers) {
      // Veritabanına bildirim kaydı oluştur
      const notification = await this.createNotification({
        userId: customer.user_id,
        message: notificationMessage,
        type: 'campaign',
      });
      
      notifications.push(notification);

      // FCM token'ı varsa push bildirim listesine ekle
      const fcmTokens = customer.users.user_sessions
        .filter(session => session.fcm_token)
        .map(session => session.fcm_token);
      
      pushTokens.push(...fcmTokens);
    }

    let fcmResult = { success: 0, failure: 0 };
    
    if (pushTokens.length > 0) {
      try {
        fcmResult = await this.fcmService.sendMulticastNotification(
          pushTokens,
          'Yeni Kampanya',
          notificationMessage,
          {
            campaignId: campaignId,
            mechanicId: mechanicId,
            type: 'campaign'
          }
        );
      } catch (error) {
        this.logger.error(`FCM bildirimi gönderilirken hata: ${error.message}`, error.stack);
      }
    }

    return {
      sent: notifications.length,
      fcmTokens: pushTokens.length,
      fcmSuccess: fcmResult.success,
      fcmFailure: fcmResult.failure,
      message: `${notifications.length} müşteriye bildirim oluşturuldu, ${fcmResult.success} push bildirim başarıyla gönderildi`,
    };
  }
}
