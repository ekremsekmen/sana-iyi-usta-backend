import {
  IsString,
  IsEmail,
  IsBoolean,
  IsEnum,
  Length,
  IsOptional,
} from 'class-validator';

export enum UserRole {
  CUSTOMER = 'customer',
  MECHANIC = 'mechanic',
  ADMIN = 'admin',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  ICLOUD = 'icloud',
}

export class RegisterDto {
  @IsString()
  @Length(2, 50)
  full_name: string;

  @IsEmail()
  e_mail: string;

  @IsString()
  @Length(8, 64)
  @IsOptional()
  password?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  kvkk_approved: boolean;

  @IsBoolean()
  terms_approved: boolean;

  @IsEnum(AuthProvider)
  @IsOptional()
  auth_provider?: AuthProvider = AuthProvider.LOCAL;

  @IsString()
  @IsOptional()
  provider_id?: string;
}
