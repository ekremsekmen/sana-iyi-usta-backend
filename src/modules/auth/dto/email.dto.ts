import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SendVerificationEmailDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Verification token is required' })
  @IsNotEmpty({ message: 'Verification token is required' })
  verificationToken: string;
}

export class VerifyEmailDto {
  @IsString({ message: 'Verification token is required' })
  @IsNotEmpty({ message: 'Verification token is required' })
  token: string;
}

export class EmailVerificationResponseDto {
  @IsString({ message: 'Redirect URL is required' })
  @IsNotEmpty({ message: 'Redirect URL is required' })
  redirectUrl: string;
}
