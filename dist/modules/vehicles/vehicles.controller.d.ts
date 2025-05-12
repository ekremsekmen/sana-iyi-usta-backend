import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    getAllBrands(): Promise<import("./dto/vehicle-select.dto").BrandDto[]>;
    getModelsByBrand(brandId: string): Promise<import("./dto/vehicle-select.dto").ModelDto[]>;
    getYearsByModel(modelId: string): Promise<import("./dto/vehicle-select.dto").YearDto[]>;
    getVariantsByYear(yearId: string): Promise<import("./dto/vehicle-select.dto").VariantDto[]>;
    getVehicleInfo(variantId: string): Promise<import("./dto/vehicle-select.dto").VehicleInfoDto>;
}
