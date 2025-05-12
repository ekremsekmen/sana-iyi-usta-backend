import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class TokenManagerService {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    generateTokens(userId: string, role: string): Promise<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
    private generateAccessToken;
    private generateRefreshToken;
    refreshAccessToken(combinedToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
    private parseRefreshToken;
    private findRefreshTokenEntry;
    private verifyRefreshTokenHash;
    validateRefreshToken(userId: string, refreshToken: string): Promise<boolean>;
    checkRefreshTokenExists(tokenId: string): Promise<boolean>;
    deleteRefreshToken(tokenId: string): Promise<void>;
}
