import { IsOptional, IsUUID, IsString, IsNumber, Min, Max, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum SortBy {
  RATING = 'rating',
  DISTANCE = 'distance'
}

export class SearchMechanicsDto {
  @IsString()
  city: string;

  @IsUUID()
  brandId: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  onSiteService?: boolean;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  page?: number = 0;
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(SortOrder)
  ratingSort?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.RATING;
}

export class MechanicSearchResponseDto {
  id: string;
  business_name: string;
  on_site_service: boolean;
  average_rating: number;
  user_id: string;
  user?: {
    full_name: string;
    profile_image?: string;
  };
  distance?: number;
  categories?: {
    id: string;
    name: string;
  }[];
  supported_vehicles?: {
    id: string;
    name: string;
  }[];
  total_reviews?: number;
}
