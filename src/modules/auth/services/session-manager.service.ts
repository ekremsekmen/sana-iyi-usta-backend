import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionManagerService {
  private readonly logger = new Logger(SessionManagerService.name);
  private readonly MAX_ACTIVE_DEVICES = 2;

  constructor(
    private prisma: PrismaService,
  ) {}

  /**
   * Kullanıcı için oturum kaydı oluşturur veya günceller
   */
  async createUserSession(userId: string, request: Request) {
    try {
      const deviceId = this.getOrCreateDeviceId(request);
      const existingSession = await this.findExistingSession(userId, deviceId);
      
      if (existingSession) {
        this.logger.debug(`Updating existing session for user ${userId} with device ${deviceId}`);
        // Mevcut oturumu güncelle - şemada last_active alanı olmadığı için sadece fcm_token güncellenecek
        // veya başka bir güncelleme yapmadan mevcut oturumu döndür
        return existingSession;
      }
      
      // Aktif oturum sayısını yönet
      await this.manageUserSessions(userId, deviceId);
      
      // Oturum bilgileri - şemadaki uygun alanları kullan
      const newSession = await this.prisma.user_sessions.create({
        data: {
          user_id: userId,
          device_id: deviceId,
          ip_address: request.ip || null,
          user_agent: request.headers['user-agent'] || null,
          fcm_token: null, // FCM token ayrı bir metodla güncellenecek
          created_at: new Date(), // şema created_at alanına sahip
        },
      });
      
      this.logger.debug(`Session created for user ${userId} with device ${deviceId}`);
      return newSession;
    } catch (error) {
      this.logger.error(`Failed to create session for user ${userId}: ${error.message}`);
      throw new InternalServerErrorException('Session creation failed');
    }
  }

  /**
   * Kullanıcının mevcut oturumunu bulur
   */
  private async findExistingSession(userId: string, deviceId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return await this.prisma.user_sessions.findFirst({
      where: {
        user_id: userId,
        device_id: deviceId,
        created_at: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }
  
  /**
   * Kullanıcının aktif oturum sayısını yönetir
   */
  private async manageUserSessions(userId: string, currentDeviceId: string) {
    try {
      const activeSessions = await this.prisma.user_sessions.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'asc' }
      });
      
      if (activeSessions.length >= this.MAX_ACTIVE_DEVICES) {
        const sessionsToDelete = activeSessions.length - this.MAX_ACTIVE_DEVICES + 1;
        const oldestSessions = activeSessions.slice(0, sessionsToDelete);
        
        for (const session of oldestSessions) {
          await this.prisma.user_sessions.delete({
            where: { id: session.id }
          });
          this.logger.debug(`Deleted oldest session ID: ${session.id} for user ${userId}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to manage sessions for user ${userId}: ${error.message}`);
      throw new InternalServerErrorException('Failed to manage user sessions');
    }
  }
  
  /**
   * Request içinden cihaz ID'si oluşturur veya mevcut olanı kullanır
   */
  private getOrCreateDeviceId(request: Request): string {
    const providedDeviceId = request.headers['device-id'] as string;
    if (providedDeviceId) {
      return providedDeviceId;
    }
    
    const userAgent = request.headers['user-agent'] || 'unknown';
    const ip = request.ip || 'unknown';
    
    return crypto.createHash('md5').update(`${userAgent}:${ip}`).digest('hex');
  }

  /**
   * FCM token güncelleme - sadece oturum bilgilerini günceller
   */
  async updateFcmToken(userId: string, deviceId: string, fcmToken: string) {
    if (!fcmToken) return;
    
    try {
      await this.prisma.user_sessions.updateMany({
        where: {
          user_id: userId,
          device_id: deviceId,
        },
        data: { 
          fcm_token: fcmToken,
        },
      });
      this.logger.debug(`FCM token updated for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to update FCM token: ${error.message}`);
    }
  }

  /**
   * Kullanıcı çıkışı - sadece oturum kayıtlarını temizler
   */
  async logoutUser(userId: string, refreshToken: string) {
    try {
      if (!userId || !refreshToken) {
        return { message: 'Invalid logout request', status: 'error' };
      }

      const tokenParts = refreshToken.split(':');
      if (tokenParts.length !== 2) {
        return { message: 'Invalid token format', status: 'error' };
      }
      
      // Burada token doğrulamasını kaldırdık çünkü TokenManagerService bu işi yapıyor
      
      // Oturum kayıtlarını temizle
      await this.prisma.user_sessions.deleteMany({
        where: { user_id: userId }
      });
      
      this.logger.debug(`User ${userId} logged out successfully - sessions cleared`);
      return { message: 'Logged out successfully', status: 'success' };
    } catch (error) {
      this.logger.error(`Logout error for user ${userId}: ${error.message}`);
      return { message: 'Error during logout', status: 'error' };
    }
  }
}
