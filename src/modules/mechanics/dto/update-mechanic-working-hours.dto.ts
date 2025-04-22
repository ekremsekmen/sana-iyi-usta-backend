import { PartialType } from '@nestjs/mapped-types';
import { CreateMechanicWorkingHoursDto } from './create-mechanic-working-hours.dto';

export class UpdateMechanicWorkingHoursDto extends PartialType(CreateMechanicWorkingHoursDto) {}
