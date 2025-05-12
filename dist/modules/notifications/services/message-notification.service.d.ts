import { PrismaService } from '../../../prisma/prisma.service';
import { FcmService } from './fcm.service';
export declare class MessageNotificationService {
    private prisma;
    private fcmService;
    private readonly logger;
    private lastNotificationTimes;
    private readonly notificationCooldown;
    constructor(prisma: PrismaService, fcmService: FcmService);
    sendChatNotificationIfNeeded(senderId: string, receiverId: string): Promise<void>;
}
