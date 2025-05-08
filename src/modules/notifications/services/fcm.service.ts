import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MulticastMessage } from 'firebase-admin/messaging';

// Tüm dönüş türlerini kapsayan standart bir arayüz tanımlıyoruz
export interface FcmResponse {
  success: number;
  failure: number;
  disabled: boolean;
  simulated: boolean;
  error?: string;
}

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  private isFirebaseInitialized = false;
  
  onModuleInit() {
    try {
      if (!admin.apps.length && 
          process.env.FIREBASE_PROJECT_ID && 
          process.env.FIREBASE_PRIVATE_KEY && 
          process.env.FIREBASE_CLIENT_EMAIL) {
        
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        });
        this.isFirebaseInitialized = true;
        this.logger.log('Firebase başarıyla başlatıldı');
      } else {
        this.logger.warn('Firebase yapılandırması eksik, FCM bildirimleri devre dışı bırakıldı');
      }
    } catch (error) {
      this.logger.error(`Firebase başlatılamadı: ${error.message}`, error.stack);
      this.isFirebaseInitialized = false;
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
  ): Promise<FcmResponse> {
    if (!tokens || tokens.length === 0) {
      return { 
        success: 0, 
        failure: 0, 
        disabled: true,
        simulated: false
      };
    }

    if (!this.isFirebaseInitialized) {
      this.logger.log(`FCM bildirimi simüle ediliyor - Başlık: "${title}", İçerik: "${body}"`);
      
      if (data) {
        this.logger.log(`FCM ekstra data: ${JSON.stringify(data)}`);
      }
      
      // Bildirimlerin başarıyla gönderildiğini simüle ediyoruz
      return { 
        success: tokens.length, 
        failure: 0, 
        disabled: true,
        simulated: true
      };
    }

    try {
      const message: MulticastMessage = {
        tokens: tokens,
        notification: {
          title: title,
          body: body,
        },
        data: data,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
              contentAvailable: true
            }
          }
        }
      };

      // Firebase Admin SDK'da doğru metot çağrısını yapalım
      const response = await admin.messaging().sendEachForMulticast(message);
      
      this.logger.log(`FCM bildirimi gönderildi: ${response.successCount} başarılı, ${response.failureCount} başarısız`);
      
      return {
        success: response.successCount,
        failure: response.failureCount,
        disabled: false,
        simulated: false
      };
    } catch (error) {
      this.logger.error(`FCM bildirimi gönderilirken hata: ${error.message}`, error.stack);
      return {
        success: 0, 
        failure: tokens.length, 
        error: error.message,
        disabled: false,
        simulated: false
      };
    }
  }
}
