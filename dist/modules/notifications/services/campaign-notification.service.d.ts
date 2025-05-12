import { PrismaService } from '../../../prisma/prisma.service';
import { FcmService } from './fcm.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
export declare class CampaignNotificationService {
    private readonly prisma;
    private readonly fcmService;
    private readonly logger;
    constructor(prisma: PrismaService, fcmService: FcmService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        message: string;
        type: string;
        is_read: boolean;
    }>;
    sendCampaignNotifications(mechanicId: string, campaignId: string, campaignTitle: string, brandIds: string[]): Promise<{
        sent: number;
        message: string;
        fcmTokens?: undefined;
        fcmSuccess?: undefined;
        fcmFailure?: undefined;
        simulated?: undefined;
        success?: undefined;
        error?: undefined;
    } | {
        sent: number;
        fcmTokens: number;
        fcmSuccess: number;
        fcmFailure: number;
        simulated: boolean;
        message: string;
        success?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        sent?: undefined;
        message?: undefined;
        fcmTokens?: undefined;
        fcmSuccess?: undefined;
        fcmFailure?: undefined;
        simulated?: undefined;
    }>;
}
