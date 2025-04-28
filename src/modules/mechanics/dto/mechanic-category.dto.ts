import { IsNotEmpty, IsUUID } from 'class-validator';

export class MechanicCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  mechanic_id: string;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;
}
