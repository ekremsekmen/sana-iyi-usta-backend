import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMechanicDto {
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsBoolean()
  @IsOptional()
  on_site_service?: boolean;
}
