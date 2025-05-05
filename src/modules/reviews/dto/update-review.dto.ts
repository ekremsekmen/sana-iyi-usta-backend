import { IsDecimal, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateReviewDto {
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  review?: string;
}
