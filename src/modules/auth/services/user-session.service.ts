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
    const parts = refreshToken.split(':');
    if (parts.length !== 2) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
    }
    const tokenId = parts[0];

    const tokenExists = await this.tokenManager.checkRefreshTokenExists(tokenId);
    if (!tokenExists) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const sessionExists = await this.sessionManager.checkUserSession(userId);
    if (!sessionExists) {
      throw new BadRequestException(ERROR_MESSAGES.LOGOUT_ERROR);
    }

    try {
      await this.sessionManager.logoutUser(userId);
    } catch (err) {
      throw new BadRequestException(err.message || ERROR_MESSAGES.LOGOUT_ERROR);
    }

    await this.tokenManager.deleteRefreshToken(tokenId);
    return { message: 'Logged out successfully', status: 'success' };
  }

  async refreshAccessToken(refreshToken: string) {
    return this.tokenManager.refreshAccessToken(refreshToken);
  }
}
