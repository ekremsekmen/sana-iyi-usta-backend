import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class VerifyResetCodeDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Verification code is required' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @Length(6, 6, { message: 'Verification code must be 6 characters' })
  code: string;
}

export class ResetPasswordWithCodeDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Verification code is required' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @Length(6, 6, { message: 'Verification code must be 6 characters' })
  code: string;

  @IsString({ message: 'New password is required' })
  @IsNotEmpty({ message: 'New password is required' })
  @Length(8, 50, { message: 'Password must be at least 8 characters' })
  newPassword: string;
}
