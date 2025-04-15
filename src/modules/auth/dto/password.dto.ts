import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsNotEmpty({ message: 'E-posta adresi zorunludur' })
  email: string;
}


export class VerifyResetCodeDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsNotEmpty({ message: 'E-posta adresi zorunludur' })
  email: string;

  @IsString({ message: 'Doğrulama kodu zorunludur' })
  @IsNotEmpty({ message: 'Doğrulama kodu zorunludur' })
  @Length(6, 6, { message: 'Doğrulama kodu 6 karakter olmalıdır' })
  code: string;
}

export class ResetPasswordWithCodeDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsNotEmpty({ message: 'E-posta adresi zorunludur' })
  email: string;

  @IsString({ message: 'Doğrulama kodu zorunludur' })
  @IsNotEmpty({ message: 'Doğrulama kodu zorunludur' })
  @Length(6, 6, { message: 'Doğrulama kodu 6 karakter olmalıdır' })
  code: string;

  @IsString({ message: 'Yeni şifre zorunludur' })
  @IsNotEmpty({ message: 'Yeni şifre zorunludur' })
  @Length(8, 50, { message: 'Şifre en az 8 karakter olmalıdır' })
  newPassword: string;
}
