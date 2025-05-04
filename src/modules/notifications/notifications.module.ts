import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { FcmService } from './services/fcm.service';
import { CampaignNotificationService } from './services/campaign-notification.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService, 
    FcmService, 
    CampaignNotificationService
  ],
  exports: [NotificationsService]
})
export class NotificationsModule {}
