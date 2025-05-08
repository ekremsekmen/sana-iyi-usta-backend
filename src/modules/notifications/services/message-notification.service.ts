import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { FcmService } from './fcm.service';

@Injectable()
export class MessageNotificationService {
  private readonly logger = new Logger(MessageNotificationService.name);
  
  // Son bildirim zamanlarını takip etmek için map (userId -> { otherUserId -> timestamp })
  private lastNotificationTimes = new Map<string, Map<string, number>>();
  
  // Bildirimler arasında geçmesi gereken minimum süre (5 dakika)
  private readonly notificationCooldown = 5 * 60 * 1000; // 5 dakika (milisaniye)

  constructor(
    private prisma: PrismaService,
    private fcmService: FcmService
  ) {}

  // Kullanıcıya push bildirimini gönder (eğer yakın zamanda bildirim gönderilmediyse)
  async sendChatNotificationIfNeeded(senderId: string, receiverId: string): Promise<void> {
    try {
      const now = Date.now();
      
      // Alıcı için son bildirim zamanını kontrol et
      const userLastNotifications = this.lastNotificationTimes.get(receiverId) || new Map<string, number>();
      const lastNotificationTime = userLastNotifications.get(senderId) || 0;
      
      // Son bildirimden bu yana yeterli süre geçmişse bildirim gönder
      if (now - lastNotificationTime > this.notificationCooldown) {
        // Gönderici bilgilerini al
        const sender = await this.prisma.users.findUnique({
          where: { id: senderId },
          select: { full_name: true }
        });
        
        // Alıcının FCM tokenlarını al
        const receiverTokens = await this.prisma.user_sessions.findMany({
          where: { 
            user_id: receiverId,
            fcm_token: { not: null }
          },
          select: { fcm_token: true }
        });
        
        const tokens = receiverTokens
          .map(session => session.fcm_token)
          .filter(token => token !== null && token.length > 0);
        
        if (tokens.length > 0 && sender) {
          await this.fcmService.sendMulticastNotification(
            tokens,
            'Yeni Mesaj',
            `${sender.full_name} size mesaj gönderdi`,
            {
              senderId: senderId,
              type: 'message',
              notificationType: 'chat'
            }
          );
          
          // Son bildirim zamanını güncelle
          userLastNotifications.set(senderId, now);
          this.lastNotificationTimes.set(receiverId, userLastNotifications);
        }
      }
    } catch (error) {
      this.logger.error('Mesaj bildirimi gönderme hatası:', error);
    }
  }
}
