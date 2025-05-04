import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getUserNotifications(@Req() request: RequestWithUser) {
    return this.notificationsService.getUserNotifications(request.user.id);
  }

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async createNotification(
    @Body(ValidationPipe) createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationsService.createNotification(createNotificationDto);
  }
}
