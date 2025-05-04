import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
