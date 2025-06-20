import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MessagesGateway } from './messages.gateway';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { MessagesGatewayProvider } from './messages-gateway.provider';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    NotificationsModule, // FCM servisini içeren modülü ekledik
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, MessagesGatewayProvider],
  exports: [MessagesService]
})
export class MessagesModule {}
