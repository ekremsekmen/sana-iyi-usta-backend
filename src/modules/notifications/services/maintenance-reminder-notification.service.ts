import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { FcmService } from './fcm.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { addDays, isBefore, subDays } from 'date-fns';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MaintenanceReminderNotificationService {
  private readonly logger = new Logger(MaintenanceReminderNotificationService.name);
  
  // Bildirimlerin tekrarlanmasını önlemek için kullanıcı-araç bazında son gönderilen bildirimleri takip eder
  private sentReminders = new Map<string, Date>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmService: FcmService,
  ) {}

  /**
   * Veritabanında bildirim oluşturur
   */
  private async createNotification(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notifications.create({
      data: {
        user_id: createNotificationDto.userId,
        message: createNotificationDto.message,
        type: createNotificationDto.type,
      },
    });
  }

  /**
   * Yaklaşan bakımları kontrol edip, gerekirse bildirim gönderir
   * Her gün sabah 10:00'da otomatik olarak çalışır
   */
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async checkUpcomingMaintenances() {
    this.logger.log('Zamanlanmış görev: Yaklaşan bakımlar kontrol ediliyor...');
    try {
      const today = new Date();
      const oneWeekFromToday = addDays(today, 7);
      
      this.logger.log(`Yaklaşan bakımlar kontrol ediliyor. Tarih aralığı: ${today.toISOString()} - ${oneWeekFromToday.toISOString()}`);
      
      // Bir hafta içinde bakımı gelecek araçları bul
      const maintenanceRecords = await this.prisma.vehicle_maintenance_records.findMany({
        where: {
          next_due_date: {
            gte: today,
            lte: oneWeekFromToday
          }
        },
        include: {
          customer_vehicles: {
            include: {
              customers: {
                include: {
                  users: {
                    include: {
                      user_sessions: true
                    }
                  }
                }
              },
              brands: true,
              models: true
            }
          },
          mechanics: true
        },
        orderBy: {
          next_due_date: 'asc'
        }
      });
      
      this.logger.log(`${maintenanceRecords.length} adet yaklaşan bakım kaydı bulundu.`);
      
      for (const record of maintenanceRecords) {
        // Araç bilgilerini al
        const vehicle = record.customer_vehicles;
        const user = vehicle.customers.users;
        const vehicleKey = `${user.id}-${vehicle.id}`;
        
        // Daha yakın tarihli başka bir randevu var mı kontrol et
        const hasNewerAppointment = await this.checkForNewerMaintenanceDate(vehicle.id, record.next_due_date);
        if (hasNewerAppointment) {
          this.logger.log(`${vehicleKey} için daha güncel bakım kaydı mevcut. Bildirim atlanıyor.`);
          continue;
        }
        
        // Daha önce bildirim gönderildi mi kontrol et
        const lastSent = this.sentReminders.get(vehicleKey);
        if (lastSent) {
          // 30 günden kısa süre önce bildirim gönderildiyse atlama yap
          const thirtyDaysAgo = subDays(today, 30);
          if (isBefore(thirtyDaysAgo, lastSent)) {
            this.logger.log(`${vehicleKey} için son 30 gün içinde bildirim gönderildi. Tekrar gönderilmiyor.`);
            continue;
          }
        }
        
        // Bildirim mesajı oluştur
        const brandName = vehicle.brands.name;
        const modelName = vehicle.models.name;
        const formattedDate = record.next_due_date.toLocaleDateString('tr-TR');
        const mechanicName = record.mechanics.business_name;
        
        const message = `${brandName} ${modelName} aracınızın bakım zamanı yaklaşıyor. ${formattedDate} tarihinde ${mechanicName} tarafından yapılan bakımın üzerinden neredeyse bir yıl geçti. Yeni bir bakım randevusu almanızı öneririz.`;
        
        // Veritabanında bildirim oluştur
        await this.createNotification({
          userId: user.id,
          message,
          type: 'maintenance_reminder',
        });
        
        // FCM tokenları al ve push bildirimi gönder
        const fcmTokens = user.user_sessions
          .filter(session => session.fcm_token)
          .map(session => session.fcm_token);
        
        if (fcmTokens.length > 0) {
          await this.fcmService.sendMulticastNotification(
            fcmTokens,
            'Bakım Hatırlatması',
            message,
            {
              vehicleId: vehicle.id,
              recordId: record.id,
              type: 'maintenance_reminder'
            }
          );
        }
        
        // Gönderilen bildirimi kaydet
        this.sentReminders.set(vehicleKey, new Date());
        this.logger.log(`${vehicleKey} için bakım hatırlatması gönderildi.`);
      }
      
      return { success: true, processed: maintenanceRecords.length };
    } catch (error) {
      this.logger.error(`Bakım kontrol hatası: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Belirli bir araç için daha yeni tarihli bir bakım kaydı olup olmadığını kontrol eder
   * @param vehicleId Araç ID'si
   * @param currentDueDate Mevcut bakım tarihi
   * @returns Daha yeni bir bakım kaydı varsa true, yoksa false
   */
  private async checkForNewerMaintenanceDate(vehicleId: string, currentDueDate: Date): Promise<boolean> {
    const newerRecord = await this.prisma.vehicle_maintenance_records.findFirst({
      where: {
        vehicle_id: vehicleId,
        next_due_date: {
          gt: currentDueDate
        }
      },
      orderBy: {
        next_due_date: 'asc'
      }
    });
    
    return !!newerRecord;
  }
  
  /**
   * FcmService üzerinden bildirim gönderen yardımcı metot
   * @param userId Kullanıcı ID'si
   * @param title Bildirim başlığı
   * @param message Bildirim mesajı
   * @param data Ek veriler
   */
  async sendMaintenanceNotification(userId: string, title: string, message: string, data?: Record<string, string>) {
    try {
      // FCM tokenları al
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
        await this.fcmService.sendMulticastNotification(
          fcmTokens,
          title,
          message,
          data
        );
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Bildirim gönderilirken hata: ${error.message}`, error.stack);
      return false;
    }
  }
}
