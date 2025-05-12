import { PrismaService } from '../../../prisma/prisma.service';
import { FcmService } from './fcm.service';
export declare class MaintenanceReminderNotificationService {
    private readonly prisma;
    private readonly fcmService;
    private readonly logger;
    private sentReminders;
    constructor(prisma: PrismaService, fcmService: FcmService);
    private createNotification;
    checkUpcomingMaintenances(): Promise<{
        success: boolean;
        processed: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        processed?: undefined;
    }>;
    private checkForNewerMaintenanceDate;
    sendMaintenanceNotification(userId: string, title: string, message: string, data?: Record<string, string>): Promise<boolean>;
}
