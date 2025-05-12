import { MessageDto } from './message.dto';
export declare class UserInfoDto {
    id: string;
    fullName: string;
    profileImage?: string;
}
export declare class ConversationDto {
    user: UserInfoDto;
    messages: MessageDto[];
    unreadCount: number;
}
