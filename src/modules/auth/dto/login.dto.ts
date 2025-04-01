import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  e_mail: string;

  @IsString()
  @MinLength(8)
  password: string;
}
