"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManagerService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const error_messages_1 = require("../../../common/constants/error-messages");
let TokenManagerService = class TokenManagerService {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async generateTokens(userId, role) {
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
    async generateAccessToken(userId, role) {
        const nonce = crypto.randomBytes(8).toString('hex');
        return this.jwtService.sign({
            sub: userId,
            role: role,
            nonce: nonce
        });
    }
    async generateRefreshToken(userId) {
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
    async refreshAccessToken(combinedToken) {
        const [tokenId, tokenValue] = this.parseRefreshToken(combinedToken);
        const tokenEntry = await this.findRefreshTokenEntry(tokenId);
        const isValid = await this.validateRefreshToken(tokenEntry.user_id, combinedToken);
        if (!isValid) {
            throw new common_1.UnauthorizedException(error_messages_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
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
    parseRefreshToken(combinedToken) {
        const tokenParts = combinedToken.split(':');
        if (tokenParts.length !== 2) {
            throw new common_1.UnauthorizedException(error_messages_1.ERROR_MESSAGES.INVALID_TOKEN_FORMAT);
        }
        return [tokenParts[0], tokenParts[1]];
    }
    async findRefreshTokenEntry(tokenId) {
        const token = await this.prisma.refresh_tokens.findFirst({
            where: {
                id: tokenId,
                expires_at: { gt: new Date() },
            },
            include: { users: true },
        });
        if (!token) {
            throw new common_1.UnauthorizedException(error_messages_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
        }
        return token;
    }
    async verifyRefreshTokenHash(tokenValue, hashedToken) {
        const isMatch = await bcrypt.compare(tokenValue, hashedToken);
        if (!isMatch) {
            throw new common_1.UnauthorizedException(error_messages_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
        }
    }
    async validateRefreshToken(userId, refreshToken) {
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
    async checkRefreshTokenExists(tokenId) {
        const token = await this.prisma.refresh_tokens.findUnique({
            where: { id: tokenId },
            select: { id: true }
        });
        return !!token;
    }
    async deleteRefreshToken(tokenId) {
        const tokenExists = await this.checkRefreshTokenExists(tokenId);
        if (tokenExists) {
            await this.prisma.refresh_tokens.delete({
                where: { id: tokenId }
            });
        }
    }
};
exports.TokenManagerService = TokenManagerService;
exports.TokenManagerService = TokenManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], TokenManagerService);
//# sourceMappingURL=token-manager.service.js.map