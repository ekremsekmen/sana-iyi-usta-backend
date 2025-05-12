import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    createMessage(req: RequestWithUser, createMessageDto: CreateMessageDto): Promise<import("./dto/message.dto").MessageDto>;
    getUserConversations(req: RequestWithUser): Promise<any[]>;
    getConversation(req: RequestWithUser, otherUserId: string): Promise<any>;
    markAsRead(req: RequestWithUser, messageId: string): Promise<import("./dto/message.dto").MessageDto>;
    markAllAsRead(req: RequestWithUser, senderId: string): Promise<void>;
    deleteConversation(req: RequestWithUser, otherUserId: string): Promise<{
        success: boolean;
    }>;
}
