import { PrismaService } from '../../../prisma/prisma.service';
import { FcmService } from './fcm.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
export declare class AppointmentNotificationService {
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
    private sendPushNotification;
    notifyMechanicAboutNewAppointment(appointment: any): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    notifyCustomerAboutUpcomingAppointment(appointment: any): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    notifyMechanicAboutCancelledAppointment(appointment: any): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    notifyCustomerAboutAppointmentStatusChange(appointment: any, statusAction: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
}
