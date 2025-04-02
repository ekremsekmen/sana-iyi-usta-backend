import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from './register.dto';

export class GoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsBoolean()
  kvkkApproved: boolean;

  @IsNotEmpty()
  @IsBoolean()
  termsApproved: boolean;
}

export class AppleAuthDto {
  @IsNotEmpty()
  @IsString()
  identityToken: string;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsBoolean()
  kvkkApproved: boolean;

  @IsNotEmpty()
  @IsBoolean()
  termsApproved: boolean;
}

export class FacebookAuthDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsBoolean()
  kvkkApproved: boolean;

  @IsNotEmpty()
  @IsBoolean()
  termsApproved: boolean;
}
