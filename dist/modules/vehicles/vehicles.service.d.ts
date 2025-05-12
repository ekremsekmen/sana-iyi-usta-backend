import { PrismaService } from '../../prisma/prisma.service';
import { VehicleSelectService } from './services/vehicle-select.service';
export declare class VehiclesService {
    private prisma;
    private vehicleSelectService;
    constructor(prisma: PrismaService, vehicleSelectService: VehicleSelectService);
    getAllBrands(): Promise<import("./dto/vehicle-select.dto").BrandDto[]>;
    getModelsByBrand(brandId: string): Promise<import("./dto/vehicle-select.dto").ModelDto[]>;
    getYearsByModel(modelId: string): Promise<import("./dto/vehicle-select.dto").YearDto[]>;
    getVariantsByYear(yearId: string): Promise<import("./dto/vehicle-select.dto").VariantDto[]>;
    getFullVehicleInfo(variantId: string): Promise<import("./dto/vehicle-select.dto").VehicleInfoDto>;
}
