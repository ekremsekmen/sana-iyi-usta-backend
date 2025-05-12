"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const common_1 = require("@nestjs/common");
let MessagesGateway = class MessagesGateway {
    constructor(messagesService, jwtService) {
        this.messagesService = messagesService;
        this.jwtService = jwtService;
        this.userSocketMap = new Map();
        this.socketUserMap = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token ||
                client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            });
            const userId = payload.sub;
            if (!userId) {
                client.disconnect();
                return;
            }
            this.userSocketMap.set(userId, client.id);
            this.socketUserMap.set(client.id, userId);
            console.log(`Kullanıcı bağlandı: ${userId}`);
        }
        catch (error) {
            console.error('Bağlantı hatası:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = this.socketUserMap.get(client.id);
        if (userId) {
            this.userSocketMap.delete(userId);
            console.log(`Kullanıcı ayrıldı: ${userId}`);
        }
        this.socketUserMap.delete(client.id);
    }
    async handleSendMessage(client, createMessageDto) {
        const userId = this.socketUserMap.get(client.id);
        if (!userId) {
            return { error: 'Kimlik doğrulanamadı' };
        }
        try {
            const message = await this.messagesService.createMessage(userId, createMessageDto);
            const receiverSocketId = this.userSocketMap.get(createMessageDto.receiverId);
            if (receiverSocketId) {
                this.server.to(receiverSocketId).emit('newMessage', message);
            }
            return message;
        }
        catch (error) {
            console.error('Mesaj gönderme hatası:', error);
            return { error: error.message };
        }
    }
    async handleMarkAsRead(client, data) {
        const userId = this.socketUserMap.get(client.id);
        if (!userId) {
            return { error: 'Kimlik doğrulanamadı' };
        }
        try {
            const message = await this.messagesService.markAsRead(data.messageId, userId);
            const senderSocketId = this.userSocketMap.get(message.senderId);
            if (senderSocketId) {
                this.server.to(senderSocketId).emit('messageRead', { messageId: message.id });
            }
            return message;
        }
        catch (error) {
            console.error('Mesaj okuma hatası:', error);
            return { error: error.message };
        }
    }
    async handleMarkAllAsRead(client, data) {
        const userId = this.socketUserMap.get(client.id);
        if (!userId) {
            return { error: 'Kimlik doğrulanamadı' };
        }
        try {
            await this.messagesService.markAllAsRead(data.senderId, userId);
            const senderSocketId = this.userSocketMap.get(data.senderId);
            if (senderSocketId) {
                this.server.to(senderSocketId).emit('allMessagesRead', { receiverId: userId });
            }
            return { success: true };
        }
        catch (error) {
            console.error('Toplu mesaj okuma hatası:', error);
            return { error: error.message };
        }
    }
    async handleDeleteConversation(client, data) {
        const userId = this.socketUserMap.get(client.id);
        if (!userId) {
            return { error: 'Kimlik doğrulanamadı' };
        }
        try {
            const result = await this.messagesService.deleteConversation(userId, data.otherUserId);
            const otherUserSocketId = this.userSocketMap.get(data.otherUserId);
            if (otherUserSocketId) {
                this.server.to(otherUserSocketId).emit('conversationDeleted', { userId });
            }
            return result;
        }
        catch (error) {
            console.error('Konuşma silme hatası:', error);
            return { error: error.message };
        }
    }
    notifyUser(userId, message) {
        const socketId = this.userSocketMap.get(userId);
        if (socketId) {
            this.server.to(socketId).emit('notification', message);
        }
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAllAsRead'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMarkAllAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteConversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleDeleteConversation", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        jwt_1.JwtService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map