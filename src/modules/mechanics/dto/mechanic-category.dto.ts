import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class MechanicCategoryDto {
  @IsUUID()
  @IsOptional()
  mechanic_id?: string;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;
}
