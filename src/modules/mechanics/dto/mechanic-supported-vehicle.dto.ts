import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class MechanicSupportedVehicleDto {
  @IsUUID()
  @IsOptional()
  mechanic_id?: string;

  @IsUUID()
  @IsNotEmpty()
  brand_id: string;
}
