import { Injectable, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { SessionManagerService } from './session-manager.service';
import { TokenManagerService } from './token-manager.service';

@Injectable()
export class UserSessionService {
  constructor(
    private sessionManager: SessionManagerService,
    private tokenManager: TokenManagerService,
  ) {}

  /**
   * Kullanıcı oturumu oluştur - kullanıcı, session ve token işlemlerini koordine eder
   * İşlemler: 
   * 1. Oturum kaydı oluştur
   * 2. Token üret
   * 3. FCM token güncellemesi (varsa)
   * 4. Kullanıcı bilgileri ile birlikte yanıt döndür
   */
  async createUserSession(user: any, request: Request) {
    try {
      // 1. Oturum kaydı oluştur
      const session = await this.sessionManager.createUserSession(user.id, request);
      
      // 2. Token üret
      const tokenData = await this.tokenManager.generateTokens(user.id, user.role);
      
      // 3. FCM token güncellemesi (varsa)
      if (request.headers['fcm-token']) {
        await this.sessionManager.updateFcmToken(
          user.id, 
          session.device_id, 
          request.headers['fcm-token'] as string
        );
      }
  
      // 4. Kullanıcı bilgileri ile birlikte yanıt döndür
      return {
        ...tokenData,
        user: {
          id: user.id,
          full_name: user.full_name,
          e_mail: user.e_mail,
          role: user.role,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Session creation failed: ${error.message}`);
    }
  }

  /**
   * Kullanıcı çıkışı - oturum ve token kayıtlarını temizler
   */
  async logout(userId: string, refreshToken: string) {
    // Önce oturumları temizle
    const result = await this.sessionManager.logoutUser(userId, refreshToken);
    
    // Sonra token'ı geçersiz kıl (sadece logout başarılıysa)
    if (result.status === 'success') {
      const tokenParts = refreshToken.split(':');
      if (tokenParts.length === 2) {
        await this.tokenManager.deleteRefreshToken(tokenParts[0]);
      }
    }
    
    return result;
  }

  /**
   * Token yenileme işlemini token manager'a devrediyor
   */
  async refreshAccessToken(refreshToken: string) {
    return this.tokenManager.refreshAccessToken(refreshToken);
  }
}
