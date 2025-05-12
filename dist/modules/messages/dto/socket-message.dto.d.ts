export declare class SocketMessageDto {
    receiverId: string;
    content: string;
}
export declare class SocketReadMessageDto {
    messageId: string;
}
export declare class SocketReadAllMessagesDto {
    senderId: string;
}
export declare class SocketDeleteConversationDto {
    otherUserId: string;
}
export declare class SocketNotificationDto {
    type: 'new_message' | 'message_read' | 'all_messages_read' | 'conversation_deleted';
    data: any;
}
