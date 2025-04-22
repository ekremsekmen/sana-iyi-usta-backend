import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class BulkUpdateSupportedVehiclesDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMinSize(0)
  brand_ids: string[];
}
