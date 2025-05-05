import { IsOptional, IsString, IsUUID, IsBoolean, IsNumber, IsDate, IsDecimal, IsInt } from 'class-validator';

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

  @IsOptional()
  @IsString()
  role?: string;
}

// Basit kullanıcı bilgilerini içeren arayüz
export interface BasicUserInfo {
  id: string;
  phone_number?: string;
  profile_image?: string;
  full_name?: string;
  role?: string;
  email?: string;
}

// Basit mekanik bilgilerini içeren arayüz
export interface BasicMechanicInfo {
  id: string;
  business_name: string;
  on_site_service?: boolean;
  average_rating?: number;
}

// Basit müşteri bilgilerini içeren arayüz
export interface BasicCustomerInfo {
  id: string;
}

export interface UserProfileResponseDto {
  user: BasicUserInfo;
  mechanic?: BasicMechanicInfo; // Eğer kullanıcı mekanikse
  customer?: BasicCustomerInfo; // Eğer kullanıcı müşteriyse
}

export interface DefaultLocationResponseDto {
  id: string;
  default_location: any | null;
}


