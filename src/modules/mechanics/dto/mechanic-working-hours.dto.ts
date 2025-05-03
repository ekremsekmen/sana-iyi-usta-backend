import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class MechanicWorkingHoursDto {
  @IsUUID()
  @IsOptional()
  mechanic_id?: string;

  @IsInt()
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  day_of_week: number;

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  end_time: string;

  @IsInt()
  @Min(15)
  @IsNotEmpty()
  slot_duration: number;

  @IsBoolean()
  @IsOptional()
  is_day_off?: boolean;
}
