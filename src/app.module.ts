import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MechanicsModule } from './modules/mechanics/mechanics.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';
import { CustomersModule } from './modules/customers/customers.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    // Throttler modülü için doğru yapılandırma
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 dakika
      limit: 1000, // Çok yüksek bir limit
      name: 'default', // Throttler için bir isim belirtmek gerekiyor
    }]),
    AuthModule,
    UsersModule,
    MechanicsModule,
    AppointmentsModule,
    VehiclesModule,
    CampaignsModule,
    NotificationsModule,
    MessagesModule,
    ReviewsModule,
    ServiceRequestsModule,
    CustomersModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
