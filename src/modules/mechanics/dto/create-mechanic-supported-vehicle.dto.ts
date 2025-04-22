import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMechanicSupportedVehicleDto {
  @IsUUID()
  @IsNotEmpty()
  mechanic_id: string;

  @IsUUID()
  @IsNotEmpty()
  brand_id: string;
}
