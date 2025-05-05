import { MessageDto } from './message.dto';

export class UserInfoDto {
  id: string;
  fullName: string;
  profileImage?: string;
}

export class ConversationDto {
  user: UserInfoDto;
  messages: MessageDto[];
  unreadCount: number;
}
