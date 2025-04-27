import { IsString, IsOptional, IsBoolean, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  parent_id: string | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  subcategories?: CategoryDto[];

  created_at: Date;
}

export class CategoryFilterDto {
  @IsBoolean()
  @IsOptional()
  onlyParentCategories?: boolean; // Geriye dönük uyumluluk için tutuldu

  @IsString()
  @IsOptional()
  parentId?: string; // Null olabilir veya bir UUID olabilir
}
