import { PrismaService } from '../../../prisma/prisma.service';
import { CreateVehicleMaintenanceRecordDto } from '../dto/create-vehicle-maintenance-record.dto';
import { NotificationsService } from '../../notifications/notifications.service';
export declare class MechanicVehicleMaintenanceService {
    private readonly prisma;
    private readonly notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createMaintenanceRecord(mechanicId: string, dto: CreateVehicleMaintenanceRecordDto): Promise<{
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        appointment_id: string | null;
        details: string;
        cost: import(".prisma/client/runtime/library").Decimal;
        odometer: number;
        next_due_date: Date | null;
        vehicle_id: string;
        service_date: Date | null;
        customer_id: string | null;
    }>;
    getMaintenanceRecordsByVehicle(mechanicId: string, vehicleId: string): Promise<({
        appointments: {
            status: string;
            appointment_date: Date;
            appointment_type: import(".prisma/client").$Enums.AppointmentType;
        };
    } & {
        id: string;
        created_at: Date | null;
        mechanic_id: string;
        appointment_id: string | null;
        details: string;
        cost: import(".prisma/client/runtime/library").Decimal;
        odometer: number;
        next_due_date: Date | null;
        vehicle_id: string;
        service_date: Date | null;
        customer_id: string | null;
    })[]>;
}
