import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class SocketMessageDto {
  @IsNotEmpty()
  @IsUUID()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class SocketReadMessageDto {
  @IsNotEmpty()
  @IsUUID()
  messageId: string;
}

export class SocketReadAllMessagesDto {
  @IsNotEmpty()
  @IsUUID()
  senderId: string;
}

export class SocketDeleteConversationDto {
  @IsNotEmpty()
  @IsUUID()
  otherUserId: string;
}

export class SocketNotificationDto {
  @IsNotEmpty()
  @IsString()
  type: 'new_message' | 'message_read' | 'all_messages_read' | 'conversation_deleted';

  @IsOptional()
  data: any;
}
