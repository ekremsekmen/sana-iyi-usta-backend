import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SlotService } from './services/slot.service';
import { AppointmentManagementService } from './services/appointment-management.service';
import { AppointmentQueryService } from './services/appointment-query.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AppointmentReminderService } from './services/appointment-reminder.service';

@Module({
  imports: [NotificationsModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    SlotService,
    AppointmentManagementService,
    AppointmentQueryService,
    PrismaService,
    AppointmentReminderService
  ],
  exports: [AppointmentsService]
})
export class AppointmentsModule {}
