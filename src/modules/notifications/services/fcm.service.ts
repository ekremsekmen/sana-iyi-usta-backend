import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { messaging } from 'firebase-admin';
import { MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  
  onModuleInit() {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        });
      }
      this.logger.log('Firebase başarıyla başlatıldı');
    } catch (error) {
      this.logger.error(`Firebase başlatılamadı: ${error.message}`, error.stack);
    }
  }

  /**
   * Birden fazla cihaza bildirim gönderir
   * @param tokens FCM token'ları
   * @param title Bildirim başlığı
   * @param body Bildirim metni
   * @param data Ek veri
   * @returns Gönderim sonucu
   */
  async sendMulticastNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>
  ) {
    if (!tokens || tokens.length === 0) {
      this.logger.warn('Gönderilecek token bulunamadı');
      return { success: 0, failure: 0 };
    }

    try {
      const message: MulticastMessage = {
        tokens,
        notification: {
          title,
          body,
        },
        data,
        android: {
          priority: 'high',
          notification: {
            channelId: 'default-channel',
          },
        },
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
              badge: 1,
              sound: 'default',
            },
          },
        }
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      
      this.logger.log(`${response.successCount} bildirim başarıyla gönderildi.`);
      
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push({ token: tokens[idx], error: resp.error });
            this.logger.error(`Token ${tokens[idx]} için bildirim gönderilemedi: ${resp.error.message}`);
          }
        });
      }

      return {
        success: response.successCount,
        failure: response.failureCount
      };
    } catch (error) {
      this.logger.error(`Bildirim gönderilirken hata oluştu: ${error.message}`, error.stack);
      return { success: 0, failure: tokens.length, error: error.message };
    }
  }
}
