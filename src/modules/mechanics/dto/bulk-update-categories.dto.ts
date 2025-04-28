import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class BulkUpdateCategoriesDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMinSize(0)
  category_ids: string[];
}
