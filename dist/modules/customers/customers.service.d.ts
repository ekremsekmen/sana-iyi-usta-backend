import { CreateCustomerVehicleDto } from './dto/customer-vehicle.dto';
import { CustomerVehicleService } from './services/customer-vehicle.service';
import { VehicleMaintenanceRecordService } from './services/vehicle-maintenance-record.service';
import { FilesService } from '../files/files.service';
export declare class CustomersService {
    private customerVehicleService;
    private vehicleMaintenanceRecordService;
    private filesService;
    constructor(customerVehicleService: CustomerVehicleService, vehicleMaintenanceRecordService: VehicleMaintenanceRecordService, filesService: FilesService);
    createVehicleForUser(userId: string, createVehicleDto: CreateCustomerVehicleDto): Promise<import("./dto/customer-vehicle.dto").CustomerVehicleResponseDto>;
    findAllVehiclesForUser(userId: string): Promise<import("./dto/customer-vehicle.dto").CustomerVehicleResponseDto[]>;
    findVehicleForUser(userId: string, vehicleId: string): Promise<import("./dto/customer-vehicle.dto").CustomerVehicleResponseDto>;
    removeVehicleForUser(userId: string, vehicleId: string): Promise<void>;
    findVehicleMaintenanceRecords(userId: string, vehicleId: string): Promise<import("./dto/vehicle-maintenance-record.dto").VehicleMaintenanceRecordResponseDto[]>;
    uploadVehiclePhoto(userId: string, vehicleId: string, file: Express.Multer.File): Promise<import("./dto/customer-vehicle.dto").CustomerVehicleResponseDto>;
}
