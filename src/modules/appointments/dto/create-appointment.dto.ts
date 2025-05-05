import { IsString, IsUUID, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentType } from '@prisma/client';

export class CreateAppointmentDto {
  @IsUUID()
  mechanic_id: string;

  @IsUUID()
  vehicle_id: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(AppointmentType)
  appointment_type: AppointmentType;
}
