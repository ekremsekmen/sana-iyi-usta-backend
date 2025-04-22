import { Module } from '@nestjs/common';
import { MechanicsController } from './mechanics.controller';
import { MechanicsService } from './mechanics.service';
import { MechanicProfileService } from './services/mechanic-profile.service';
import { MechanicWorkingHoursService } from './services/mechanic-working-hours.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MechanicsController],
  providers: [
    MechanicsService, 
    MechanicProfileService, 
    MechanicWorkingHoursService,
    PrismaService
  ]
})
export class MechanicsModule {}
