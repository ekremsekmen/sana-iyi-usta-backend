import { IsUUID, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentType } from '@prisma/client';

export class GetAvailableSlotsDto {
  @IsUUID()
  mechanic_id: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsEnum(AppointmentType)
  appointment_type?: AppointmentType;
}
