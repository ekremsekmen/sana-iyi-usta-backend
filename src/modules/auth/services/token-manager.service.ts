import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class TokenManagerService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}


  async generateTokens(userId: string, role: string) {
    await this.prisma.refresh_tokens.deleteMany({
      where: { user_id: userId },
    });

    const refreshToken = await this.generateRefreshToken(userId);
    const accessToken = await this.generateAccessToken(userId, role);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 900, 
    };
  }


  private async generateAccessToken(userId: string, role: string): Promise<string> {
    const nonce = crypto.randomBytes(8).toString('hex');
    
    return this.jwtService.sign({
      sub: userId,
      role: role,
      nonce: nonce
    });
  }

 
  private async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    const tokenId = crypto.randomBytes(16).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); 
    
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

  async refreshAccessToken(combinedToken: string) {
    const [tokenId, tokenValue] = this.parseRefreshToken(combinedToken);

    const tokenEntry = await this.findRefreshTokenEntry(tokenId);

    const isValid = await this.validateRefreshToken(tokenEntry.user_id, combinedToken);
    if (!isValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    await this.verifyRefreshTokenHash(tokenValue, tokenEntry.hashed_token);

    await this.prisma.refresh_tokens.deleteMany({
      where: { user_id: tokenEntry.user_id },
    });

    const newRefreshToken = await this.generateRefreshToken(tokenEntry.user_id);
    const accessToken = await this.generateAccessToken(tokenEntry.user_id, tokenEntry.users.role);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken, 
      token_type: 'Bearer',
      expires_in: 900, 
    };
  }

  private parseRefreshToken(combinedToken: string): [string, string] {
    const tokenParts = combinedToken.split(':');
    
    if (tokenParts.length !== 2) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
    }
    
    return [tokenParts[0], tokenParts[1]];
  }
  

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

  private async verifyRefreshTokenHash(tokenValue: string, hashedToken: string) {
    const isMatch = await bcrypt.compare(tokenValue, hashedToken);
    
    if (!isMatch) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }

 
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
        user_id: userId,
        expires_at: { gt: new Date() } 
      },
    });

    if (!tokenEntry) {
      return false;
    }
    
    return bcrypt.compare(tokenValue, tokenEntry.hashed_token);
  }


  async checkRefreshTokenExists(tokenId: string): Promise<boolean> {
    const token = await this.prisma.refresh_tokens.findUnique({
      where: { id: tokenId },
      select: { id: true }
    });
    
    return !!token;
  }


  async deleteRefreshToken(tokenId: string): Promise<void> {
    const tokenExists = await this.checkRefreshTokenExists(tokenId);

    if (tokenExists) {
      await this.prisma.refresh_tokens.delete({ 
        where: { id: tokenId } 
      });
    }
  }
}
