import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { MessageNotificationService } from '../notifications/services/message-notification.service';
export declare class MessagesService {
    private prisma;
    private messageNotificationService;
    private messagesGateway;
    constructor(prisma: PrismaService, messageNotificationService: MessageNotificationService);
    setGateway(gateway: any): void;
    createMessage(senderId: string, createMessageDto: CreateMessageDto): Promise<MessageDto>;
    getConversation(userId: string, otherUserId: string): Promise<any>;
    getUserConversations(userId: string): Promise<any[]>;
    markAsRead(messageId: string, userId: string): Promise<MessageDto>;
    markAllAsRead(senderId: string, receiverId: string): Promise<void>;
    deleteConversation(userId: string, otherUserId: string): Promise<{
        success: boolean;
    }>;
    private mapToMessageDto;
}
