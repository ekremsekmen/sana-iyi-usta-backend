import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateMechanicSupportedVehicleDto {
  @IsUUID()
  @IsNotEmpty()
  mechanic_id: string;

  @IsUUID()
  @IsOptional()
  brand_id?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  brand_ids?: string[];
}
