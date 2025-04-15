import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class TokenManagerService {
  private readonly MAX_ACTIVE_TOKENS = 2;  // Cihaz başına maksimum token sayısı

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Kullanıcı için access ve refresh token üretir
   */
  async generateTokens(userId: string, role: string) {
    // Aktif token sayısını yönet
    await this.manageUserTokens(userId);
    
    // Token'ları üret
    const refreshToken = await this.generateRefreshToken(userId);
    const accessToken = await this.generateAccessToken(userId, role);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 900, // 15 dakika
    };
  }

  /**
   * Kullanıcının token sayısını kontrol eder ve gerekirse en eski tokenları siler
   */
  private async manageUserTokens(userId: string): Promise<void> {
    try {
      const activeTokens = await this.prisma.refresh_tokens.findMany({
        where: { 
          user_id: userId,
          expires_at: { gt: new Date() }
        },
        orderBy: { created_at: 'asc' }
      });
      
      if (activeTokens.length >= this.MAX_ACTIVE_TOKENS) {
        const tokensToDelete = activeTokens.length - this.MAX_ACTIVE_TOKENS + 1;
        const tokensToDeleteIds = activeTokens.slice(0, tokensToDelete).map(token => token.id);
        
        await this.prisma.refresh_tokens.deleteMany({
          where: { 
            id: { in: tokensToDeleteIds } 
          }
        });
      }
    } catch (error) {
      // Hata loglama
      console.error(`Token management error for user ${userId}:`, error);
    }
  }

  /**
   * Access token üretir
   */
  private async generateAccessToken(userId: string, role: string): Promise<string> {
    const nonce = crypto.randomBytes(8).toString('hex');
    
    return this.jwtService.sign({
      sub: userId,
      role: role,
      nonce: nonce
    });
  }

  /**
   * Refresh token üretir ve veritabanına kaydeder
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    const tokenId = crypto.randomBytes(16).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 günlük
    
    await this.prisma.refresh_tokens.create({
      data: {
        id: tokenId,
        user_id: userId,
        hashed_token: hashedToken,
        expires_at: expiresAt,
        created_at: new Date(),
      },
    });
    
    return `${tokenId}:${refreshToken}`;
  }

  /**
   * Token yenileme - refresh token ile yeni token kümesi üretir
   */
  async refreshAccessToken(combinedToken: string) {
    // Token doğrulama ve ayırma
    const [tokenId, tokenValue] = this.parseRefreshToken(combinedToken);
    
    // Token DB kaydını bul
    const tokenEntry = await this.findRefreshTokenEntry(tokenId);
    
    // Token hash doğrulaması
    await this.verifyRefreshTokenHash(tokenValue, tokenEntry.hashed_token);
    
    // Kullanılan token'ı sil
    await this.deleteRefreshToken(tokenId);
    
    // Yeni tokenlar üret
    const newRefreshToken = await this.generateRefreshToken(tokenEntry.user_id);
    const accessToken = await this.generateAccessToken(tokenEntry.user_id, tokenEntry.users.role);
    
    return {
      access_token: accessToken,
      refresh_token: newRefreshToken, 
      token_type: 'Bearer',
      expires_in: 900, // 15 dakika
    };
  }
  
  /**
   * Refresh token'ı ayrıştırır
   */
  private parseRefreshToken(combinedToken: string): [string, string] {
    const tokenParts = combinedToken.split(':');
    
    if (tokenParts.length !== 2) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
    }
    
    return [tokenParts[0], tokenParts[1]];
  }
  
  /**
   * Refresh token DB kaydını bulur
   */
  private async findRefreshTokenEntry(tokenId: string) {
    const token = await this.prisma.refresh_tokens.findFirst({
      where: {
        id: tokenId,
        expires_at: { gt: new Date() },
      },
      include: { users: true },
    });
    
    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }
    
    return token;
  }
  
  /**
   * Refresh token hash doğrulaması yapar
   */
  private async verifyRefreshTokenHash(tokenValue: string, hashedToken: string) {
    const isMatch = await bcrypt.compare(tokenValue, hashedToken);
    
    if (!isMatch) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }

  /**
   * Refresh token doğrulama fonksiyonu
   */
  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    if (!userId || !refreshToken) {
      return false;
    }

    const tokenParts = refreshToken.split(':');
    if (tokenParts.length !== 2) {
      return false;
    }
    
    const [tokenId, tokenValue] = tokenParts;
    
    const tokenEntry = await this.prisma.refresh_tokens.findFirst({
      where: { 
        id: tokenId,
        user_id: userId 
      },
    });

    if (!tokenEntry) {
      return false;
    }
    
    return bcrypt.compare(tokenValue, tokenEntry.hashed_token);
  }

  /**
   * Token silme fonksiyonu
   */
  async deleteRefreshToken(tokenId: string): Promise<void> {
    await this.prisma.refresh_tokens.delete({ 
      where: { id: tokenId } 
    }).catch(() => {
      // Silme işlemi başarısız olsa bile devam et
    });
  }
}
