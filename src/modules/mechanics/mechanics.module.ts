import { Module } from '@nestjs/common';
import { MechanicsController } from './mechanics.controller';
import { MechanicsService } from './mechanics.service';
import { MechanicProfileService } from './services/mechanic-profile.service';
import { MechanicWorkingHoursService } from './services/mechanic-working-hours.service';
import { MechanicSupportedVehiclesService } from './services/mechanic-supported-vehicles.service';
import { MechanicCategoriesService } from './services/mechanic-categories.service';
import { MechanicSearchService } from './services/mechanic-search.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [
    PrismaModule,
    LocationsModule
  ],
  controllers: [MechanicsController],
  providers: [
    MechanicsService, 
    MechanicProfileService, 
    MechanicWorkingHoursService,
    MechanicSupportedVehiclesService,
    MechanicCategoriesService,
    MechanicSearchService,
    PrismaService
  ],
  exports: [MechanicsService]
})
export class MechanicsModule {}
