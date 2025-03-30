import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerificationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  verificationToken: string;
}
