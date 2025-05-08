import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, ValidationPipe, Param, ParseUUIDPipe, Patch, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { BulkNotificationsDto } from './dto/bulk-notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getUserNotifications(@Req() request: RequestWithUser) {
    return this.notificationsService.getUserNotifications(request.user.id);
  }

  @Patch('mark-read-all')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async markAllNotificationsAsRead(@Req() request: RequestWithUser) {
    return this.notificationsService.markAllNotificationsAsRead(request.user.id);
  }

  @Patch(':id/mark-read')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async markNotificationAsRead(
    @Req() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.notificationsService.markNotificationAsRead(
      request.user.id,
      id
    );
  }

  @Delete('delete-all')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAllNotifications(
    @Req() request: RequestWithUser
  ) {
    return this.notificationsService.deleteAllNotifications(
      request.user.id
    );
  }

  @Delete(':id/delete')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async deleteNotification(
    @Req() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.notificationsService.deleteNotification(
      request.user.id,
      id
    );
  }
}
