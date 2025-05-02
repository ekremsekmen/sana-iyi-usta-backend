import { Module } from '@nestjs/common';
import { MechanicsController } from './mechanics.controller';
import { MechanicsService } from './mechanics.service';
import { MechanicProfileService } from './services/mechanic-profile.service';
import { MechanicWorkingHoursService } from './services/mechanic-working-hours.service';
import { MechanicSupportedVehiclesService } from './services/mechanic-supported-vehicles.service';
import { MechanicCategoriesService } from './services/mechanic-categories.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MechanicsController],
  providers: [
    MechanicsService, 
    MechanicProfileService, 
    MechanicWorkingHoursService,
    MechanicSupportedVehiclesService,
    MechanicCategoriesService,
    PrismaService
  ],
  exports: [MechanicsService]
})
export class MechanicsModule {}
