import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehicleSelectService } from './services/vehicle-select.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VehiclesController],
  providers: [VehiclesService, VehicleSelectService],
  exports: [VehiclesService, VehicleSelectService]
})
export class VehiclesModule {}