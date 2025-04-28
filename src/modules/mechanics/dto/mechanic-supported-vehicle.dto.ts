import { IsNotEmpty, IsUUID } from 'class-validator';

export class MechanicSupportedVehicleDto {
  @IsUUID()
  @IsNotEmpty()
  mechanic_id: string;

  @IsUUID()
  @IsNotEmpty()
  brand_id: string;
}
