import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCustomerVehicleDto {
  @IsNotEmpty()
  @IsUUID()
  brand_id: string;

  @IsNotEmpty()
  @IsUUID()
  model_id: string;

  @IsNotEmpty()
  @IsUUID()
  model_year_id: string;

  @IsNotEmpty()
  @IsUUID()
  variant_id: string;

  @IsOptional()
  @IsString()
  plate_number?: string;
}



export class CustomerVehicleResponseDto {
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
