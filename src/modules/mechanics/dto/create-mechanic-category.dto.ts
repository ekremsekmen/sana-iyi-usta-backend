import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMechanicCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  mechanic_id: string;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;
}
