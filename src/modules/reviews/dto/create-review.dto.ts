import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID()
  appointment_id: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  review?: string;
}
