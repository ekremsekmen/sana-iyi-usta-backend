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
import { LocationsModule } from './modules/locations/locations.module'; // Eklendi
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 1000, 
      name: 'default',
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
    LocationsModule, // Eklendi
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
