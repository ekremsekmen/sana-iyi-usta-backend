import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class DefaultLocationDto {
  @IsUUID()
  id: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsOptional()
  latitude?: Decimal;

  @IsOptional()
  longitude?: Decimal;
}

export class DefaultLocationResponseDto {
  @IsUUID()
  id: string;

  @IsOptional()
  default_location: DefaultLocationDto | null;
}
