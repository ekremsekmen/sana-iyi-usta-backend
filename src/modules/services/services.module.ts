import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceSelectService } from './services/service-select.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServiceSelectService],
  exports: [ServicesService, ServiceSelectService]
})
export class ServicesModule {}
