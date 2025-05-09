import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerVehicleService } from './services/customer-vehicle.service';
import { VehicleMaintenanceRecordService } from './services/vehicle-maintenance-record.service';
import { CustomerValidateService } from './services/customer-validate.service';
import { PrismaService } from '../../prisma/prisma.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [CustomersController],
  providers: [
    CustomersService, 
    CustomerVehicleService, 
    VehicleMaintenanceRecordService,
    CustomerValidateService,
    PrismaService
  ],
  exports: [CustomersService]
})
export class CustomersModule {}