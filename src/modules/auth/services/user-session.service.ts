import { Injectable, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { SessionManagerService } from './session-manager.service';
import { TokenManagerService } from './token-manager.service';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class UserSessionService {
  constructor(
    private sessionManager: SessionManagerService,
    private tokenManager: TokenManagerService,
  ) {}


  async createUserSession(user: any, request: Request) {
    try {
      const session = await this.sessionManager.createUserSession(user.id, request);
      
      const tokenData = await this.tokenManager.generateTokens(user.id, user.role);
      
      if (request.headers['fcm-token']) {
        await this.sessionManager.updateFcmToken(
          user.id, 
          session.device_id, 
          request.headers['fcm-token'] as string
        );
      }
  
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
      throw new BadRequestException(ERROR_MESSAGES.SESSION_CREATION_ERROR);
    }
  }


  async logout(userId: string, refreshToken: string) {
    const result = await this.sessionManager.logoutUser(userId, refreshToken);
    
    if (result.status === 'success') {
      const tokenParts = refreshToken.split(':');
      if (tokenParts.length === 2) {
        await this.tokenManager.deleteRefreshToken(tokenParts[0]);
      }
    }
    
    return result;
  }

  async refreshAccessToken(refreshToken: string) {
    return this.tokenManager.refreshAccessToken(refreshToken);
  }
}
