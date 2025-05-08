import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CampaignNotificationService } from './services/campaign-notification.service';
import { MaintenanceReminderNotificationService } from './services/maintenance-reminder-notification.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly campaignNotificationService: CampaignNotificationService,
    private readonly maintenanceReminderService: MaintenanceReminderNotificationService
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

  async getUserNotifications(userId: string) {
    return this.prisma.notifications.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // Bildirimleri toplu olarak okundu işaretleme
  async markNotificationsAsRead(userId: string, notificationIds: string[]) {
    this.logger.log(`Toplu bildirim okundu işaretleme: ${notificationIds.length} bildirim`);
    
    const result = await this.prisma.notifications.updateMany({
      where: {
        id: { in: notificationIds },
        user_id: userId, // Güvenlik kontrolü - sadece kendi bildirimleri
      },
      data: {
        is_read: true,
      },
    });
    
    return {
      success: true,
      count: result.count,
      message: `${result.count} bildirim okundu olarak işaretlendi`,
    };
  }

  // Bildirimleri toplu olarak silme
  async deleteNotifications(userId: string, notificationIds: string[]) {
    this.logger.log(`Toplu bildirim silme: ${notificationIds.length} bildirim`);
    
    const result = await this.prisma.notifications.deleteMany({
      where: {
        id: { in: notificationIds },
        user_id: userId, // Güvenlik kontrolü - sadece kendi bildirimleri
      },
    });
    
    return {
      success: true,
      count: result.count,
      message: `${result.count} bildirim silindi`,
    };
  }

  // Tek bir bildirimi okundu olarak işaretleme
  async markNotificationAsRead(userId: string, notificationId: string) {
    const result = await this.prisma.notifications.updateMany({
      where: {
        id: notificationId,
        user_id: userId, // Güvenlik kontrolü
      },
      data: {
        is_read: true,
      },
    });
    
    return {
      success: result.count > 0,
      message: result.count > 0 
        ? 'Bildirim okundu olarak işaretlendi'
        : 'Bildirim bulunamadı veya erişim izniniz yok',
    };
  }

  // Tüm bildirimleri okundu olarak işaretleme
  async markAllNotificationsAsRead(userId: string) {
    this.logger.log(`Kullanıcının tüm bildirimleri okundu işaretleniyor: ${userId}`);
    
    const result = await this.prisma.notifications.updateMany({
      where: {
        user_id: userId,
        is_read: false
      },
      data: {
        is_read: true,
      },
    });
    
    return {
      success: true,
      count: result.count,
      message: `${result.count} bildirim okundu olarak işaretlendi`,
    };
  }

  // Tüm bildirimleri silme
  async deleteAllNotifications(userId: string) {
    this.logger.log(`Kullanıcının tüm bildirimleri siliniyor: ${userId}`);
    
    const result = await this.prisma.notifications.deleteMany({
      where: {
        user_id: userId
      },
    });
    
    return {
      success: true,
      count: result.count,
      message: `${result.count} bildirim silindi`,
    };
  }

  async sendCampaignNotifications(
    mechanicId: string, 
    campaignId: string, 
    campaignTitle: string,
    brandIds: string[],
  ) {
    return this.campaignNotificationService.sendCampaignNotifications(
      mechanicId,
      campaignId,
      campaignTitle,
      brandIds
    );
  }
  
  async checkUpcomingMaintenances() {
    return this.maintenanceReminderService.checkUpcomingMaintenances();
  }
  
  // Bu metot artık controller'dan çağrılmayacak, bu yüzden sadece internal olarak kullanılabilir
  // Genellikle test amaçlı veya özel durumlarda manuel tetikleme için tutulabilir
  async sendMaintenanceReminder(userId: string, vehicleId: string) {
    this.logger.log(`[DEPRECATED] Manuel bakım hatırlatıcısı çağrıldı: ${userId}, ${vehicleId}`);
    this.logger.warn('Bu metot artık kullanımdan kaldırılmıştır. Bakım hatırlatıcıları otomatik olarak zamanlanmış görevle kontrol edilmektedir.');
    return { 
      success: false, 
      message: 'Bu fonksiyon artık kullanılmıyor. Bakım hatırlatıcıları günlük olarak otomatik kontrol edilmektedir.' 
    };
  }

  async notifyMaintenanceRecordCreated(userId: string, vehicleId: string, mechanicName: string, details: string) {
    this.logger.log(`Bakım kaydı bildirimi gönderiliyor. Kullanıcı: ${userId}, Araç: ${vehicleId}`);
    
    try {
      // Araç bilgilerini al
      const vehicle = await this.prisma.customer_vehicles.findUnique({
        where: { id: vehicleId },
        include: {
          brands: true,
          models: true
        }
      });
      
      if (!vehicle) {
        return { success: false, message: 'Araç bulunamadı' };
      }
      
      const message = `${mechanicName} tarafından ${vehicle.brands.name} ${vehicle.models.name} aracınız için yeni bir bakım kaydı oluşturuldu: "${details}"`;
      
      // Veritabanına bildirim oluştur
      await this.createNotification({
        userId,
        message,
        type: 'maintenance_record_created',
      });
      
      // FCM tokenları al ve push bildirimi gönder
      const userSessions = await this.prisma.user_sessions.findMany({
        where: {
          user_id: userId,
          fcm_token: { not: null }
        }
      });
      
      const fcmTokens = userSessions
        .filter(session => session.fcm_token)
        .map(session => session.fcm_token);
      
      if (fcmTokens.length > 0) {
        // FcmService'e doğrudan erişim yok, bu yüzden maintenanceReminderService üzerinden kullanıyoruz
        await this.maintenanceReminderService.sendMaintenanceNotification(
          userId,
          `Yeni Bakım Kaydı`,
          message,
          {
            vehicleId,
            type: 'maintenance_record_created'
          }
        );
      }
      
      return { success: true, message: 'Bakım kaydı bildirimi gönderildi' };
    } catch (error) {
      this.logger.error(`Bakım kaydı bildirimi gönderilirken hata: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  // Tek bir bildirimi silme
  async deleteNotification(userId: string, notificationId: string) {
    this.logger.log(`Tek bildirim silme: ${notificationId}`);
    
    const result = await this.prisma.notifications.deleteMany({
      where: {
        id: notificationId,
        user_id: userId, // Güvenlik kontrolü - sadece kendi bildirimi
      },
    });
    
    return {
      success: result.count > 0,
      message: result.count > 0 
        ? 'Bildirim silindi' 
        : 'Bildirim bulunamadı veya erişim izniniz yok',
    };
  }
}
