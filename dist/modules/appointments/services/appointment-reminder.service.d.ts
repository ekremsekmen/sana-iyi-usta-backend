import { PrismaService } from '../../../prisma/prisma.service';
import { AppointmentNotificationService } from '../../notifications/services/appointment-notification.service';
export declare class AppointmentReminderService {
    private readonly prisma;
    private readonly appointmentNotificationService;
    private readonly logger;
    constructor(prisma: PrismaService, appointmentNotificationService: AppointmentNotificationService);
    sendAppointmentReminders(): Promise<{
        success: boolean;
        count: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        count?: undefined;
    }>;
}
