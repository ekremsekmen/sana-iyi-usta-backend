import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: string, createMessageDto: CreateMessageDto): Promise<MessageDto> {
    const { receiverId, content } = createMessageDto;

    // Alıcı kullanıcının var olup olmadığını kontrol et
    const receiver = await this.prisma.users.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      throw new NotFoundException('Alıcı kullanıcı bulunamadı');
    }

    const message = await this.prisma.messages.create({
      data: {
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      },
    });

    return this.mapToMessageDto(message);
  }

  async getConversation(userId: string, otherUserId: string): Promise<any> {
    // Önce karşı kullanıcının bilgilerini al
    const otherUser = await this.prisma.users.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        full_name: true,
        profile_image: true,
      },
    });

    if (!otherUser) {
      throw new NotFoundException('Kullanıcı bulunamadı');
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

    // Okunmayan mesajların sayısı
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

  async getUserConversations(userId: string): Promise<any[]> {
    // Kullanıcının konuşmalarındaki benzersiz kullanıcı ID'lerini bul
    const conversations = await this.prisma.$queryRaw<any[]>`
      SELECT DISTINCT
        CASE 
          WHEN m.sender_id = ${userId}::uuid THEN m.receiver_id
          ELSE m.sender_id
        END as user_id,
        u.full_name,
        u.profile_image,
        (
          SELECT content FROM messages 
          WHERE (sender_id = ${userId}::uuid AND receiver_id = user_id) 
             OR (sender_id = user_id AND receiver_id = ${userId}::uuid)
          ORDER BY sent_at DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT sent_at FROM messages 
          WHERE (sender_id = ${userId}::uuid AND receiver_id = user_id) 
             OR (sender_id = user_id AND receiver_id = ${userId}::uuid)
          ORDER BY sent_at DESC 
          LIMIT 1
        ) as last_message_time,
        (
          SELECT COUNT(*) FROM messages 
          WHERE receiver_id = ${userId}::uuid 
          AND sender_id = user_id 
          AND is_read = false
        ) as unread_count
      FROM messages m
      JOIN users u ON u.id = CASE 
        WHEN m.sender_id = ${userId}::uuid THEN m.receiver_id
        ELSE m.sender_id
      END
      WHERE m.sender_id = ${userId}::uuid OR m.receiver_id = ${userId}::uuid
      ORDER BY last_message_time DESC
    `;

    return Array.isArray(conversations) ? conversations : [];
  }

  async markAsRead(messageId: string, userId: string): Promise<MessageDto> {
    const message = await this.prisma.messages.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    if (message.receiver_id !== userId) {
      throw new NotFoundException('Bu mesajı okundu olarak işaretleme yetkiniz yok');
    }

    const updatedMessage = await this.prisma.messages.update({
      where: { id: messageId },
      data: { is_read: true },
    });

    return this.mapToMessageDto(updatedMessage);
  }

  async markAllAsRead(senderId: string, receiverId: string): Promise<void> {
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
  }

  private mapToMessageDto(message: any): MessageDto {
    return {
      id: message.id,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      content: message.content,
      sentAt: message.sent_at,
      isRead: message.is_read,
    };
  }
}
