import { PrismaService } from '../../../prisma/prisma.service';
import { MechanicSupportedVehicleDto } from '../dto/mechanic-supported-vehicle.dto';
export declare class MechanicSupportedVehiclesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByMechanic(mechanicId: string): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[]>;
    create(dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[] | ({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })>;
    remove(id: string): Promise<{
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    }>;
    removeByMechanicAndBrand(mechanicId: string, brandId: string): Promise<{
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    }>;
    updateBulkSupportedVehicles(mechanicId: string, brandIds: string[]): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[]>;
    createMultiple(mechanicId: string, brandIds: string[]): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[]>;
    addSupportedVehicle(dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[] | ({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })>;
    createForMechanic(mechanicId: string, dto: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[] | ({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })>;
    addSupportedVehicleForMechanic(mechanicId: string, body: MechanicSupportedVehicleDto | MechanicSupportedVehicleDto[]): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[] | ({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })>;
    updateSupportedVehiclesForMechanic(mechanicId: string, dtoList: MechanicSupportedVehicleDto[]): Promise<({
        brands: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        mechanic_id: string;
        brand_id: string;
    })[]>;
}
