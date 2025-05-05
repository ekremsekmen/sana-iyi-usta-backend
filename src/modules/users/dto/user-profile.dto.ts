import { IsOptional, IsString, IsUUID, IsBoolean, IsNumber, IsDate, IsDecimal, IsInt } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';
import { DefaultLocationDto } from './default-location.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  profile_image?: string;

  @IsOptional()
  @IsString()
  full_name?: string;
}

export class CategoryDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}

export class MechanicCategoryDto {
  @IsUUID()
  id: string;

  @IsUUID()
  mechanic_id: string;

  @IsUUID()
  category_id: string;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsOptional()
  categories?: CategoryDto;
}

export class BrandDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}

export class SupportedVehicleDto {
  @IsUUID()
  id: string;

  @IsUUID()
  mechanic_id: string;

  @IsUUID()
  brand_id: string;

  @IsOptional()
  brands?: BrandDto;
}

export class WorkingHourDto {
  @IsUUID()
  id: string;

  @IsUUID()
  mechanic_id: string;

  @IsInt()
  day_of_week: number;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsInt()
  slot_duration: number;

  @IsBoolean()
  is_day_off: boolean;
}

export class MechanicDetailsDto {
  @IsUUID()
  id: string;

  @IsUUID()
  user_id: string;

  @IsString()
  business_name: string;

  @IsBoolean()
  @IsOptional()
  on_site_service?: boolean;

  @IsDecimal()
  @IsOptional()
  average_rating?: Decimal;

  @IsDate()
  created_at: Date;

  @IsOptional()
  mechanic_categories?: MechanicCategoryDto[];

  @IsOptional()
  mechanic_working_hours?: WorkingHourDto[];

  @IsOptional()
  mechanic_supported_vehicles?: SupportedVehicleDto[];
}

export class CustomerDetailsDto {
  @IsUUID()
  id: string;

  @IsUUID()
  user_id: string;

  @IsDate()
  @IsOptional()
  created_at?: Date;
}

export class UserDto {
  @IsUUID()
  id: string;

  @IsString()
  full_name: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  role: string;

  @IsString()
  user_role: string; // Rol bilgisini açık şekilde içeren alan

  @IsString()
  @IsOptional()
  profile_image?: string;

  @IsDate()
  created_at: Date;

  @IsString()
  e_mail: string;

  @IsOptional()
  default_location?: DefaultLocationDto | null;
}

export class UserProfileResponseDto {
  user: UserDto;

  @IsOptional()
  mechanic?: MechanicDetailsDto;

  @IsOptional()
  customer?: CustomerDetailsDto;
}
