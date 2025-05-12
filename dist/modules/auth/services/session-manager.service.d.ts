import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class SessionManagerService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createUserSession(userId: string, request: Request): Promise<{
        id: string;
        user_id: string;
        created_at: Date | null;
        device_id: string | null;
        ip_address: string | null;
        user_agent: string | null;
        fcm_token: string | null;
    }>;
    private getOrCreateDeviceId;
    updateFcmToken(userId: string, deviceId: string, fcmToken: string): Promise<void>;
    logoutUser(userId: string): Promise<void>;
    checkUserSession(userId: string): Promise<boolean>;
    findUserSession(userId: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date | null;
        device_id: string | null;
        ip_address: string | null;
        user_agent: string | null;
        fcm_token: string | null;
    }>;
}
