import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsOptional()
  latitude?: Decimal;

  @IsNumber()
  @IsOptional()
  longitude?: Decimal;

  @IsString()
  @IsOptional()
  label?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;
}
