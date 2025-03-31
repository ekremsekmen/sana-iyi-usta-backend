import { IsEmail, IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class SendVerificationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  verificationToken: string;
}

export class EmailVerificationResponseDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  redirectUrl: string;
}
