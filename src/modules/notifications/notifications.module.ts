import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { FcmService } from './services/fcm.service';
import { CampaignNotificationService } from './services/campaign-notification.service';
import { AppointmentNotificationService } from './services/appointment-notification.service';
import { MessageNotificationService } from './services/message-notification.service';
import { MaintenanceReminderNotificationService } from './services/maintenance-reminder-notification.service';
import { ReviewNotificationService } from './services/review-notification.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService, 
    FcmService, 
    CampaignNotificationService,
    AppointmentNotificationService,
    MessageNotificationService,
    MaintenanceReminderNotificationService,
    ReviewNotificationService
  ],
  exports: [
    NotificationsService, 
    AppointmentNotificationService, 
    FcmService,
    MessageNotificationService,
    MaintenanceReminderNotificationService,
    ReviewNotificationService
  ]
})
export class NotificationsModule {}
