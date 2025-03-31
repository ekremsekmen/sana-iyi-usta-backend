import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SendVerificationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  verificationToken: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class EmailVerificationResponseDto {
  @IsString()
  @IsNotEmpty()
  redirectUrl: string;
}
