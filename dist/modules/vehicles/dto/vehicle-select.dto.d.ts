export declare class BrandDto {
    id: string;
    name: string;
}
export declare class ModelDto {
    id: string;
    name: string;
    brand_id: string;
}
export declare class YearDto {
    id: string;
    year: number;
    model_id: string;
}
export declare class VariantDto {
    id: string;
    name: string;
    model_year_id: string;
}
export declare class VehicleInfoDto {
    brand: string;
    brandId: string;
    model: string;
    modelId: string;
    year: number;
    yearId: string;
    variant: string;
    variantId: string;
}
