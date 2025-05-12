import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private messagesService;
    private jwtService;
    server: Server;
    private userSocketMap;
    private socketUserMap;
    constructor(messagesService: MessagesService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSendMessage(client: Socket, createMessageDto: CreateMessageDto): Promise<import("./dto/message.dto").MessageDto | {
        error: any;
    }>;
    handleMarkAsRead(client: Socket, data: {
        messageId: string;
    }): Promise<import("./dto/message.dto").MessageDto | {
        error: any;
    }>;
    handleMarkAllAsRead(client: Socket, data: {
        senderId: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
    }>;
    handleDeleteConversation(client: Socket, data: {
        otherUserId: string;
    }): Promise<{
        success: boolean;
    } | {
        error: any;
    }>;
    notifyUser(userId: string, message: any): void;
}
