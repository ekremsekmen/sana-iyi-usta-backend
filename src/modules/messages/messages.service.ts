import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDto } from './dto/message.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  // WebSocket gateway'e referans - bu dependency injection döngüsü sorununu çözmek için kullanılıyor
  private messagesGateway: any;

  constructor(private prisma: PrismaService) {}

  // Gateway için setter metodu - döngüsel bağımlılıkları önlemek için
  setGateway(gateway: any) {
    this.messagesGateway = gateway;
  }

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

    const messageDto = this.mapToMessageDto(message);

    // WebSocket entegrasyonu - eğer gateway ayarlanmışsa bildirim gönder
    if (this.messagesGateway) {
      this.messagesGateway.notifyUser(receiverId, {
        type: 'new_message',
        message: messageDto
      });
    }

    return messageDto;
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

// ...existing code...
// ...existing code...
async getUserConversations(userId: string): Promise<any[]> {
  const conversations = await this.prisma.$queryRaw`
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
// ...existing code...
// ...existing code...

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

    const messageDto = this.mapToMessageDto(updatedMessage);

    // WebSocket entegrasyonu - mesaj okunduğunda göndericiyi bilgilendir
    if (this.messagesGateway) {
      this.messagesGateway.notifyUser(message.sender_id, {
        type: 'message_read',
        messageId
      });
    }

    return messageDto;
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

    // WebSocket entegrasyonu - tüm mesajlar okunduğunda göndericiyi bilgilendir
    if (this.messagesGateway) {
      this.messagesGateway.notifyUser(senderId, {
        type: 'all_messages_read',
        receiverId
      });
    }
  }

  async deleteConversation(userId: string, otherUserId: string): Promise<{ success: boolean }> {
    // Önce karşı kullanıcının var olup olmadığını kontrol et
    const otherUser = await this.prisma.users.findUnique({
      where: { id: otherUserId },
    });

    if (!otherUser) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // İki kullanıcı arasındaki tüm mesajları sil
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

    // WebSocket entegrasyonu - konuşma silindiğinde diğer kullanıcıyı bilgilendir
    if (this.messagesGateway) {
      this.messagesGateway.notifyUser(otherUserId, {
        type: 'conversation_deleted',
        userId
      });
    }

    return { success: true };
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
