export declare class CreateCustomerVehicleDto {
    brand_id: string;
    model_id: string;
    model_year_id: string;
    variant_id: string;
    plate_number?: string;
}
export declare class CustomerVehicleResponseDto {
    id: string;
    customer_id: string;
    brand_id: string;
    model_id: string;
    model_year_id: string;
    variant_id: string;
    plate_number?: string;
    created_at: Date;
    brands: {
        id: string;
        name: string;
    };
    models: {
        id: string;
        name: string;
    };
    model_years: {
        id: string;
        year: number;
    };
    variants: {
        id: string;
        name: string;
    };
}
