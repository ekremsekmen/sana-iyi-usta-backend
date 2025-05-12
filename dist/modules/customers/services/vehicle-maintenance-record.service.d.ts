import { PrismaService } from '../../../prisma/prisma.service';
import { VehicleMaintenanceRecordResponseDto } from '../dto/vehicle-maintenance-record.dto';
export declare class VehicleMaintenanceRecordService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findRecordsForVehicle(userId: string, vehicleId: string): Promise<VehicleMaintenanceRecordResponseDto[]>;
    private findMaintenanceRecords;
}
