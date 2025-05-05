import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleMaintenanceRecordDto {
  @IsUUID()
  @IsNotEmpty()
  appointment_id: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  cost: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  odometer: number;

  @IsOptional()
  @IsString()
  next_due_date?: string;
}
