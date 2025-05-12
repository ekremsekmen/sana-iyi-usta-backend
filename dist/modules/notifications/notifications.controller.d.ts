import { NotificationsService } from './notifications.service';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(request: RequestWithUser): Promise<{
        id: string;
        user_id: string;
        created_at: Date;
        message: string;
        type: string;
        is_read: boolean;
    }[]>;
    markAllNotificationsAsRead(request: RequestWithUser): Promise<{
        success: boolean;
        count: number;
        message: string;
    }>;
    markNotificationAsRead(request: RequestWithUser, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAllNotifications(request: RequestWithUser): Promise<{
        success: boolean;
        count: number;
        message: string;
    }>;
    deleteNotification(request: RequestWithUser, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
