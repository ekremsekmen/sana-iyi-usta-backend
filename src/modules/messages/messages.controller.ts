import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtGuard } from '../../common/guards';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('messages')
@UseGuards(JwtGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async createMessage(@Request() req: RequestWithUser, @Body() createMessageDto: CreateMessageDto) {
    const userId = req.user.id;
    return this.messagesService.createMessage(userId, createMessageDto);
  }

  @Get('conversations')
  async getUserConversations(@Request() req: RequestWithUser) {
    const userId = req.user.id;
    return this.messagesService.getUserConversations(userId);
  }

  @Get('conversation/:userId')
  async getConversation(@Request() req: RequestWithUser, @Param('userId') otherUserId: string) {
    const userId = req.user.id;
    return this.messagesService.getConversation(userId, otherUserId);
  }

  @Put(':messageId/read')
  async markAsRead(@Request() req: RequestWithUser, @Param('messageId') messageId: string) {
    const userId = req.user.id;
    return this.messagesService.markAsRead(messageId, userId);
  }

  @Put('read-all/:senderId')
  async markAllAsRead(@Request() req: RequestWithUser, @Param('senderId') senderId: string) {
    const userId = req.user.id;
    return this.messagesService.markAllAsRead(senderId, userId);
  }

  @Delete('conversation/:userId')
  async deleteConversation(@Request() req: RequestWithUser, @Param('userId') otherUserId: string) {
    const userId = req.user.id;
    return this.messagesService.deleteConversation(userId, otherUserId);
  }
}
