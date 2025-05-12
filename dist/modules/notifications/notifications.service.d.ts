import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CampaignNotificationService } from './services/campaign-notification.service';
import { MaintenanceReminderNotificationService } from './services/maintenance-reminder-notification.service';
export declare class NotificationsService {
    private readonly prisma;
    private readonly campaignNotificationService;
    private readonly maintenanceReminderService;
    private readonly logger;
    constructor(prisma: PrismaService, campaignNotificationService: CampaignNotificationService, maintenanceReminderService: MaintenanceReminderNotificationService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        message: string;
        type: string;
        is_read: boolean;
    }>;
    getUserNotifications(userId: string): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        message: string;
        type: string;
        is_read: boolean;
    }[]>;
    markNotificationsAsRead(userId: string, notificationIds: string[]): Promise<{
        success: boolean;
        count: number;
        message: string;
    }>;
    deleteNotifications(userId: string, notificationIds: string[]): Promise<{
        success: boolean;
        count: number;
        message: string;
    }>;
    markNotificationAsRead(userId: string, notificationId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllNotificationsAsRead(userId: string): Promise<{
        success: boolean;
        count: number;
        message: string;
    }>;
    deleteAllNotifications(userId: string): Promise<{
        success: boolean;
        count: number;
        message: string;
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
    checkUpcomingMaintenances(): Promise<{
        success: boolean;
        processed: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        processed?: undefined;
    }>;
    sendMaintenanceReminder(userId: string, vehicleId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    notifyMaintenanceRecordCreated(userId: string, vehicleId: string, mechanicName: string, details: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    deleteNotification(userId: string, notificationId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
