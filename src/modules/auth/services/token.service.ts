import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async generateTokens(userId: string, role: string) {
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
    return this.jwtService.sign({
      sub: userId,
      role: role,
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
      },
    });

    return `${tokenId}:${refreshToken}`;
  }

  async refreshAccessToken(combinedToken: string, userId: string) {
    try {
      const [tokenId, refreshToken] = combinedToken.split(':');
      
      if (!tokenId || !refreshToken) {
        throw new UnauthorizedException('Invalid refresh token format');
      }

      // Token'ın istek yapan kullanıcıya ait olduğunu doğrula
      const token = await this.prisma.refresh_tokens.findFirst({
        where: {
          id: tokenId,
          user_id: userId, // JwtAuthGuard'dan gelen userId ile eşleşmeli
          expires_at: {
            gt: new Date(),
          },
        },
        include: {
          users: true,
        },
      });

      if (!token) {
        throw new UnauthorizedException('Refresh token not found or expired');
      }

      const isMatch = await bcrypt.compare(refreshToken, token.hashed_token);
      
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.prisma.refresh_tokens.delete({
        where: { id: tokenId }
      });

      const newRefreshToken = await this.generateRefreshToken(token.user_id);
      const accessToken = await this.generateAccessToken(token.user_id, token.users.role);
      
      return {
        access_token: accessToken,
        refresh_token: newRefreshToken, 
        token_type: 'Bearer',
        expires_in: 900, 
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error processing refresh token');
    }
  }
}
