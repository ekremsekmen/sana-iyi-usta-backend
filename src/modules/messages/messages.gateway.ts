import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Kullanıcı ID -> Socket ID eşlemesi
  private userSocketMap = new Map<string, string>();
  // Socket ID -> Kullanıcı ID eşlemesi
  private socketUserMap = new Map<string, string>();

  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Token doğrulama
      const token = client.handshake.auth.token || 
                  client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      // Token'dan kullanıcı kimliğini doğrula
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
      
      const userId = payload.sub;

      if (!userId) {
        client.disconnect();
        return;
      }

      // Kullanıcı ID ve Socket ID eşlemelerini kaydet
      this.userSocketMap.set(userId, client.id);
      this.socketUserMap.set(client.id, userId);

      console.log(`Kullanıcı bağlandı: ${userId}`);
    } catch (error) {
      console.error('Bağlantı hatası:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Kullanıcı ayrıldığında eşlemeleri temizle
    const userId = this.socketUserMap.get(client.id);
    
    if (userId) {
      this.userSocketMap.delete(userId);
      console.log(`Kullanıcı ayrıldı: ${userId}`);
    }
    
    this.socketUserMap.delete(client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const userId = this.socketUserMap.get(client.id);
    
    if (!userId) {
      return { error: 'Kimlik doğrulanamadı' };
    }

    try {
      const message = await this.messagesService.createMessage(userId, createMessageDto);
      
      // Mesajı alıcıya iletme
      const receiverSocketId = this.userSocketMap.get(createMessageDto.receiverId);
      
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newMessage', message);
      }
      
      return message;
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      return { error: error.message };
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    const userId = this.socketUserMap.get(client.id);
    
    if (!userId) {
      return { error: 'Kimlik doğrulanamadı' };
    }

    try {
      const message = await this.messagesService.markAsRead(data.messageId, userId);
      
      // Mesajın okunduğunu göndericiye bildir
      const senderSocketId = this.userSocketMap.get(message.senderId);
      
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('messageRead', { messageId: message.id });
      }
      
      return message;
    } catch (error) {
      console.error('Mesaj okuma hatası:', error);
      return { error: error.message };
    }
  }

  @SubscribeMessage('markAllAsRead')
  async handleMarkAllAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { senderId: string },
  ) {
    const userId = this.socketUserMap.get(client.id);
    
    if (!userId) {
      return { error: 'Kimlik doğrulanamadı' };
    }

    try {
      await this.messagesService.markAllAsRead(data.senderId, userId);
      
      // Tüm mesajların okunduğunu göndericiye bildir
      const senderSocketId = this.userSocketMap.get(data.senderId);
      
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('allMessagesRead', { receiverId: userId });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Toplu mesaj okuma hatası:', error);
      return { error: error.message };
    }
  }

  @SubscribeMessage('deleteConversation')
  async handleDeleteConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { otherUserId: string },
  ) {
    const userId = this.socketUserMap.get(client.id);
    
    if (!userId) {
      return { error: 'Kimlik doğrulanamadı' };
    }

    try {
      const result = await this.messagesService.deleteConversation(userId, data.otherUserId);
      
      // Konuşma silindiğini diğer kullanıcıya bildir
      const otherUserSocketId = this.userSocketMap.get(data.otherUserId);
      
      if (otherUserSocketId) {
        this.server.to(otherUserSocketId).emit('conversationDeleted', { userId });
      }
      
      return result;
    } catch (error) {
      console.error('Konuşma silme hatası:', error);
      return { error: error.message };
    }
  }

  // Kullanıcı için yeni bir mesaj geldiğinde bildirim gönderme
  notifyUser(userId: string, message: any) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', message);
    }
  }
}
