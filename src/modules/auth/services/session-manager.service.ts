import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import * as crypto from 'crypto';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class SessionManagerService {
  private readonly logger = new Logger(SessionManagerService.name);

  constructor(
    private prisma: PrismaService,
  ) {}

  async createUserSession(userId: string, request: Request) {
    try {
      const deviceId = this.getOrCreateDeviceId(request);
      await this.prisma.user_sessions.deleteMany({
        where: { user_id: userId },
      });

      const newSession = await this.prisma.user_sessions.create({
        data: {
          user_id: userId,
          device_id: deviceId,
          ip_address: request.ip || null,
          user_agent: request.headers['user-agent'] || null,
          fcm_token: null, 
          created_at: new Date(), 
        },
      });
      
      this.logger.debug(`Session created for user ${userId} with device ${deviceId}`);
      return newSession;
    } catch (error) {
      this.logger.error(`Failed to create session for user ${userId}: ${error.message}`);
      throw new InternalServerErrorException(ERROR_MESSAGES.SESSION_CREATION_ERROR);
    }
  }

  private getOrCreateDeviceId(request: Request): string {
    const providedDeviceId = request.headers['device-id'] as string;
    if (providedDeviceId) {
      return providedDeviceId;
    }
    
    const userAgent = request.headers['user-agent'] || 'unknown';
    const ip = request.ip || 'unknown';
    
    return crypto.createHash('md5').update(`${userAgent}:${ip}`).digest('hex');
  }

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

  async logoutUser(userId: string): Promise<void> {
    try {
      await this.prisma.user_sessions.deleteMany({
        where: { user_id: userId },
      });
      this.logger.debug(`User ${userId} sessions cleared`);
    } catch (error) {
      this.logger.error(`Logout error for user ${userId}: ${error.message}`);
      throw new InternalServerErrorException(ERROR_MESSAGES.LOGOUT_ERROR);
    }
  }

  /**
   * Kullanıcının aktif bir oturumu olup olmadığını kontrol eder
   */
  async checkUserSession(userId: string): Promise<boolean> {
    const sessionCount = await this.prisma.user_sessions.count({
      where: { user_id: userId }
    });
    
    return sessionCount > 0;
  }
}
