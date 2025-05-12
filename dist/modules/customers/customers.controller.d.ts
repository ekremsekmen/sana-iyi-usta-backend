import { CustomersService } from './customers.service';
import { CreateCustomerVehicleDto } from './dto/customer-vehicle.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    getMyVehicles(request: RequestWithUser): Promise<import("./dto/customer-vehicle.dto").CustomerVehicleResponseDto[]>;
    addMyVehicle(createVehicleDto: CreateCustomerVehicleDto, request: RequestWithUser): Promise<import("./dto/customer-vehicle.dto").CustomerVehicleResponseDto>;
    getMyVehicle(vehicleId: string, request: RequestWithUser): Promise<import("./dto/customer-vehicle.dto").CustomerVehicleResponseDto>;
    deleteMyVehicle(vehicleId: string, request: RequestWithUser): Promise<void>;
    getVehicleMaintenanceRecords(vehicleId: string, request: RequestWithUser): Promise<import("./dto/vehicle-maintenance-record.dto").VehicleMaintenanceRecordResponseDto[]>;
    uploadVehiclePhoto(vehicleId: string, file: Express.Multer.File, request: RequestWithUser): Promise<import("./dto/customer-vehicle.dto").CustomerVehicleResponseDto>;
}
