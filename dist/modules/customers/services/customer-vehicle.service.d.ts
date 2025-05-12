import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCustomerVehicleDto, CustomerVehicleResponseDto } from '../dto/customer-vehicle.dto';
import { CustomerValidateService } from './customer-validate.service';
export declare class CustomerVehicleService {
    private prisma;
    private customerValidateService;
    constructor(prisma: PrismaService, customerValidateService: CustomerValidateService);
    createVehicleForUser(userId: string, createVehicleDto: CreateCustomerVehicleDto): Promise<CustomerVehicleResponseDto>;
    findAllVehiclesForUser(userId: string): Promise<CustomerVehicleResponseDto[]>;
    createVehicle(customerId: string, createVehicleDto: CreateCustomerVehicleDto): Promise<CustomerVehicleResponseDto>;
    findOneVehicle(id: string): Promise<CustomerVehicleResponseDto>;
    findAllVehicles(customerId: string): Promise<CustomerVehicleResponseDto[]>;
    findVehicleForUser(userId: string, vehicleId: string): Promise<CustomerVehicleResponseDto>;
    removeVehicleForUser(userId: string, vehicleId: string): Promise<void>;
    updateVehiclePhoto(userId: string, vehicleId: string, photoUrl: string): Promise<CustomerVehicleResponseDto>;
}
