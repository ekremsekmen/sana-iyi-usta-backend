import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServiceSelectService } from './services/service-select.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServiceSelectService],
  exports: [ServicesService, ServiceSelectService]
})
export class ServicesModule {}
