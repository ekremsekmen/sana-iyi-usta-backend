import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateMechanicCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  mechanic_id: string;

  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  category_ids?: string[];
}
