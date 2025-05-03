import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MechanicProfileDto {
  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsBoolean()
  @IsOptional()
  on_site_service?: boolean;
}
