import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CampaignNotificationService } from './services/campaign-notification.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly campaignNotificationService: CampaignNotificationService
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notifications.create({
      data: {
        user_id: createNotificationDto.userId,
        message: createNotificationDto.message,
        type: createNotificationDto.type,
      },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notifications.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async sendCampaignNotifications(
    mechanicId: string, 
    campaignId: string, 
    campaignTitle: string,
    brandIds: string[],
  ) {
    return this.campaignNotificationService.sendCampaignNotifications(
      mechanicId,
      campaignId,
      campaignTitle,
      brandIds
    );
  }
}
