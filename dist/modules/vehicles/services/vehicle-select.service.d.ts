import { PrismaService } from '../../../prisma/prisma.service';
import { BrandDto, ModelDto, YearDto, VariantDto, VehicleInfoDto } from '../dto/vehicle-select.dto';
export declare class VehicleSelectService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllBrands(): Promise<BrandDto[]>;
    findModelsByBrandId(brandId: string): Promise<ModelDto[]>;
    findYearsByModelId(modelId: string): Promise<YearDto[]>;
    findVariantsByYearId(yearId: string): Promise<VariantDto[]>;
    getFullVehicleInfo(variantId: string): Promise<VehicleInfoDto | null>;
}
