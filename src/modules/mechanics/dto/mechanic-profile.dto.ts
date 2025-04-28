import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class MechanicProfileDto {
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsBoolean()
  @IsOptional()
  on_site_service?: boolean;
}
