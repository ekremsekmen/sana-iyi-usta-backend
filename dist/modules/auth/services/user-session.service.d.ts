import { Request } from 'express';
import { SessionManagerService } from './session-manager.service';
import { TokenManagerService } from './token-manager.service';
export declare class UserSessionService {
    private sessionManager;
    private tokenManager;
    constructor(sessionManager: SessionManagerService, tokenManager: TokenManagerService);
    createUserSession(user: any, request: Request): Promise<{
        user: {
            id: any;
            full_name: any;
            e_mail: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
    updateFcmToken(userId: string, fcmToken: string): Promise<{
        message: string;
    }>;
    logout(userId: string, refreshToken: string): Promise<{
        message: string;
        status: string;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    }>;
}
