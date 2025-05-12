import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { SlotService } from './slot.service';
import { AppointmentNotificationService } from '../../notifications/services/appointment-notification.service';
export declare class AppointmentManagementService {
    private prisma;
    private slotService;
    private appointmentNotificationService;
    private readonly logger;
    constructor(prisma: PrismaService, slotService: SlotService, appointmentNotificationService: AppointmentNotificationService);
    createAppointment(customerId: string, dto: CreateAppointmentDto): Promise<{
        id: string;
        created_at: Date;
        status: string;
        mechanic_id: string;
        start_time: Date;
        end_time: Date;
        vehicle_id: string;
        customer_id: string;
        appointment_date: Date;
        description: string | null;
        appointment_type: import(".prisma/client").$Enums.AppointmentType;
        location_id: string | null;
    }>;
    cancelAppointment(userId: string, appointmentId: string, userRole: string): Promise<{
        id: string;
        created_at: Date;
        status: string;
        mechanic_id: string;
        start_time: Date;
        end_time: Date;
        vehicle_id: string;
        customer_id: string;
        appointment_date: Date;
        description: string | null;
        appointment_type: import(".prisma/client").$Enums.AppointmentType;
        location_id: string | null;
    }>;
    approveAppointment(mechanicUserId: string, appointmentId: string): Promise<{
        id: string;
        created_at: Date;
        status: string;
        mechanic_id: string;
        start_time: Date;
        end_time: Date;
        vehicle_id: string;
        customer_id: string;
        appointment_date: Date;
        description: string | null;
        appointment_type: import(".prisma/client").$Enums.AppointmentType;
        location_id: string | null;
    }>;
    completeAppointment(mechanicUserId: string, appointmentId: string): Promise<{
        id: string;
        created_at: Date;
        status: string;
        mechanic_id: string;
        start_time: Date;
        end_time: Date;
        vehicle_id: string;
        customer_id: string;
        appointment_date: Date;
        description: string | null;
        appointment_type: import(".prisma/client").$Enums.AppointmentType;
        location_id: string | null;
    }>;
}
