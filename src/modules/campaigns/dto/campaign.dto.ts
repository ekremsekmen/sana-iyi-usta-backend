import { IsString, IsNotEmpty, IsUUID, IsOptional, IsNumber, Min, Max, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CampaignDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsNotEmpty()
  discount_rate: number;

  @IsDateString()
  @IsNotEmpty()
  valid_until: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  brand_ids: string[];

  @IsUUID()
  @IsNotEmpty()
  category_id: string;
  
}
