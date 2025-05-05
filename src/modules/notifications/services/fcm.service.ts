import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { messaging } from 'firebase-admin';
import { MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  private isFirebaseInitialized = false;
  
  onModuleInit() {
    // Geliştirme aşamasında Firebase başlatma işlemini geçiyoruz
    this.logger.log('Firebase geliştirme modunda devre dışı bırakıldı');
    
    /* Firebase başlatma işlemi geliştirme aşamasında devre dışı bırakıldı
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
    */
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
    // Geliştirme aşamasında FCM devre dışı bırakıldı
    this.logger.log(`FCM bildirimi simüle ediliyor - Başlık: "${title}", İçerik: "${body}"`);
    
    if (data) {
      this.logger.log(`FCM ekstra data: ${JSON.stringify(data)}`);
    }
    
    // Bildirimlerin başarıyla gönderildiğini simüle ediyoruz
    return { 
      success: tokens ? tokens.length : 0, 
      failure: 0, 
      disabled: true,
      simulated: true
    };
  }
}
