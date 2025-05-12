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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const message_notification_service_1 = require("../notifications/services/message-notification.service");
let MessagesService = class MessagesService {
    constructor(prisma, messageNotificationService) {
        this.prisma = prisma;
        this.messageNotificationService = messageNotificationService;
    }
    setGateway(gateway) {
        this.messagesGateway = gateway;
    }
    async createMessage(senderId, createMessageDto) {
        const { receiverId, content } = createMessageDto;
        const receiver = await this.prisma.users.findUnique({
            where: { id: receiverId }
        });
        if (!receiver) {
            throw new common_1.NotFoundException('Alıcı kullanıcı bulunamadı');
        }
        const message = await this.prisma.messages.create({
            data: {
                sender_id: senderId,
                receiver_id: receiverId,
                content,
            },
        });
        const messageDto = this.mapToMessageDto(message);
        if (this.messagesGateway) {
            this.messagesGateway.notifyUser(receiverId, {
                type: 'new_message',
                message: messageDto
            });
        }
        await this.messageNotificationService.sendChatNotificationIfNeeded(senderId, receiverId);
        return messageDto;
    }
    async getConversation(userId, otherUserId) {
        const otherUser = await this.prisma.users.findUnique({
            where: { id: otherUserId },
            select: {
                id: true,
                full_name: true,
                profile_image: true,
            },
        });
        if (!otherUser) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        const messages = await this.prisma.messages.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            { sender_id: userId },
                            { receiver_id: otherUserId },
                        ],
                    },
                    {
                        AND: [
                            { sender_id: otherUserId },
                            { receiver_id: userId },
                        ],
                    },
                ],
            },
            orderBy: {
                sent_at: 'asc',
            },
        });
        const unreadCount = await this.prisma.messages.count({
            where: {
                sender_id: otherUserId,
                receiver_id: userId,
                is_read: false,
            },
        });
        return {
            user: otherUser,
            messages: messages.map(message => this.mapToMessageDto(message)),
            unreadCount,
        };
    }
    async getUserConversations(userId) {
        const conversations = await this.prisma.$queryRaw `
      WITH user_conversations AS (
        SELECT DISTINCT
          CASE 
            WHEN m.sender_id = ${userId}::uuid THEN m.receiver_id
            ELSE m.sender_id
          END as other_user_id
        FROM messages m
        WHERE m.sender_id = ${userId}::uuid OR m.receiver_id = ${userId}::uuid
      )
      
      SELECT
        uc.other_user_id as user_id,
        u.full_name,
        u.profile_image,
        (
          SELECT content FROM messages 
          WHERE (sender_id = ${userId}::uuid AND receiver_id = uc.other_user_id) 
             OR (sender_id = uc.other_user_id AND receiver_id = ${userId}::uuid)
          ORDER BY sent_at DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT sent_at FROM messages 
          WHERE (sender_id = ${userId}::uuid AND receiver_id = uc.other_user_id) 
             OR (sender_id = uc.other_user_id AND receiver_id = ${userId}::uuid)
          ORDER BY sent_at DESC 
          LIMIT 1
        ) as last_message_time,
        (
          SELECT CAST(COUNT(*) AS INTEGER) FROM messages 
          WHERE receiver_id = ${userId}::uuid 
          AND sender_id = uc.other_user_id 
          AND is_read = false
        ) as unread_count
      FROM user_conversations uc
      JOIN users u ON u.id = uc.other_user_id
      ORDER BY last_message_time DESC
    `;
        return Array.isArray(conversations) ? conversations : [];
    }
    async markAsRead(messageId, userId) {
        const message = await this.prisma.messages.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw new common_1.NotFoundException('Mesaj bulunamadı');
        }
        if (message.receiver_id !== userId) {
            throw new common_1.NotFoundException('Bu mesajı okundu olarak işaretleme yetkiniz yok');
        }
        const updatedMessage = await this.prisma.messages.update({
            where: { id: messageId },
            data: { is_read: true },
        });
        const messageDto = this.mapToMessageDto(updatedMessage);
        if (this.messagesGateway) {
            this.messagesGateway.notifyUser(message.sender_id, {
                type: 'message_read',
                messageId
            });
        }
        return messageDto;
    }
    async markAllAsRead(senderId, receiverId) {
        await this.prisma.messages.updateMany({
            where: {
                sender_id: senderId,
                receiver_id: receiverId,
                is_read: false,
            },
            data: {
                is_read: true,
            },
        });
        if (this.messagesGateway) {
            this.messagesGateway.notifyUser(senderId, {
                type: 'all_messages_read',
                receiverId
            });
        }
    }
    async deleteConversation(userId, otherUserId) {
        const otherUser = await this.prisma.users.findUnique({
            where: { id: otherUserId },
        });
        if (!otherUser) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        await this.prisma.messages.deleteMany({
            where: {
                OR: [
                    {
                        AND: [
                            { sender_id: userId },
                            { receiver_id: otherUserId },
                        ],
                    },
                    {
                        AND: [
                            { sender_id: otherUserId },
                            { receiver_id: userId },
                        ],
                    },
                ],
            },
        });
        if (this.messagesGateway) {
            this.messagesGateway.notifyUser(otherUserId, {
                type: 'conversation_deleted',
                userId
            });
        }
        return { success: true };
    }
    mapToMessageDto(message) {
        return {
            id: message.id,
            senderId: message.sender_id,
            receiverId: message.receiver_id,
            content: message.content,
            sentAt: message.sent_at,
            isRead: message.is_read,
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        message_notification_service_1.MessageNotificationService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map