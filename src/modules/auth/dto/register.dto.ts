import {
  IsString,
  IsEmail,
  IsBoolean,
  IsEnum,
  Length,
  IsOptional,
  ValidateIf,
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
  @IsString({ message: 'Full name is required' })
  @Length(2, 50, { message: 'Full name must be between 2 and 50 characters' })
  full_name: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  e_mail: string;

  @IsString({ message: 'Password is required' })
  @Length(8, 64, { message: 'Password must be between 8 and 64 characters' })
  @IsOptional()
  password?: string;

  @IsEnum(UserRole, { message: 'Role is invalid' })
  role: UserRole;

  @IsBoolean({ message: 'KVKK approval is required' })
  kvkk_approved: boolean;

  @IsBoolean({ message: 'Terms approval is required' })
  terms_approved: boolean;

  @IsEnum(AuthProvider, { message: 'Auth provider is invalid' })
  auth_provider: AuthProvider;

  @IsString({ message: 'Provider ID is required for social login' })
  @ValidateIf((o) => o.auth_provider !== AuthProvider.LOCAL)
  provider_id: string;
}
