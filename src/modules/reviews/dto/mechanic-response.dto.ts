import { IsNotEmpty, IsString } from 'class-validator';

export class MechanicResponseDto {
  @IsNotEmpty()
  @IsString()
  mechanic_response: string;
}
