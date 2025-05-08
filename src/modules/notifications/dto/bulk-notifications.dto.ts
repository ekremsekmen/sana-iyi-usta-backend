import { IsArray, IsUUID } from 'class-validator';

export class BulkNotificationsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  notificationIds: string[];
}
