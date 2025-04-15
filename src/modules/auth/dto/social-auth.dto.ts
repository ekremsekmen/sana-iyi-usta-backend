import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from './register.dto';

export class GoogleAuthDto {
  @IsNotEmpty({ message: 'Access token is required' })
  @IsString({ message: 'Access token must be a string' })
  accessToken: string;

  @IsNotEmpty({ message: 'Provider ID is required' })
  @IsString({ message: 'Provider ID must be a string' })
  providerId: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  fullName: string;

  @IsOptional()
  @IsString({ message: 'Picture link must be a string' })
  picture?: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role is invalid' })
  role: UserRole;

  @IsNotEmpty({ message: 'KVKK approval is required' })
  @IsBoolean({ message: 'KVKK approval must be boolean' })
  kvkkApproved: boolean;

  @IsNotEmpty({ message: 'Terms approval is required' })
  @IsBoolean({ message: 'Terms approval must be boolean' })
  termsApproved: boolean;
}

export class AppleAuthDto {
  @IsNotEmpty({ message: 'Identity token is required' })
  @IsString({ message: 'Identity token must be a string' })
  identityToken: string;

  @IsNotEmpty({ message: 'Provider ID is required' })
  @IsString({ message: 'Provider ID must be a string' })
  providerId: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  fullName?: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role is invalid' })
  role: UserRole;

  @IsNotEmpty({ message: 'KVKK approval is required' })
  @IsBoolean({ message: 'KVKK approval must be boolean' })
  kvkkApproved: boolean;

  @IsNotEmpty({ message: 'Terms approval is required' })
  @IsBoolean({ message: 'Terms approval must be boolean' })
  termsApproved: boolean;
}

export class FacebookAuthDto {
  @IsNotEmpty({ message: 'Access token is required' })
  @IsString({ message: 'Access token must be a string' })
  accessToken: string;

  @IsNotEmpty({ message: 'Provider ID is required' })
  @IsString({ message: 'Provider ID must be a string' })
  providerId: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  fullName: string;

  @IsOptional()
  @IsString({ message: 'Picture must be a string' })
  picture?: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role is invalid' })
  role: UserRole;

  @IsNotEmpty({ message: 'KVKK approval is required' })
  @IsBoolean({ message: 'KVKK approval must be boolean' })
  kvkkApproved: boolean;

  @IsNotEmpty({ message: 'Terms approval is required' })
  @IsBoolean({ message: 'Terms approval must be boolean' })
  termsApproved: boolean;
}
